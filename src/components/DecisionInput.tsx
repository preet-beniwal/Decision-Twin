import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DecisionInputProps {
  onSubmit: (decision: string) => void;
  isProcessing: boolean;
}

const DecisionInput = ({ onSubmit, isProcessing }: DecisionInputProps) => {
  const [decision, setDecision] = useState("");

  const handleSubmit = () => {
    if (decision.trim()) {
      onSubmit(decision.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="glass-panel rounded-2xl p-1 shadow-soft">
        <Textarea
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a decision you're facing..."
          className="min-h-[140px] border-0 bg-transparent resize-none text-lg placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 p-5"
          disabled={isProcessing}
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!decision.trim() || isProcessing}
          className="group px-6 py-3 h-auto text-base font-body font-medium rounded-xl transition-all duration-300 hover:shadow-glow"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Reflecting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              See reflection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DecisionInput;