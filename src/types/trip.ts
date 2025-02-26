
export interface TripSuggestion {
  destination: string;
  summary: string;
  duration: string;
  budget: number;
  activities: string[];
  images: string[];
}

export interface TripResponse {
  suggestions: TripSuggestion[];
  error?: string;
}
