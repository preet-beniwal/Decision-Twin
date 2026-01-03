import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are a decision-profiling engine.

Your task is to infer how a human tends to make decisions based on short scenario responses.

Do not give advice, diagnoses, or moral judgments.

Output must be neutral, analytical, and structured.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { Q1, Q2, Q3, Q4, Q5 } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const userPrompt = `User responses to decision scenarios:

1. ${Q1}

2. ${Q2}

3. ${Q3}

4. ${Q4}

5. ${Q5}

Infer the user's Decision DNA and return ONLY the following JSON structure:

{
  "risk_tolerance": "low | medium | high",
  "emotion_logic_ratio": {
    "emotion": 0-100,
    "logic": 0-100
  },
  "authority_response": "compliant | resistant | balanced",
  "time_bias": "short_term | balanced | long_term",
  "regret_sensitivity": "low | medium | high",
  "summary": "A concise, neutral 2-sentence description of the user's decision style."
}

Ensure emotion + logic equals 100.

Do not include any explanation or extra text.`;

    console.log('Sending request to Gemini API...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
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

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    console.log('Raw Gemini response:', content);

    // Parse the JSON from the response
    let decisionDNA;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        decisionDNA = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse DecisionDNA:', parseError);
      throw new Error('Failed to parse AI response as JSON');
    }

    return new Response(JSON.stringify({ decisionDNA }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-decision-dna:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
