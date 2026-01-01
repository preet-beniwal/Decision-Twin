import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Dna, Brain, Heart, Clock, Shield, AlertTriangle } from "lucide-react";

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

interface DecisionDNACardProps {
  decisionDNA: DecisionDNA;
  onReset: () => void;
}

const DecisionDNACard = ({ decisionDNA, onReset }: DecisionDNACardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-emerald-500";
      case "medium": return "text-amber-500";
      case "high": return "text-rose-500";
      default: return "text-muted-foreground";
    }
  };

  const getAuthorityLabel = (response: string) => {
    switch (response) {
      case "compliant": return "Rule-Follower";
      case "resistant": return "Independent";
      case "balanced": return "Contextual";
      default: return response;
    }
  };

  const getTimeBiasLabel = (bias: string) => {
    switch (bias) {
      case "short_term": return "Present-Focused";
      case "balanced": return "Balanced";
      case "long_term": return "Future-Oriented";
      default: return bias;
    }
  };

  return (
    <div 
      className={`w-full max-w-2xl mx-auto transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="glass-panel rounded-3xl p-8 md:p-10 shadow-soft space-y-8">
        {/* Header */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Dna className="w-7 h-7 text-primary" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl md:text-4xl text-foreground">
            Your Decision DNA
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            A profile of how you tend to make decisions
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Risk Tolerance */}
          <div className="glass-panel rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-body">Risk Tolerance</span>
            </div>
            <p className={`font-display text-xl capitalize ${getRiskColor(decisionDNA.risk_tolerance)}`}>
              {decisionDNA.risk_tolerance}
            </p>
          </div>

          {/* Regret Sensitivity */}
          <div className="glass-panel rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-body">Regret Sensitivity</span>
            </div>
            <p className={`font-display text-xl capitalize ${getRiskColor(decisionDNA.regret_sensitivity)}`}>
              {decisionDNA.regret_sensitivity}
            </p>
          </div>

          {/* Authority Response */}
          <div className="glass-panel rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Brain className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-body">Authority Response</span>
            </div>
            <p className="font-display text-xl text-foreground">
              {getAuthorityLabel(decisionDNA.authority_response)}
            </p>
          </div>

          {/* Time Bias */}
          <div className="glass-panel rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-body">Time Orientation</span>
            </div>
            <p className="font-display text-xl text-foreground">
              {getTimeBiasLabel(decisionDNA.time_bias)}
            </p>
          </div>
        </div>

        {/* Emotion/Logic Ratio */}
        <div className="glass-panel rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-body">Decision Driver</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-body">
              <span className="text-rose-400">Emotion {decisionDNA.emotion_logic_ratio.emotion}%</span>
              <span className="text-sky-400">Logic {decisionDNA.emotion_logic_ratio.logic}%</span>
            </div>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-1000"
              style={{ width: `${decisionDNA.emotion_logic_ratio.emotion}%` }}
            />
            <div 
              className="h-full bg-gradient-to-r from-sky-400 to-sky-500 transition-all duration-1000"
              style={{ width: `${decisionDNA.emotion_logic_ratio.logic}%` }}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="reflection-line h-px w-full" />
        
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
            Summary
          </p>
          <p className="text-lg text-foreground/90 font-body leading-relaxed italic">
            "{decisionDNA.summary}"
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
            Start a new reflection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DecisionDNACard;
