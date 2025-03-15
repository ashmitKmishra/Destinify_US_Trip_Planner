import { TripResponse } from "@/types/trip";

const API_BASE_URL = 'https://api.openai.com/v1';
const PEXELS_API_URL = 'https://api.pexels.com/v1';

// Temporary solution to store API keys
const getOpenAIKey = () => localStorage.getItem('openai_api_key');
const getPexelsKey = () => '563492ad6f91700001000001f89979b59c084e96a273fd3898b1c7f6'; // Free Pexels API key

// Mock data for when API is unavailable
const getMockTripSuggestions = async (filters: {
  mood: string;
  numberOfPeople: number;
  placeType: string;
  budget: number;
}): Promise<TripResponse> => {
  // Create sample images based on place type
  const getPlaceTypeImages = async (placeType: string) => {
    try {
      const response = await fetch(`${PEXELS_API_URL}/search?query=${encodeURIComponent(placeType)}&per_page=4`, {
        headers: {
          'Authorization': getPexelsKey(),
        },
      });
      const data = await response.json();
      return data.photos.map((photo: any) => photo.src.large);
    } catch (error) {
      return [
        "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
        "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
        "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg"
      ];
    }
  };

  const images = await getPlaceTypeImages(filters.placeType);
  
  const mockSuggestions = [
    {
      destination: "Rocky Mountain National Park, Colorado",
      summary: "Experience the breathtaking beauty of the Rockies with hiking, wildlife viewing, and alpine adventures.",
      duration: "5 days",
      budget: Math.min(filters.budget, 1800),
      activities: [
        "Hike to Alberta Falls",
        "Drive the scenic Trail Ridge Road",
        "Wildlife watching at Moraine Park",
        "Stargazing at Bear Lake",
        "Camping in the backcountry (permit required)"
      ],
      images: images
    },
    {
      destination: "Great Smoky Mountains, Tennessee",
      summary: "Discover America's most visited national park with diverse wildlife, historic structures, and stunning vistas.",
      duration: "4 days",
      budget: Math.min(filters.budget, 1500),
      activities: [
        "Hike to Clingmans Dome",
        "Explore Cades Cove",
        "Visit historic pioneer structures",
        "Waterfall hunting at Roaring Fork",
        "Mountain biking on designated trails"
      ],
      images: images
    },
    {
      destination: "Yosemite National Park, California",
      summary: "Marvel at towering granite cliffs, powerful waterfalls, and ancient sequoia groves in this iconic park.",
      duration: "6 days",
      budget: Math.min(filters.budget, 2200),
      activities: [
        "Hiking to Half Dome (permit required)",
        "Photography at Tunnel View",
        "Rock climbing at El Capitan",
        "Exploring Mariposa Grove of Giant Sequoias",
        "Rafting on the Merced River (seasonal)"
      ],
      images: images
    }
  ];
  
  return { suggestions: mockSuggestions };
};

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
        model: 'gpt-3.5-turbo',
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
      if (openAIData.error.code === 'insufficient_quota') {
        console.log("API quota exceeded, using mock data instead");
        return await getMockTripSuggestions(filters);
      }
      throw new Error(openAIData.error.message || 'OpenAI API error');
    }

    if (!openAIData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
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
  } catch (error: any) {
    console.error('Error:', error);
    
    // If there's a network error or parsing error, use mock data
    if (error.message?.includes('quota') || error.message?.includes('rate limit') || error.message?.includes('exceeded')) {
      console.log("API error related to quota, using mock data instead");
      return await getMockTripSuggestions(filters);
    }
    
    return { 
      suggestions: [], 
      error: error.message || 'Failed to generate trip suggestions. Please check your OpenAI API key.' 
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
        model: 'gpt-3.5-turbo',
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
      if (openAIData.error.code === 'insufficient_quota') {
        throw new Error('Your OpenAI API key has exceeded its quota. Please check your billing details or try a different API key.');
      }
      throw new Error(openAIData.error.message || 'OpenAI API error');
    }

    if (!openAIData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    const tripPlan = JSON.parse(openAIData.choices[0].message.content);

    // Add images using Pexels
    const images = await getImagesForLocation(tripPlan.destination);
    const suggestionWithImages = { ...tripPlan, images };

    return { suggestions: [suggestionWithImages] };
  } catch (error: any) {
    console.error('Error:', error);
    return { 
      suggestions: [], 
      error: error.message || 'Failed to generate custom trip plan. Please check your OpenAI API key.' 
    };
  }
}

export function setOpenAIKey(key: string): void {
  localStorage.setItem('openai_api_key', key);
}
