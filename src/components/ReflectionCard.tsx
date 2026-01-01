import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles } from "lucide-react";

interface ReflectionCardProps {
  decision: string;
  onReset: () => void;
}

const reflectionPatterns = [
  {
    tendency: "You lean toward the familiar",
    insight: "When faced with uncertainty, you're drawn to options that feel safe and known. This isn't weakness—it's your mind's way of conserving energy. But notice: the familiar path isn't always the right one.",
  },
  {
    tendency: "You seek validation before acting",
    insight: "You often look for external confirmation before committing. This shows thoughtfulness, but can become a delay tactic. The decision you're already leaning toward? That's usually where you'll land.",
  },
  {
    tendency: "You overweight recent experiences",
    insight: "What happened last time colors this decision more than it should. Your mind is pattern-matching, but each situation is its own. Consider: what would you choose with fresh eyes?",
  },
  {
    tendency: "You avoid decisions that feel irreversible",
    insight: "The fear of closing doors often keeps them all slightly open—which is its own choice. Most decisions are more reversible than they appear. The cost of indecision compounds quietly.",
  },
  {
    tendency: "You let urgency override importance",
    insight: "The pressure to decide quickly often wins over taking time for what matters. Pause and ask: is this truly urgent, or does it just feel that way?",
  },
];

const ReflectionCard = ({ decision, onReset }: ReflectionCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [reflection] = useState(() => 
    reflectionPatterns[Math.floor(Math.random() * reflectionPatterns.length)]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`w-full max-w-2xl mx-auto transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="glass-panel rounded-3xl p-8 md:p-10 shadow-soft space-y-8">
        {/* Mirror icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Your decision */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
            Your decision
          </p>
          <p className="text-lg text-foreground/80 font-body leading-relaxed">
            "{decision}"
          </p>
        </div>

        {/* Reflection divider */}
        <div className="reflection-line h-px w-full" />

        {/* The reflection */}
        <div className="space-y-4">
          <h3 className="font-display text-2xl md:text-3xl text-foreground italic">
            {reflection.tendency}
          </h3>
          <p className="text-muted-foreground font-body leading-relaxed text-base md:text-lg">
            {reflection.insight}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground/60 font-body text-center">
            This is a mirror, not advice. It reflects patterns, not prescriptions.
          </p>
        </div>

        {/* Reset button */}
        <div className="flex justify-center pt-2">
          <Button
            onClick={onReset}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground font-body"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reflect on another decision
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReflectionCard;