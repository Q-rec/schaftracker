import schafIcon from "./assets/schaf-icon.svg";

interface AboutCardProps {
  onClose: () => void;
}

export function AboutCard({ onClose }: AboutCardProps) {
  return (
    <div className="sheet sheet--about">
      <div className="sheet__status-row">
        <img className="sheet__icon sheet__icon--lg" src={schafIcon} alt="" />
        <p className="sheet__title">
          Schloss Schafe
          <br />
          Charlottenburg
        </p>
      </div>
      <p className="about-card__text">
        Diese Website ist ein Herzensprojekt eines Charlottenburgers.{"\n\n"}
        Ich liebe die Schafe im Schlosspark Charlottenburg, möchte aber nicht so lange suchen und verlasse mich auf
        euch, damit wir immer wissen, wo die Schafe heute grasen.{"\n\n"}
        Dieses Projekt ist kostenlos, ohne Werbung und nur da, weil ich und mein kleiner Sohn es lieben die Schafe
        anzuschauen.
      </p>
      <div className="sheet__buttons">
        <button className="btn btn--accent" onClick={onClose}>
          los gehts
        </button>
      </div>
    </div>
  );
}
