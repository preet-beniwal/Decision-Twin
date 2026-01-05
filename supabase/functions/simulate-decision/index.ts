import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are a decision simulation engine.

You predict how a human is likely to act based strictly on their Decision DNA.

This is a prediction, not advice.

Remain neutral, transparent, and analytical.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { decisionDNA, scenario, userPrediction } = await req.json();
    
    console.log('Received inputs:', { decisionDNA, scenario, userPrediction });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

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

    console.log('Sending request to Lovable AI for decision simulation...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('Raw Lovable AI response:', content);

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