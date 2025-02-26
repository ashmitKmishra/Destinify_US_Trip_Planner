
import { TripResponse } from "@/types/trip";

const API_BASE_URL = 'https://api.openai.com/v1';
const PEXELS_API_URL = 'https://api.pexels.com/v1';

// Temporary solution to store API keys
const getOpenAIKey = () => localStorage.getItem('openai_api_key');
const getPexelsKey = () => '563492ad6f91700001000001f89979b59c084e96a273fd3898b1c7f6'; // Free Pexels API key

async function getImagesForLocation(query: string): Promise<string[]> {
  try {
    const response = await fetch(`${PEXELS_API_URL}/search?query=${encodeURIComponent(query)}&per_page=4`, {
      headers: {
        'Authorization': getPexelsKey(),
      },
    });
    const data = await response.json();
    return data.photos.map((photo: any) => photo.src.large);
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

export async function generateTripSuggestions(filters: {
  mood: string;
  numberOfPeople: number;
  placeType: string;
  budget: number;
}): Promise<TripResponse> {
  const openAIKey = getOpenAIKey();
  if (!openAIKey) {
    return { 
      suggestions: [], 
      error: 'Please add your OpenAI API key in the settings' 
    };
  }

  try {
    // Generate trip suggestions using OpenAI
    const openAIResponse = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a travel expert specializing in USA destinations. Generate trip suggestions in JSON format with the following structure: [{"destination": "string", "summary": "string", "duration": "string", "budget": number, "activities": string[]}]'
          },
          {
            role: 'user',
            content: `Generate 3 trip suggestions for a ${filters.mood} trip for ${filters.numberOfPeople} people interested in ${filters.placeType} with a budget of $${filters.budget}. Format as JSON.`
          }
        ],
      }),
    });

    const openAIData = await openAIResponse.json();
    
    if (openAIData.error) {
      throw new Error(openAIData.error.message || 'OpenAI API error');
    }

    const suggestions = JSON.parse(openAIData.choices[0].message.content);

    // Add images to each suggestion using Pexels
    const suggestionsWithImages = await Promise.all(
      suggestions.map(async (suggestion: any) => {
        const images = await getImagesForLocation(`${suggestion.destination} ${filters.placeType}`);
        return { ...suggestion, images };
      })
    );

    return { suggestions: suggestionsWithImages };
  } catch (error) {
    console.error('Error:', error);
    return { 
      suggestions: [], 
      error: 'Failed to generate trip suggestions. Please check your OpenAI API key.' 
    };
  }
}

export async function generateCustomTrip(prompt: string): Promise<TripResponse> {
  const openAIKey = getOpenAIKey();
  if (!openAIKey) {
    return { 
      suggestions: [], 
      error: 'Please add your OpenAI API key in the settings' 
    };
  }

  try {
    const openAIResponse = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a travel expert specializing in USA destinations. Generate a trip plan in JSON format with the structure: {"destination": "string", "summary": "string", "duration": "string", "budget": number, "activities": string[]}'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    const openAIData = await openAIResponse.json();
    
    if (openAIData.error) {
      throw new Error(openAIData.error.message || 'OpenAI API error');
    }

    const tripPlan = JSON.parse(openAIData.choices[0].message.content);

    // Add images using Pexels
    const images = await getImagesForLocation(tripPlan.destination);
    const suggestionWithImages = { ...tripPlan, images };

    return { suggestions: [suggestionWithImages] };
  } catch (error) {
    console.error('Error:', error);
    return { 
      suggestions: [], 
      error: 'Failed to generate custom trip plan. Please check your OpenAI API key.' 
    };
  }
}

export function setOpenAIKey(key: string): void {
  localStorage.setItem('openai_api_key', key);
}
