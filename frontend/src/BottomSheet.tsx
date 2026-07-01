import { useEffect, useState } from "react";
import arrowLeftIcon from "./assets/arrow-left.svg";
import schafIcon from "./assets/schaf-icon.svg";
import type { CurrentSighting, ViewState } from "./types";

interface BottomSheetProps {
  view: ViewState;
  sighting: CurrentSighting | null;
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

function SheetWrapper({ back, children }: { back?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="sheet-wrapper">
      {back}
      <div className="sheet">{children}</div>
    </div>
  );
}

export function BottomSheet(props: BottomSheetProps) {
  const { view, sighting } = props;
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => { setCollapsed(false); }, [view]);

  const collapsible = view === "known" || view === "uncertain" || view === "unknown";

  if (view === "known" && sighting) {
    return (
      <SheetWrapper>
        {collapsible && <CollapseButton collapsed={collapsed} onClick={() => setCollapsed((c) => !c)} />}
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
      </SheetWrapper>
    );
  }

  if (view === "uncertain" && sighting) {
    return (
      <SheetWrapper>
        {collapsible && <CollapseButton collapsed={collapsed} onClick={() => setCollapsed((c) => !c)} />}
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
      </SheetWrapper>
    );
  }

  if (view === "unknown") {
    return (
      <SheetWrapper>
        {collapsible && <CollapseButton collapsed={collapsed} onClick={() => setCollapsed((c) => !c)} />}
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
      </SheetWrapper>
    );
  }

  if (view === "thankyou" && sighting) {
    return (
      <SheetWrapper back={<BackButton onClick={props.onBack} />}>
        <div className="sheet__status">
          <div className="sheet__status-row">
            <img className="sheet__icon" src={schafIcon} alt="" />
            <p className="sheet__title">Danke für deine Bestätigung</p>
          </div>
          <p className="sheet__subtitle">{formatConfirmCount(sighting.confirmCount)}</p>
        </div>
      </SheetWrapper>
    );
  }

  if (view === "where-are-the-sheep") {
    return (
      <SheetWrapper back={<BackButton onClick={props.onBack} />}>
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
      </SheetWrapper>
    );
  }

  if (view === "handpick") {
    return (
      <SheetWrapper back={<BackButton onClick={props.onCancelHandpick} />}>
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
      </SheetWrapper>
    );
  }

  return null;
}
