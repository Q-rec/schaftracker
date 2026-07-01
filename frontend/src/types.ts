export type SightingStatus = "known" | "uncertain" | "unknown";

export interface CurrentSighting {
  id: string;
  lat: number;
  lng: number;
  createdAt: string;
  confirmCount: number;
  status: SightingStatus;
  daysAgo: number;
  uncertainLabel: string | null;
}

export type ViewState =
  | "known"
  | "uncertain"
  | "unknown"
  | "thankyou"
  | "where-are-the-sheep"
  | "handpick";

export type OverlayView = "about" | "datenschutz" | "impressum" | null;

