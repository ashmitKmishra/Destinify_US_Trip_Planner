
import { TripResponse } from "@/types/trip";

const API_BASE_URL = '/api';

export async function generateTripSuggestions(filters: {
  mood: string;
  numberOfPeople: number;
  placeType: string;
  budget: number;
}): Promise<TripResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-trip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });
    return await response.json();
  } catch (error) {
    return { suggestions: [], error: 'Failed to generate trip suggestions' };
  }
}

export async function generateCustomTrip(prompt: string): Promise<TripResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/custom-trip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    return await response.json();
  } catch (error) {
    return { suggestions: [], error: 'Failed to generate custom trip' };
  }
}
