import { useEffect, useState } from "react";
import schafIcon from "./assets/schaf-icon.svg";

interface Sheep {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  rotationDir: number;
}

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function spawnSheep(count: number): Sheep[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randomBetween(2, 95),
    delay: randomBetween(0, 1.4),
    duration: randomBetween(2.2, 3.8),
    size: randomBetween(24, 44),
    rotation: randomBetween(-40, 40),
    rotationDir: Math.random() > 0.5 ? 1 : -1,
  }));
}

interface SheepConfettiProps {
  active: boolean;
}

export function SheepConfetti({ active }: SheepConfettiProps) {
  const [sheep, setSheep] = useState<Sheep[]>([]);

  useEffect(() => {
    if (active) {
      setSheep(spawnSheep(22));
    } else {
      setSheep([]);
    }
  }, [active]);

  if (!active || sheep.length === 0) return null;

  return (
    <div className="sheep-confetti" aria-hidden="true">
      {sheep.map((s) => (
        <img
          key={s.id}
          src={schafIcon}
          className="sheep-confetti__sheep"
          style={{
            left: `${s.x}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            "--rotation-start": `${s.rotation}deg`,
            "--rotation-end": `${s.rotation + s.rotationDir * 180}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
