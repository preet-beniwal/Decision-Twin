import { useState } from "react";
import DecisionInput from "@/components/DecisionInput";
import ReflectionCard from "@/components/ReflectionCard";

const Index = () => {
  const [decision, setDecision] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  const handleSubmit = async (input: string) => {
    setIsProcessing(true);
    setDecision(input);
    
    // Simulate processing time for the "reflection"
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setShowReflection(true);
  };

  const handleReset = () => {
    setShowReflection(false);
    setDecision("");
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
          {!showReflection ? (
            <DecisionInput onSubmit={handleSubmit} isProcessing={isProcessing} />
          ) : (
            <ReflectionCard decision={decision} onReset={handleReset} />
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