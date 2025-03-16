import { TripResponse } from "@/types/trip";

const OPENAI_API_BASE_URL = 'https://api.openai.com/v1';
const DEEPSEEK_API_BASE_URL = 'https://api.deepseek.com/v1';
const PEXELS_API_URL = 'https://api.pexels.com/v1';
const GROK_API_BASE_URL = 'https://api.groq.com/openai/v1';

// API key management
const getOpenAIKey = () => localStorage.getItem('openai_api_key');
const getDeepSeekKey = () => localStorage.getItem('deepseek_api_key');
const getPexelsKey = () => '563492ad6f91700001000001f89979b59c084e96a273fd3898b1c7f6'; // Free Pexels API key
const getGrokKey = () => localStorage.getItem('grok_api_key');

export function setOpenAIKey(key: string): void {
  localStorage.setItem('openai_api_key', key);
}

export function setDeepSeekKey(key: string): void {
  localStorage.setItem('deepseek_api_key', key);
}

export function setGrokKey(key: string): void {
  localStorage.setItem('grok_api_key', key);
}

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
  const grokKey = getGrokKey();
  const openAIKey = getOpenAIKey();
  
  if (!grokKey && !openAIKey) {
    return { 
      suggestions: [], 
      error: 'Please add your Grok or OpenAI API key in the settings' 
    };
  }

  try {
    // Try with Grok first if available
    if (grokKey) {
      try {
        console.log("Generating suggestions with Grok API");
        const grokResponse = await fetch(`${GROK_API_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${grokKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
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

        const grokData = await grokResponse.json();
        
        if (grokData.error) {
          if (grokData.error.code === 'insufficient_quota') {
            console.log("Grok API quota exceeded, falling back to OpenAI or mock data");
            if (openAIKey) {
              // Continue to OpenAI
            } else {
              return await getMockTripSuggestions(filters);
            }
          } else {
            throw new Error(grokData.error.message || 'Grok API error');
          }
        } else {
          if (!grokData.choices?.[0]?.message?.content) {
            throw new Error('Invalid response from Grok API');
          }

          const contentString = grokData.choices[0].message.content;
          // Extract JSON from the response (in case it contains markdown or other text)
          const jsonMatch = contentString.match(/```json\n([\s\S]*?)\n```/) || contentString.match(/```\n([\s\S]*?)\n```/) || [null, contentString];
          const jsonString = jsonMatch[1] || contentString;
          
          const suggestions = JSON.parse(jsonString.trim());

          // Add images to each suggestion using Pexels
          const suggestionsWithImages = await Promise.all(
            suggestions.map(async (suggestion: any) => {
              const images = await getImagesForLocation(`${suggestion.destination} ${filters.placeType}`);
              return { ...suggestion, images };
            })
          );

          return { suggestions: suggestionsWithImages };
        }
      } catch (error: any) {
        console.error('Error with Grok API:', error);
        if (openAIKey) {
          console.log('Falling back to OpenAI API');
          // Continue to OpenAI below
        } else {
          return await getMockTripSuggestions(filters);
        }
      }
    }

    // If Grok wasn't used or failed, try OpenAI
    if (openAIKey) {
      try {
        console.log("Generating trip with OpenAI API");
        
        const openAIResponse = await fetch(`${OPENAI_API_BASE_URL}/chat/completions`, {
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
          error: error.message || 'Failed to generate trip suggestions. Please check your API keys.' 
        };
      }
    } else {
      return await getMockTripSuggestions(filters);
    }
  } catch (error: any) {
    console.error('Error:', error);
    
    // If there's a network error or parsing error, use mock data
    if (error.message?.includes('quota') || error.message?.includes('rate limit') || error.message?.includes('exceeded')) {
      console.log("API error related to quota, using mock data instead");
      return await getMockTripSuggestions(filters);
    }
    
    return { 
      suggestions: [], 
      error: error.message || 'Failed to generate trip suggestions. Please check your API keys.' 
    };
  }
}

export async function generateCustomTrip(prompt: string): Promise<TripResponse> {
  const grokKey = getGrokKey();
  const deepSeekKey = getDeepSeekKey();
  const openAIKey = getOpenAIKey();
  
  if (!grokKey && !deepSeekKey && !openAIKey) {
    return { 
      suggestions: [], 
      error: 'Please add your Grok, DeepSeek or OpenAI API key in the settings' 
    };
  }
  
  try {
    // Try Grok first if the key is available
    if (grokKey) {
      return await generateCustomTripWithGrok(prompt);
    } else if (deepSeekKey) {
      return await generateCustomTripWithDeepSeek(prompt);
    } else if (openAIKey) {
      return await generateCustomTripWithOpenAI(prompt);
    } else {
      throw new Error('No API key available');
    }
  } catch (error: any) {
    console.error('Error generating custom trip:', error);
    return { 
      suggestions: [], 
      error: error.message || 'Failed to generate custom trip plan. Please check your API keys.' 
    };
  }
}

async function generateCustomTripWithGrok(prompt: string): Promise<TripResponse> {
  const grokKey = getGrokKey();
  
  try {
    console.log("Generating trip with Grok API");
    
    const grokResponse = await fetch(`${GROK_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are a travel expert specializing in USA destinations. Generate a detailed trip plan in JSON format. Include the following fields:
            {
              "destination": "Full name of the destination",
              "summary": "A brief summary of the trip (2-3 sentences)",
              "duration": "Recommended duration (e.g., 5 days)",
              "budget": numeric value in USD without dollar sign or commas (e.g. 1500),
              "activities": ["List of 5-7 activity recommendations"],
              "itinerary": [
                {
                  "day": 1,
                  "title": "Title for day 1",
                  "description": "Detailed plan for day 1 (2-3 sentences)",
                  "activities": ["Morning activity", "Afternoon activity", "Evening activity"],
                  "accommodation": "Recommended place to stay"
                },
                // more days following the same structure
              ],
              "travelTips": ["List of 3-5 helpful travel tips"]
            }
            
            Make sure your response contains ONLY the JSON object with no additional text. The JSON must be valid and parseable.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    const grokData = await grokResponse.json();
    
    if (grokData.error) {
      throw new Error(grokData.error.message || 'Grok API error');
    }

    if (!grokData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Grok API');
    }

    const contentString = grokData.choices[0].message.content;
    // Extract JSON from the response (in case it contains markdown or other text)
    const jsonMatch = contentString.match(/```json\n([\s\S]*?)\n```/) || contentString.match(/```\n([\s\S]*?)\n```/) || [null, contentString];
    const jsonString = jsonMatch[1] || contentString;
    
    const tripPlan = JSON.parse(jsonString.trim());

    // Add images using Pexels
    const images = await getImagesForLocation(tripPlan.destination);
    const suggestionWithImages = { ...tripPlan, images };

    return { suggestions: [suggestionWithImages] };
  } catch (error: any) {
    console.error('Error with Grok API:', error);
    if (getDeepSeekKey()) {
      console.log('Falling back to DeepSeek API');
      return generateCustomTripWithDeepSeek(prompt);
    } else if (getOpenAIKey()) {
      console.log('Falling back to OpenAI API');
      return generateCustomTripWithOpenAI(prompt);
    }
    throw error;
  }
}

async function generateCustomTripWithDeepSeek(prompt: string): Promise<TripResponse> {
  const deepSeekKey = getDeepSeekKey();
  
  try {
    console.log("Generating trip with DeepSeek API");
    
    const deepSeekResponse = await fetch(`${DEEPSEEK_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepSeekKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are a travel expert specializing in USA destinations. Generate a detailed trip plan in JSON format. Include the following fields:
            {
              "destination": "Full name of the destination",
              "summary": "A brief summary of the trip (2-3 sentences)",
              "duration": "Recommended duration (e.g., 5 days)",
              "budget": numeric value in USD without dollar sign or commas (e.g. 1500),
              "activities": ["List of 5-7 activity recommendations"],
              "itinerary": [
                {
                  "day": 1,
                  "title": "Title for day 1",
                  "description": "Detailed plan for day 1 (2-3 sentences)",
                  "activities": ["Morning activity", "Afternoon activity", "Evening activity"],
                  "accommodation": "Recommended place to stay"
                },
                // more days following the same structure
              ],
              "travelTips": ["List of 3-5 helpful travel tips"]
            }
            
            Make sure your response contains ONLY the JSON object with no additional text. The JSON must be valid and parseable.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    const deepSeekData = await deepSeekResponse.json();
    
    if (deepSeekData.error) {
      throw new Error(deepSeekData.error.message || 'DeepSeek API error');
    }

    if (!deepSeekData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from DeepSeek API');
    }

    const contentString = deepSeekData.choices[0].message.content;
    // Extract JSON from the response (in case it contains markdown or other text)
    const jsonMatch = contentString.match(/```json\n([\s\S]*?)\n```/) || contentString.match(/```\n([\s\S]*?)\n```/) || [null, contentString];
    const jsonString = jsonMatch[1] || contentString;
    
    const tripPlan = JSON.parse(jsonString.trim());

    // Add images using Pexels
    const images = await getImagesForLocation(tripPlan.destination);
    const suggestionWithImages = { ...tripPlan, images };

    return { suggestions: [suggestionWithImages] };
  } catch (error: any) {
    console.error('Error with DeepSeek API:', error);
    if (getOpenAIKey()) {
      console.log('Falling back to OpenAI API');
      return generateCustomTripWithOpenAI(prompt);
    }
    throw error;
  }
}

async function generateCustomTripWithOpenAI(prompt: string): Promise<TripResponse> {
  const openAIKey = getOpenAIKey();
  
  try {
    console.log("Generating trip with OpenAI API");
    
    const openAIResponse = await fetch(`${OPENAI_API_BASE_URL}/chat/completions`, {
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
            content: `You are a travel expert specializing in USA destinations. Generate a detailed trip plan in JSON format. Include the following fields:
            {
              "destination": "Full name of the destination",
              "summary": "A brief summary of the trip (2-3 sentences)",
              "duration": "Recommended duration (e.g., 5 days)",
              "budget": numeric value in USD without dollar sign or commas (e.g. 1500),
              "activities": ["List of 5-7 activity recommendations"],
              "itinerary": [
                {
                  "day": 1,
                  "title": "Title for day 1",
                  "description": "Detailed plan for day 1 (2-3 sentences)",
                  "activities": ["Morning activity", "Afternoon activity", "Evening activity"],
                  "accommodation": "Recommended place to stay"
                },
                // more days following the same structure
              ],
              "travelTips": ["List of 3-5 helpful travel tips"]
            }
            
            Make sure your response contains ONLY the JSON object with no additional text. The JSON must be valid and parseable.`
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

    const contentString = openAIData.choices[0].message.content;
    // Extract JSON from the response (in case it contains markdown or other text)
    const jsonMatch = contentString.match(/```json\n([\s\S]*?)\n```/) || contentString.match(/```\n([\s\S]*?)\n```/) || [null, contentString];
    const jsonString = jsonMatch[1] || contentString;
    
    const tripPlan = JSON.parse(jsonString.trim());

    // Add images using Pexels
    const images = await getImagesForLocation(tripPlan.destination);
    const suggestionWithImages = { ...tripPlan, images };

    return { suggestions: [suggestionWithImages] };
  } catch (error: any) {
    console.error('Error with OpenAI API:', error);
    throw error;
  }
}
