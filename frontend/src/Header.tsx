import { useState } from "react";
import menuIcon from "./assets/menu.svg";
import schafIcon from "./assets/schaf-icon.svg";
import type { OverlayView } from "./types";

interface HeaderProps {
  onNavigate: (overlay: OverlayView) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (overlay: OverlayView) => {
    setMenuOpen(false);
    onNavigate(overlay);
  };

  return (
    <header className="header">
      <div className="header__brand">
        <img className="header__icon" src={schafIcon} alt="" />
        <p className="header__title">
          Schloss Schafe
          <br />
          Charlottenburg
        </p>
      </div>
      <button className="header__menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Menü">
        <img className="header__menu-icon" src={menuIcon} alt="" />
      </button>
      {menuOpen && (
        <div className="header__dropdown">
          <button className="header__dropdown-item" onClick={() => navigate("about")}>
            About
          </button>
          <button className="header__dropdown-item" onClick={() => navigate("datenschutz")}>
            Datenschutz
          </button>
          <button className="header__dropdown-item" onClick={() => navigate("impressum")}>
            Impressum
          </button>
        </div>
      )}
    </header>
  );
}
