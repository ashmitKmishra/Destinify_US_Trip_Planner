
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
    const { mood, numberOfPeople, placeType, budget } = await req.json();
    let tripSuggestions;
    
    // Use OpenAI for trip generation
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
            content: 'You are a travel expert specializing in USA destinations. Provide detailed trip suggestions based on user preferences.'
          },
          {
            role: 'user',
            content: `Generate 3 trip suggestions for a ${mood} trip for ${numberOfPeople} people interested in ${placeType} with a budget of $${budget}. Include destination name, summary, duration, budget breakdown, and 4-5 must-do activities.`
          }
        ],
      }),
    });

    const gptData = await openAIResponse.json();
    
    if (gptData.error) {
      throw new Error(gptData.error.message || 'OpenAI API error');
    }
    
    tripSuggestions = JSON.parse(gptData.choices[0].message.content);

    if (!tripSuggestions) {
      throw new Error('Failed to generate trip suggestions');
    }

    // Fetch images for each suggestion from Unsplash
    const suggestionsWithImages = await Promise.all(
      tripSuggestions.map(async (suggestion: any) => {
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
