import arrowLeftIcon from "./assets/arrow-left.svg";

interface ImpressumCardProps {
  onClose: () => void;
}

export function ImpressumCard({ onClose }: ImpressumCardProps) {
  return (
    <div className="sheet sheet--about sheet--scrollable">
      <button className="sheet__back sheet__back--inline" onClick={onClose}>
        <img className="sheet__back-icon" src={arrowLeftIcon} alt="" />
        zurück
      </button>
      <p className="sheet__title">Impressum</p>
      <div className="legal-text">
        <p>Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)</p>
        <p>
          Bela Kurek
          <br />
          Tegeler Weg 106
          <br />
          10589 Berlin
        </p>
        <p>
          <strong>Kontakt</strong>
          <br />
          E-Mail: Bela.Kurek@berlin.de
        </p>
        <p>
          <strong>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</strong>
          <br />
          Bela Kurek (Anschrift wie oben)
        </p>
        <p>
          Diese Website ist ein privates, nicht-kommerzielles Hobbyprojekt ohne Gewinnerzielungsabsicht und ohne
          Werbung.
        </p>
      </div>
    </div>
  );
}
