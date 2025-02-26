
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
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
    const { mood, numberOfPeople, placeType, budget } = await req.json();

    // Generate trip suggestions using GPT-4
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a travel expert specializing in USA destinations. Provide detailed trip suggestions based on user preferences.'
          },
          {
            role: 'user',
            content: `Generate 3 trip suggestions for a ${mood} trip for ${numberOfPeople} people interested in ${placeType} with a budget of $${budget}. Include destination name, summary, duration, budget breakdown, and 4-5 must-do activities.`
          }
        ],
      }),
    });

    const gptData = await response.json();
    const suggestions = JSON.parse(gptData.choices[0].message.content);

    // Fetch images for each suggestion from Unsplash
    const suggestionsWithImages = await Promise.all(
      suggestions.map(async (suggestion: any) => {
        const searchResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(suggestion.destination + ' ' + placeType)}&per_page=4`,
          {
            headers: {
              'Authorization': `Client-ID ${unsplashApiKey}`,
            },
          }
        );
        const imageData = await searchResponse.json();
        return {
          ...suggestion,
          images: imageData.results.map((img: any) => img.urls.regular),
        };
      })
    );

    return new Response(
      JSON.stringify({ suggestions: suggestionsWithImages }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate trip suggestions' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
