import { useState } from "react";
import QuestionnaireFlow from "@/components/QuestionnaireFlow";
import DecisionDNACard from "@/components/DecisionDNACard";
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

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [decisionDNA, setDecisionDNA] = useState<DecisionDNA | null>(null);

  const handleComplete = async (questionResponses: Record<string, string>) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch(
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

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (response.status === 402) {
          toast.error("Service temporarily unavailable. Please try again.");
        } else {
          toast.error(errorData.error || "Failed to analyze responses");
        }
        setIsProcessing(false);
        return;
      }

      const data = await response.json();
      setDecisionDNA(data.decisionDNA);
    } catch (error) {
      console.error('Error analyzing decision DNA:', error);
      toast.error("Failed to analyze your responses. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setDecisionDNA(null);
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
          {!decisionDNA ? (
            <QuestionnaireFlow onComplete={handleComplete} isProcessing={isProcessing} />
          ) : (
            <DecisionDNACard decisionDNA={decisionDNA} onReset={handleReset} />
          )}
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
