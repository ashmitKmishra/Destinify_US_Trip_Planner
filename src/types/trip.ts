
export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation: string;
}

export interface TripSuggestion {
  destination: string;
  summary: string;
  duration: string;
  budget: number;
  activities: string[];
  images: string[];
  itinerary?: DayItinerary[];
  travelTips?: string[];
}

export interface TripResponse {
  suggestions: TripSuggestion[];
  error?: string;
}
