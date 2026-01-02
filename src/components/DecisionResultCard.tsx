import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Brain, AlertTriangle, XCircle, Clock } from "lucide-react";

interface DecisionResult {
  likely_choice: string;
  decision_confidence: number;
  reasoning_steps: string[];
  hidden_biases: string[];
  ignored_alternative: string;
  ignored_alternative_reason: string;
  possible_regret: string;
}

interface DecisionResultCardProps {
  decisionResult: DecisionResult;
  userPrediction: string;
  onReset: () => void;
}

const DecisionResultCard = ({ decisionResult, userPrediction, onReset }: DecisionResultCardProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">
          Decision Simulation
        </h2>
        <p className="text-muted-foreground font-body">
          Based on your Decision DNA, here's how you're likely to decide
        </p>
      </div>

      {/* Your Prediction vs Simulation */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5 bg-secondary/30 border-border/50">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-body">
            What you predicted
          </p>
          <p className="text-foreground font-body">{userPrediction}</p>
        </Card>
        
        <Card className="p-5 bg-primary/10 border-primary/30">
          <p className="text-xs uppercase tracking-wider text-primary mb-2 font-body">
            Likely decision
          </p>
          <p className="text-foreground font-body font-medium">{decisionResult.likely_choice}</p>
        </Card>
      </div>

      {/* Confidence */}
      <Card className="p-6 bg-card/50 border-border/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground font-body">Decision Confidence</span>
          <span className="text-2xl font-display text-foreground">{decisionResult.decision_confidence}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-1000"
            style={{ width: `${decisionResult.decision_confidence}%` }}
          />
        </div>
      </Card>

      {/* Reasoning Steps */}
      <Card className="p-6 bg-card/50 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg text-foreground">Reasoning Steps</h3>
        </div>
        <ol className="space-y-3">
          {decisionResult.reasoning_steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-body">
                {index + 1}
              </span>
              <p className="text-foreground/80 font-body text-sm leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </Card>

      {/* Hidden Biases */}
      <Card className="p-6 bg-card/50 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="font-display text-lg text-foreground">Hidden Biases</h3>
        </div>
        <ul className="space-y-2">
          {decisionResult.hidden_biases.map((bias, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <p className="text-foreground/80 font-body text-sm">{bias}</p>
            </li>
          ))}
        </ul>
      </Card>

      {/* Ignored Alternative */}
      <Card className="p-6 bg-card/50 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-display text-lg text-foreground">Ignored Alternative</h3>
        </div>
        <div className="space-y-3">
          <p className="text-foreground font-body font-medium">{decisionResult.ignored_alternative}</p>
          <p className="text-muted-foreground font-body text-sm">{decisionResult.ignored_alternative_reason}</p>
        </div>
      </Card>

      {/* Possible Regret */}
      <Card className="p-6 bg-card/50 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-rose-400" />
          <h3 className="font-display text-lg text-foreground">Possible Regret</h3>
        </div>
        <p className="text-foreground/80 font-body italic">{decisionResult.possible_regret}</p>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onReset}
          variant="outline"
          className="group px-6 py-3 h-auto text-base font-body font-medium rounded-xl"
        >
          <RotateCcw className="w-4 h-4 mr-2 transition-transform group-hover:-rotate-45" />
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default DecisionResultCard;
