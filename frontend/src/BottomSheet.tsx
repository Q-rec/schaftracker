import { useEffect, useState } from "react";
import arrowLeftIcon from "./assets/arrow-left.svg";
import schafIcon from "./assets/schaf-icon.svg";
import sunIcon from "./assets/sun.svg";
import weatherCloudIcon from "./assets/weather-cloud.svg";
import weatherFogIcon from "./assets/weather-fog.svg";
import weatherRainIcon from "./assets/weather-rain.svg";
import weatherSnowIcon from "./assets/weather-snow.svg";
import weatherStormIcon from "./assets/weather-storm.svg";
import type { CurrentSighting, ParkWeather, ViewState, WeatherCondition } from "./types";

const WEATHER_ICONS: Record<WeatherCondition, string> = {
  clear: sunIcon,
  cloudy: weatherCloudIcon,
  fog: weatherFogIcon,
  rain: weatherRainIcon,
  snow: weatherSnowIcon,
  storm: weatherStormIcon,
};

interface BottomSheetProps {
  view: ViewState;
  sighting: CurrentSighting | null;
  weather: ParkWeather | null;
  onConfirm: () => void;
  onNotThereAnymore: () => void;
  onWhereAreTheSheep: () => void;
  onUseMyLocation: () => void;
  onStartHandpick: () => void;
  onSubmitHandpick: () => void;
  onCancelHandpick: () => void;
  onBack: () => void;
  handpickPinSet: boolean;
  busy: boolean;
  error: string | null;
}

function ErrorMessage({ error }: { error: string | null }) {
  if (!error) return null;
  return <p className="sheet__error">{error}</p>;
}

function formatConfirmCount(count: number): string {
  return count === 1 ? "Heute von 1 Person bestätigt." : `Heute von ${count} Leuten bestätigt.`;
}

function WeatherBadge({ weather }: { weather: ParkWeather | null }) {
  if (weather === null) return null;
  return (
    <div className="sheet__weather">
      <img className="sheet__weather-icon" src={WEATHER_ICONS[weather.condition]} alt="" />
      <span>{weather.temperatureC}°C</span>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="sheet__back" onClick={onClick}>
      <img className="sheet__back-icon" src={arrowLeftIcon} alt="" />
      zurück
    </button>
  );
}

