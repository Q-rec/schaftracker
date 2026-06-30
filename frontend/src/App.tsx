import { useCallback, useEffect, useState } from "react";
import { AboutCard } from "./AboutCard";
import { confirmSighting, createSighting, getCurrentSighting, getWeather } from "./api";
import { BottomSheet } from "./BottomSheet";
import { DatenschutzCard } from "./DatenschutzCard";
import { Header } from "./Header";
import { ImpressumCard } from "./ImpressumCard";
import { hasSeenIntro, markIntroSeen } from "./intro";
import { DEFAULT_CENTER, MapView } from "./MapView";
import type { CurrentSighting, OverlayView, ParkWeather, ViewState } from "./types";

function statusToView(status: CurrentSighting["status"]): ViewState {
  return status;
}

function App() {
  const [sighting, setSighting] = useState<CurrentSighting | null>(null);
  const [view, setView] = useState<ViewState>("unknown");
  const [weather, setWeather] = useState<ParkWeather | null>(null);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [overlay, setOverlay] = useState<OverlayView>(null);

  const refreshSighting = useCallback(async () => {
    const current = await getCurrentSighting();
    setSighting(current);
    setView(current ? statusToView(current.status) : "unknown");
  }, []);

  useEffect(() => {
    refreshSighting().finally(() => setInitialLoadDone(true));
    getWeather()
      .then((result) => setWeather(result))
      .catch(() => setWeather(null));
    if (!hasSeenIntro()) {
      setOverlay("about");
    }
  }, [refreshSighting]);

  const handleConfirm = useCallback(async () => {
    if (!sighting) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await confirmSighting(sighting.id);
      setSighting(updated);
      setView("thankyou");
    } catch {
      setError("Bestätigung konnte nicht gespeichert werden. Bitte versuch es noch einmal.");
    } finally {
      setBusy(false);
    }
  }, [sighting]);

  const handleSubmitHandpick = useCallback(async () => {
    if (!pendingPin) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await createSighting(pendingPin.lat, pendingPin.lng);
      setSighting(updated);
      setPendingPin(null);
      setView("thankyou");
    } catch {
      setError("Position konnte nicht gemeldet werden. Bitte versuch es noch einmal.");
    } finally {
      setBusy(false);
    }
  }, [pendingPin]);

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setBusy(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserPosition({ lat, lng });
        try {
          const updated = await createSighting(lat, lng);
          setSighting(updated);
          setView("thankyou");
        } catch {
          setError("Position konnte nicht gemeldet werden. Bitte versuch es noch einmal.");
        } finally {
          setBusy(false);
        }
      },
      () => {
        setError("Standort konnte nicht ermittelt werden.");
        setBusy(false);
      },
    );
  }, []);

  const sheepPosition =
    sighting && (view === "known" || view === "uncertain" || view === "thankyou")
      ? { lat: sighting.lat, lng: sighting.lng }
      : null;
  const initialCenter = sighting ? { lat: sighting.lat, lng: sighting.lng } : DEFAULT_CENTER;

  return (
    <div className="app">
      {initialLoadDone && (
        <MapView
          initialCenter={initialCenter}
          sheepPosition={sheepPosition}
          sheepUncertain={view === "uncertain"}
          userPosition={userPosition}
          pendingPin={view === "handpick" ? pendingPin : null}
          onMapClick={view === "handpick" ? (lat, lng) => setPendingPin({ lat, lng }) : undefined}
        />
      )}
      <Header
        onNavigate={(target) => {
          markIntroSeen();
          setOverlay(target);
        }}
      />
      {overlay === "about" && (
        <AboutCard
          onClose={() => {
            markIntroSeen();
            setOverlay(null);
          }}
        />
      )}
      {overlay === "datenschutz" && <DatenschutzCard onClose={() => setOverlay(null)} />}
      {overlay === "impressum" && <ImpressumCard onClose={() => setOverlay(null)} />}
      {overlay === null && (
        <BottomSheet
          view={view}
          sighting={sighting}
          weather={weather}
          busy={busy}
          error={error}
          handpickPinSet={pendingPin !== null}
          onConfirm={handleConfirm}
          onNotThereAnymore={() => setView("where-are-the-sheep")}
          onWhereAreTheSheep={() => setView("where-are-the-sheep")}
          onUseMyLocation={handleUseMyLocation}
          onStartHandpick={() => {
            setPendingPin(sighting ? { lat: sighting.lat, lng: sighting.lng } : DEFAULT_CENTER);
            setView("handpick");
          }}
          onSubmitHandpick={handleSubmitHandpick}
          onCancelHandpick={() => {
            setPendingPin(null);
            setView("where-are-the-sheep");
          }}
          onBack={() => refreshSighting()}
        />
      )}
    </div>
  );
}

export default App;
