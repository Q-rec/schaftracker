import arrowLeftIcon from "./assets/arrow-left.svg";

interface DatenschutzCardProps {
  onClose: () => void;
}

export function DatenschutzCard({ onClose }: DatenschutzCardProps) {
  return (
    <div className="sheet sheet--about sheet--scrollable">
      <button className="sheet__back" onClick={onClose}>
        <img className="sheet__back-icon" src={arrowLeftIcon} alt="" />
        zurück
      </button>
      <p className="sheet__title">Datenschutzerklärung</p>
      <div className="legal-text">
        <p>
          <strong>1. Verantwortlicher</strong>
          <br />
          Bela Kurek
          <br />
          Tegeler Weg 106, 10589 Berlin
          <br />
          E-Mail: Bela.Kurek@berlin.de
        </p>

        <p>
          <strong>2. Grundsätzliches</strong>
          <br />
          Diese App kommt ohne Nutzerkonten, Cookies, Tracking oder Analyse-Tools aus. Es werden keine
          personenbezogenen Daten dauerhaft mit einer Person verknüpft gespeichert.
        </p>

        <p>
          <strong>3. Gemeldete Schaf-Sichtungen</strong>
          <br />
          Wenn du eine Schaf-Position meldest oder bestätigst, speichern wir Koordinaten (Breiten- und Längengrad)
          sowie einen Zeitstempel. Diese Daten sind nicht mit dir als Person verknüpft und werden ausschließlich
          genutzt, um anderen Besucher:innen die aktuelle Schaf-Position anzuzeigen.
        </p>

        <p>
          <strong>4. Standortabfrage ("Meinen Standort nutzen")</strong>
          <br />
          Nutzt du diese Funktion, fragt dein Browser über die Geolocation-API einmalig deinen Standort ab – nur
          mit deiner ausdrücklichen Erlaubnis. Der Standort wird nur zum Zeitpunkt der Meldung übertragen und nicht
          fortlaufend nachverfolgt.
        </p>

        <p>
          <strong>5. IP-Adressen / Spam-Schutz</strong>
          <br />
          Um Missbrauch zu verhindern, verarbeitet unser Server IP-Adressen kurzzeitig im Arbeitsspeicher (Rate
          Limiting). Diese werden nicht dauerhaft gespeichert oder protokolliert.
        </p>

        <p>
          <strong>6. Eingebundene externe Dienste</strong>
          <br />
          Beim Aufruf der Seite werden Inhalte direkt von folgenden Drittanbietern geladen, wodurch deine
          IP-Adresse an diese Anbieter übermittelt wird:
        </p>
        <ul>
          <li>OpenFreeMap (tiles.openfreemap.org) – Kartendarstellung</li>
          <li>Open-Meteo (api.open-meteo.com) – Wetterdaten</li>
        </ul>
        <p>
          Schriftarten werden nicht von Drittanbietern geladen, sondern direkt von unserem Server ausgeliefert.
        </p>
        <p>Es gelten die jeweiligen Datenschutzbestimmungen der oben genannten Anbieter.</p>

        <p>
          <strong>7. Deine Rechte</strong>
          <br />
          Da keine personenbezogenen Daten dauerhaft gespeichert werden, die dir zugeordnet werden können, laufen
          die meisten Betroffenenrechte (Auskunft, Löschung etc.) praktisch leer. Bei Fragen erreichst du uns
          jederzeit unter der oben genannten E-Mail-Adresse.
        </p>
      </div>
    </div>
  );
}
