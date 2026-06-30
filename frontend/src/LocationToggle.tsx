interface LocationToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function LocationToggle({ enabled, onToggle }: LocationToggleProps) {
  return (
    <button
      className={`location-toggle${enabled ? " location-toggle--on" : ""}`}
      onClick={() => onToggle(!enabled)}
      aria-pressed={enabled}
    >
      <span className="location-toggle__label">Eigene Position zeigen</span>
      <span className="location-toggle__track" aria-hidden="true">
        <span className="location-toggle__knob" />
      </span>
    </button>
  );
}
