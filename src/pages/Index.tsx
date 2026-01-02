import { useState } from "react";
import QuestionnaireFlow from "@/components/QuestionnaireFlow";
import DecisionDNACard from "@/components/DecisionDNACard";
import DecisionResultCard from "@/components/DecisionResultCard";
import { toast } from "sonner";

interface DecisionDNA {
  risk_tolerance: "low" | "medium" | "high";
  emotion_logic_ratio: {
    emotion: number;
    logic: number;
  };
  authority_response: "compliant" | "resistant" | "balanced";
  time_bias: "short_term" | "balanced" | "long_term";
  regret_sensitivity: "low" | "medium" | "high";
  summary: string;
}

interface DecisionResult {
  likely_choice: string;
  decision_confidence: number;
  reasoning_steps: string[];
  hidden_biases: string[];
  ignored_alternative: string;
  ignored_alternative_reason: string;
  possible_regret: string;
}

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<"dna" | "simulation" | null>(null);
  const [decisionDNA, setDecisionDNA] = useState<DecisionDNA | null>(null);
  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(null);
  const [userInputs, setUserInputs] = useState<{ scenario: string; userPrediction: string } | null>(null);

  const handleComplete = async (questionResponses: Record<string, string>) => {
    setIsProcessing(true);
    setProcessingStep("dna");
    
    const scenario = questionResponses.Scenario;
    const userPrediction = questionResponses.UserPrediction;
    setUserInputs({ scenario, userPrediction });

    try {
      // Step 1: Analyze Decision DNA
      const dnaResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-decision-dna`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            Q1: questionResponses.Q1,
            Q2: questionResponses.Q2,
            Q3: questionResponses.Q3,
            Q4: questionResponses.Q4,
            Q5: questionResponses.Q5,
          }),
        }
      );

      if (!dnaResponse.ok) {
        const errorData = await dnaResponse.json();
        if (dnaResponse.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (dnaResponse.status === 402) {
          toast.error("Service temporarily unavailable. Please try again.");
        } else {
          toast.error(errorData.error || "Failed to analyze responses");
        }
        setIsProcessing(false);
        setProcessingStep(null);
        return;
      }

      const dnaData = await dnaResponse.json();
      setDecisionDNA(dnaData.decisionDNA);

      // Step 2: Simulate Decision
      setProcessingStep("simulation");
      
      const simResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/simulate-decision`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            decisionDNA: dnaData.decisionDNA,
            scenario,
            userPrediction,
          }),
        }
      );

      if (!simResponse.ok) {
        const errorData = await simResponse.json();
        if (simResponse.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (simResponse.status === 402) {
          toast.error("Service temporarily unavailable. Please try again.");
        } else {
          toast.error(errorData.error || "Failed to simulate decision");
        }
        setIsProcessing(false);
        setProcessingStep(null);
        return;
      }

      const simData = await simResponse.json();
      setDecisionResult(simData.decisionResult);

    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessingStep(null);
    }
  };

  const handleReset = () => {
    setDecisionDNA(null);
    setDecisionResult(null);
    setUserInputs(null);
  };

  const getProcessingMessage = () => {
    if (processingStep === "dna") return "Analyzing your Decision DNA...";
    if (processingStep === "simulation") return "Simulating your decision...";
    return "Reflecting...";
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center mb-16 md:mb-24 animate-fade-in">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 tracking-tight">
            Decision Twin
          </h1>
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            A mirror, not advice. This tool simulates how you are likely to make decisions, not what you should do.
          </p>
        </header>

        {/* Main content */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {!decisionDNA && !decisionResult ? (
            <QuestionnaireFlow 
              onComplete={handleComplete} 
              isProcessing={isProcessing}
              processingMessage={getProcessingMessage()}
            />
          ) : decisionResult && userInputs ? (
            <DecisionResultCard 
              decisionResult={decisionResult} 
              userPrediction={userInputs.userPrediction}
              onReset={handleReset} 
            />
          ) : decisionDNA ? (
            <DecisionDNACard decisionDNA={decisionDNA} onReset={handleReset} />
          ) : null}
        </div>

        {/* Footer */}
        <footer className="mt-24 md:mt-32 text-center">
          <p className="text-sm text-muted-foreground/50 font-body">
            Understand yourself. Decide with clarity.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Index;
