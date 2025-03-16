
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = "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";
const unsplashApiKey = Deno.env.get('UNSPLASH_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    // Use OpenAI for custom trip generation
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
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

    const gptData = await openAIResponse.json();
    
    if (gptData.error) {
      throw new Error(gptData.error.message || 'OpenAI API error');
    }
    
    const contentString = gptData.choices[0].message.content;
    // Extract JSON from the response (in case it contains markdown or other text)
    const jsonMatch = contentString.match(/```json\n([\s\S]*?)\n```/) || contentString.match(/```\n([\s\S]*?)\n```/) || [null, contentString];
    const jsonString = jsonMatch[1] || contentString;
    
    const tripPlan = JSON.parse(jsonString.trim());

    // Fetch relevant images from Unsplash
    const searchResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(tripPlan.destination)}&per_page=4`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashApiKey}`,
        },
      }
    );
    const imageData = await searchResponse.json();
    
    const suggestion = {
      ...tripPlan,
      images: imageData.results.map((img: any) => img.urls.regular),
    };

    return new Response(
      JSON.stringify({ suggestions: [suggestion] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate custom trip plan' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
