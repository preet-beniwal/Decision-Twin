import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are a decision simulation engine.

You predict how a human is likely to act based strictly on their Decision DNA.

This is a prediction, not advice.

Remain neutral, transparent, and analytical.`;

// Get all available API keys
function getApiKeys(): string[] {
  const keys: string[] = [];
  const key1 = Deno.env.get('GEMINI_API_KEY_1');
  const key2 = Deno.env.get('GEMINI_API_KEY_2');
  const key3 = Deno.env.get('GEMINI_API_KEY_3');
  
  if (key1) keys.push(key1);
  if (key2) keys.push(key2);
  if (key3) keys.push(key3);
  
  // Fallback to original key if no numbered keys exist
  if (keys.length === 0) {
    const fallbackKey = Deno.env.get('GEMINI_API_KEY');
    if (fallbackKey) keys.push(fallbackKey);
  }
  
  return keys;
}

// Random key selection for load distribution
function getRandomKey(keys: string[]): string {
  return keys[Math.floor(Math.random() * keys.length)];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { decisionDNA, scenario, userPrediction } = await req.json();
    
    console.log('Received inputs:', { decisionDNA, scenario, userPrediction });

    const apiKeys = getApiKeys();
    if (apiKeys.length === 0) {
      throw new Error('No Gemini API keys configured');
    }
    
    console.log(`Using ${apiKeys.length} API keys for rotation`);

    const userPrompt = `Decision DNA:

${JSON.stringify(decisionDNA, null, 2)}

Scenario:

${scenario}

User believes they would do:

${userPrediction}

Simulate the user's likely decision and return ONLY the following JSON:

{
  "likely_choice": "One-line description of the predicted decision",
  "decision_confidence": 0-100,
  "reasoning_steps": [
    "Step-by-step explanation tied to the Decision DNA"
  ],
  "hidden_biases": [
    "Cognitive or emotional biases influencing this decision"
  ],
  "ignored_alternative": "A realistic alternative the user is likely to avoid",
  "ignored_alternative_reason": "Why this alternative is usually ignored",
  "possible_regret": "One or two sentences describing a potential future regret"
}

Do not give advice.

Do not recommend actions.

Do not add extra text.`;

    console.log('Sending request to Gemini API for decision simulation with key rotation...');

    // Try each key until one works
    let response: Response | null = null;
    let lastError: string = '';
    const triedKeys = new Set<string>();
    
    while (triedKeys.size < apiKeys.length) {
      const currentKey = getRandomKey(apiKeys.filter(k => !triedKeys.has(k)));
      triedKeys.add(currentKey);
      
      console.log(`Trying API key ${triedKeys.size} of ${apiKeys.length}`);
      
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${currentKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (response.ok) {
        console.log('Request successful');
        break;
      }
      
      if (response.status === 429) {
        console.log(`Key ${triedKeys.size} rate limited, trying next...`);
        lastError = 'Rate limit exceeded';
        continue;
      }
      
      // For other errors, don't retry
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    if (!response || !response.ok) {
      return new Response(JSON.stringify({ error: 'All API keys rate limited. Please try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    console.log('Raw Gemini response:', content);

    // Parse the JSON from the response
    let decisionResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        decisionResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse DecisionResult:', parseError);
      throw new Error('Failed to parse AI response as JSON');
    }

    return new Response(JSON.stringify({ decisionResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in simulate-decision:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
