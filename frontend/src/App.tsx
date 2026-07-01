import { useCallback, useEffect, useRef, useState } from "react";
import { AboutCard } from "./AboutCard";
import { confirmSighting, createSighting, getCurrentSighting } from "./api";
import { BottomSheet } from "./BottomSheet";
import { DatenschutzCard } from "./DatenschutzCard";
import { Header } from "./Header";
import { ImpressumCard } from "./ImpressumCard";
import { hasSeenIntro, markIntroSeen } from "./intro";
import { LocationToggle } from "./LocationToggle";
import { SheepConfetti } from "./SheepConfetti";
import { DEFAULT_CENTER, MapView } from "./MapView";
import type { CurrentSighting, OverlayView, ViewState } from "./types";

function statusToView(status: CurrentSighting["status"]): ViewState {
  return status;
}

function App() {
  const [sighting, setSighting] = useState<CurrentSighting | null>(null);
  const [view, setView] = useState<ViewState>("unknown");
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [overlay, setOverlay] = useState<OverlayView>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const refreshSighting = useCallback(async () => {
    const current = await getCurrentSighting();
    setSighting(current);
    setView(current ? statusToView(current.status) : "unknown");
  }, []);

  useEffect(() => {
    refreshSighting().finally(() => setInitialLoadDone(true));
    if (!hasSeenIntro()) {
      setOverlay("about");
    }
  }, [refreshSighting]);

  const handleLocationToggle = useCallback((enabled: boolean) => {
    if (!navigator.geolocation) return;
    if (enabled) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => setLocationEnabled(false),
        { enableHighAccuracy: true },
      );
      setLocationEnabled(true);
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setUserPosition(null);
      setLocationEnabled(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!sighting) return;

    const COOLDOWN_MS = 4 * 60 * 60 * 1000;
    const lastConfirmed = Number(localStorage.getItem("sheep_last_confirmed") ?? 0);
    const onCooldown = Date.now() - lastConfirmed < COOLDOWN_MS;

    if (onCooldown) {
      setView("thankyou");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const updated = await confirmSighting(sighting.id);
      setSighting(updated);
      localStorage.setItem("sheep_last_confirmed", String(Date.now()));
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
    sighting && (view === "known" || view === "uncertain" || view === "thankyou" || view === "where-are-the-sheep")
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
          hideControls={overlay !== null}
        />
      )}
      <Header
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((o) => !o)}
        onNavigate={(target) => {
          markIntroSeen();
          setOverlay(target);
        }}
      />
      <SheepConfetti active={overlay === null && view === "thankyou"} />
      {overlay === null && (
        <LocationToggle
          enabled={locationEnabled}
          onToggle={handleLocationToggle}
          menuOpen={menuOpen}
        />
      )}
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
