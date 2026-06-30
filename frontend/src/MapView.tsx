import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { LngLatLike, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import handpickCrosshairIcon from "./assets/handpick-crosshair.svg";
import customMapStyle from "./assets/map-style.json";
import positionTrackerIcon from "./assets/position-tracker.svg";
import schafIcon from "./assets/schaf-icon.svg";

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
      const el = document.createElement("img");
      el.src = schafIcon;
      el.className = sheepUncertain ? "marker marker--sheep marker--uncertain" : "marker marker--sheep";
      sheepMarkerRef.current = new maplibregl.Marker({ element: el })
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
    </div>
  );
}