function CollapseButton({ collapsed, onClick }: { collapsed: boolean; onClick: () => void }) {
  return (
    <button
      className={`sheet__collapse${collapsed ? " sheet__collapse--centered" : ""}`}
      onClick={onClick}
      aria-label={collapsed ? "Ausklappen" : "Einklappen"}
    >
      <svg width="28" height="28" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        {collapsed
          ? <path d="M5 12l5-5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        }
      </svg>
    </button>
  );
}

export function BottomSheet(props: BottomSheetProps) {
  const { view, sighting, weather } = props;
  const [collapsed, setCollapsed] = useState(false);

  // Reset to expanded whenever the view changes
  useEffect(() => { setCollapsed(false); }, [view]);

  const collapsible = view === "known" || view === "uncertain" || view === "unknown";

  if (view === "known" && sighting) {
    return (
      <div className="sheet">
        {collapsible && <CollapseButton collapsed={collapsed} onClick={() => setCollapsed((c) => !c)} />}
        {!collapsed && <WeatherBadge weather={weather} />}
        <div className="sheet__status">
          <div className="sheet__status-row">
            <img className="sheet__icon" src={schafIcon} alt="" />
            <p className="sheet__title">Schaf Position bestätigt.</p>
          </div>
          {!collapsed && <p className="sheet__subtitle">{formatConfirmCount(sighting.confirmCount)}</p>}
        </div>
        {!collapsed && <ErrorMessage error={props.error} />}
        {!collapsed && (
          <div className="sheet__buttons">
            <button className="btn btn--accent" disabled={props.busy} onClick={props.onConfirm}>
              Ja, stimmt noch
            </button>
            <button className="btn btn--accent-outline" disabled={props.busy} onClick={props.onNotThereAnymore}>
              Stimmt nicht mehr
            </button>
          </div>
        )}
      </div>
    );
  }

  if (view === "uncertain" && sighting) {
    return (
      <div className="sheet">
        {collapsible && <CollapseButton collapsed={collapsed} onClick={() => setCollapsed((c) => !c)} />}
        {!collapsed && <WeatherBadge weather={weather} />}
        <div className="sheet__status">
          <div className="sheet__status-row">
            <img className="sheet__icon sheet__icon--uncertain" src={schafIcon} alt="" />
            <p className="sheet__title">Schaf Position unsicher.</p>
          </div>
          {!collapsed && <p className="sheet__subtitle">{sighting.uncertainLabel}</p>}
        </div>
        {!collapsed && <ErrorMessage error={props.error} />}
        {!collapsed && (
          <div className="sheet__buttons">
            <button className="btn btn--accent" disabled={props.busy} onClick={props.onConfirm}>
              Ja, stimmt noch
            </button>
            <button className="btn btn--accent-outline" disabled={props.busy} onClick={props.onWhereAreTheSheep}>
              Neue Position melden
            </button>
          </div>
        )}
      </div>
    );
  }

  if (view === "unknown") {
    return (
      <div className="sheet">
        {collapsible && <CollapseButton collapsed={collapsed} onClick={() => setCollapsed((c) => !c)} />}
        {!collapsed && <WeatherBadge weather={weather} />}
        <div className="sheet__status">
          <div className="sheet__status-row">
            <img className="sheet__icon sheet__icon--unknown" src={schafIcon} alt="" />
            <p className="sheet__title">Schaf Position unbekannt.</p>
          </div>
        </div>
        {!collapsed && (
          <div className="sheet__buttons">
            <button className="btn btn--accent" disabled={props.busy} onClick={props.onWhereAreTheSheep}>
              Position angeben
            </button>
          </div>
        )}
      </div>
    );
  }

  if (view === "thankyou" && sighting) {
    return (
      <div className="sheet">
        <BackButton onClick={props.onBack} />
        <div className="sheet__status">
          <div className="sheet__status-row">
            <img className="sheet__icon" src={schafIcon} alt="" />
            <p className="sheet__title">Danke für deine Bestätigung</p>
          </div>
          <p className="sheet__subtitle">{formatConfirmCount(sighting.confirmCount)}</p>
        </div>
      </div>
    );
  }

  if (view === "where-are-the-sheep") {
    return (
      <div className="sheet">
        <BackButton onClick={props.onBack} />
        <div className="sheet__status">
          <div className="sheet__status-row">
            <img className="sheet__icon" src={schafIcon} alt="" />
            <p className="sheet__title">Wo sind die Schafe?</p>
          </div>
        </div>
        <ErrorMessage error={props.error} />
        <div className="sheet__buttons">
          <button className="btn btn--accent" disabled={props.busy} onClick={props.onUseMyLocation}>
            Meinen Standort nutzen
          </button>
          <button className="btn btn--accent-outline" disabled={props.busy} onClick={props.onStartHandpick}>
            Auf Karte auswählen
          </button>
        </div>
      </div>
    );
  }

  if (view === "handpick") {
    return (
      <div className="sheet">
        <BackButton onClick={props.onCancelHandpick} />
        <div className="sheet__status">
          <div className="sheet__status-row">
            <img className="sheet__icon" src={schafIcon} alt="" />
            <p className="sheet__title">Tippe auf die Karte, um die Position zu markieren.</p>
          </div>
        </div>
        <ErrorMessage error={props.error} />
        <div className="sheet__buttons">
          <button
            className="btn btn--accent"
            disabled={props.busy || !props.handpickPinSet}
            onClick={props.onSubmitHandpick}
          >
            Position bestätigen
          </button>
        </div>
      </div>
    );
  }

  return null;
}
