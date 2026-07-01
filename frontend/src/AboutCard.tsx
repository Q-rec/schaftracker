import schafIcon from "./assets/schaf-icon.svg";

interface AboutCardProps {
  onClose: () => void;
}

export function AboutCard({ onClose }: AboutCardProps) {
  return (
    <div className="sheet sheet--about">
      <div className="sheet__about-header">
        <div className="sheet__status-row">
          <img className="sheet__icon sheet__icon--lg" src={schafIcon} alt="" />
          <p className="sheet__title">
            Schloss Schafe
            <br />
            Charlottenburg
          </p>
        </div>
      </div>
      <div className="sheet__about-body">
        <p className="about-card__text">
          Diese Website ist ein Herzensprojekt eines Charlottenburgers.{"\n\n"}
          Ich liebe die Schafe im Schlosspark Charlottenburg, möchte sie aber nicht jedes Mal erst suchen müssen und
          verlasse mich auf euch, damit wir gemeinsam immer wissen, wo die Schafe heute grasen.{"\n\n"}
          Dieses Projekt ist kostenlos, ohne Werbung und nur da, weil mein kleiner Sohn und ich es lieben, die Schafe
          anzuschauen.
        </p>
      </div>
      <div className="sheet__about-footer">
        <button className="btn btn--accent" onClick={onClose}>
          Los geht's
        </button>
      </div>
    </div>
  );
}
