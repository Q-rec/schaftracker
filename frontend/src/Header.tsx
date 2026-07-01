import menuIcon from "./assets/menu.svg";
import schafIcon from "./assets/schaf-icon.svg";
import type { OverlayView } from "./types";

interface HeaderProps {
  menuOpen: boolean;
  onMenuToggle: () => void;
  onNavigate: (overlay: OverlayView) => void;
}

export function Header({ menuOpen, onMenuToggle, onNavigate }: HeaderProps) {
  const navigate = (overlay: OverlayView) => {
    onMenuToggle();
    onNavigate(overlay);
  };

  return (
    <header className={`header${menuOpen ? " header--open" : ""}`}>
      <div className="header__top">
        <div className="header__brand">
          <img className="header__icon" src={schafIcon} alt="" />
          <p className="header__title">
            Schloss Schafe
            <br />
            Charlottenburg
          </p>
        </div>
        <button className="header__menu-button" onClick={onMenuToggle} aria-label="Menü">
          <img className="header__menu-icon" src={menuIcon} alt="" />
        </button>
      </div>
      <nav className="header__nav" aria-hidden={!menuOpen}>
        <button className="header__nav-item" onClick={() => navigate("about")}>
          About
        </button>
        <button className="header__nav-item" onClick={() => navigate("datenschutz")}>
          Datenschutz
        </button>
        <button className="header__nav-item" onClick={() => navigate("impressum")}>
          Impressum
        </button>
      </nav>
    </header>
  );
}
