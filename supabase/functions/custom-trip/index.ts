
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
    const { prompt } = await req.json();

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
            content: 'You are a travel expert specializing in USA destinations. Generate detailed itineraries with helpful links and recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    const gptData = await response.json();
    const tripPlan = JSON.parse(gptData.choices[0].message.content);

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
