import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { LngLatLike, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import handpickCrosshairIcon from "./assets/handpick-crosshair.svg";
import customMapStyle from "./assets/map-style.json";
import positionTrackerIcon from "./assets/position-tracker.svg";
import schafIcon from "./assets/schaf-icon.svg";
import { playMaeh, playSaltoMaeh } from "./sheepSound";

export const DEFAULT_CENTER = { lat: 52.52598031942008, lng: 13.29294426125757 };
const PARK_BOUNDS: [LngLatLike, LngLatLike] = [
  [13.275, 52.51],
  [13.318, 52.531],
];

const MAP_STYLE = customMapStyle as unknown as StyleSpecification;

interface MapViewProps {
  initialCenter: { lat: number; lng: number };
  sheepPosition: { lat: number; lng: number } | null;
  sheepUncertain?: boolean;
  userPosition: { lat: number; lng: number } | null;
  pendingPin: { lat: number; lng: number } | null;
  onMapClick?: (lat: number, lng: number) => void;
}

export function MapView({ initialCenter, sheepPosition, sheepUncertain, userPosition, pendingPin, onMapClick }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const sheepMarkerRef = useRef<maplibregl.Marker | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const pendingMarkerRef = useRef<maplibregl.Marker | null>(null);
  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;
  const initialCenterRef = useRef(initialCenter);
  const tapCountRef = useRef(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center = initialCenterRef.current;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [center.lng, center.lat],
      zoom: 15.5,
      maxBounds: PARK_BOUNDS,
      attributionControl: false,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });

    map.on("click", (event) => {
      onMapClickRef.current?.(event.lngLat.lat, event.lngLat.lng);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    sheepMarkerRef.current?.remove();
    sheepMarkerRef.current = null;

    if (sheepPosition) {
      // Wrapper receives MapLibre's positioning transform — img is animated independently
      const wrapper = document.createElement("div");
      wrapper.className = sheepUncertain ? "marker--sheep marker--uncertain" : "marker--sheep";

      const img = document.createElement("img");
      img.src = schafIcon;
      img.className = "marker--sheep-img";
      wrapper.appendChild(img);

      const ANIM_CLASSES = ["sheep-wiggle-1", "sheep-wiggle-2", "sheep-wiggle-3", "sheep-salto"];

      wrapper.addEventListener("click", (e) => {
        e.stopPropagation();

        tapCountRef.current += 1;
        const count = tapCountRef.current;

        if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = setTimeout(() => { tapCountRef.current = 0; }, 1500);

        const isSalto = count >= 9;
        const animClass = isSalto ? "sheep-salto"
          : count >= 6 ? "sheep-wiggle-3"
          : count >= 3 ? "sheep-wiggle-2"
          : "sheep-wiggle-1";

        if (isSalto) {
          playSaltoMaeh();
          tapCountRef.current = 0;
          if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
        } else {
          playMaeh(Math.min(count, 5));
        }

        img.classList.remove(...ANIM_CLASSES);
        void img.offsetWidth; // force reflow to restart animation
        img.classList.add(animClass);
        img.addEventListener("animationend", () => img.classList.remove(animClass), { once: true });
      });

      sheepMarkerRef.current = new maplibregl.Marker({ element: wrapper })
        .setLngLat([sheepPosition.lng, sheepPosition.lat])
        .addTo(map);
    }
  }, [sheepPosition, sheepUncertain]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    userMarkerRef.current?.remove();
    userMarkerRef.current = null;

    if (userPosition) {
      const el = document.createElement("img");
      el.src = positionTrackerIcon;
      el.className = "marker marker--user";
      userMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([userPosition.lng, userPosition.lat])
        .addTo(map);
    }
  }, [userPosition]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    pendingMarkerRef.current?.remove();
    pendingMarkerRef.current = null;

    if (pendingPin) {
      const el = document.createElement("img");
      el.src = handpickCrosshairIcon;
      el.className = "marker marker--pending";
      pendingMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([pendingPin.lng, pendingPin.lat])
        .addTo(map);
    }
  }, [pendingPin]);

  return (
    <div className="map-view">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <div className="zoom-controls">
        <button className="zoom-controls__btn" onClick={() => mapRef.current?.zoomIn()} aria-label="Vergrößern">+</button>
        <div className="zoom-controls__divider" />
        <button className="zoom-controls__btn" onClick={() => mapRef.current?.zoomOut()} aria-label="Verkleinern">−</button>
      </div>
    </div>
  );
}
