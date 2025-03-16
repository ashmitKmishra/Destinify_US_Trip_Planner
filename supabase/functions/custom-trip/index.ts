
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const deepSeekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
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
    const { prompt, preferredApi } = await req.json();
    let tripPlan;
    
    // Try DeepSeek first if available and preferred
    if ((preferredApi === 'deepseek' || !preferredApi) && deepSeekApiKey) {
      try {
        const deepSeekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${deepSeekApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'You are a travel expert specializing in USA destinations. Generate detailed itineraries with helpful links and recommendations. Respond in JSON format only.'
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
        
        tripPlan = JSON.parse(deepSeekData.choices[0].message.content);
      } catch (error) {
        console.error('DeepSeek API error:', error);
        
        // Fall back to OpenAI if DeepSeek fails and OpenAI key is available
        if (openAIApiKey) {
          console.log('Falling back to OpenAI');
          // Continue to OpenAI logic below
        } else {
          throw error; // Re-throw if no fallback available
        }
      }
    }
    
    // Use OpenAI if DeepSeek wasn't used or failed
    if (!tripPlan && openAIApiKey) {
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
              content: 'You are a travel expert specializing in USA destinations. Generate detailed itineraries with helpful links and recommendations.'
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
      
      tripPlan = JSON.parse(gptData.choices[0].message.content);
    }

    if (!tripPlan) {
      throw new Error('No API service was able to generate a trip plan');
    }

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
