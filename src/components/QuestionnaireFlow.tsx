import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface QuestionnaireFlowProps {
  onComplete: (responses: Record<string, string>) => void;
  isProcessing: boolean;
}

const questions = [
  {
    id: "Q1",
    text: "You are already late, but you notice someone nearby clearly needs help. What do you do and why?",
    options: [
      { label: "Stop and help fully", description: "Empathy overrides schedule" },
      { label: "Quick help, then go", description: "Balance both needs" },
      { label: "Keep going, feel guilty", description: "Obligation wins" },
      { label: "Depends on how late", description: "Weigh consequences first" },
    ],
  },
  {
    id: "Q2",
    text: "You must choose between a stable but average-paying option and a risky option with much higher reward. Which do you choose and why?",
    options: [
      { label: "Take the stable path", description: "Security over uncertainty" },
      { label: "Take the risk", description: "Potential outweighs fear" },
      { label: "Need more information", description: "Delay until certain" },
      { label: "Hybrid approach", description: "Minimize downside, keep upside" },
    ],
  },
  {
    id: "Q3",
    text: "If someone criticizes you publicly, what affects you more: the logic of what they say or the way they say it?",
    options: [
      { label: "The logic matters most", description: "Facts over feelings" },
      { label: "The tone hurts more", description: "Emotional impact first" },
      { label: "Both equally", description: "Content and delivery intertwined" },
      { label: "Who said it matters", description: "Source determines weight" },
    ],
  },
  {
    id: "Q4",
    text: "When facing an important decision, do you usually decide quickly or take time to think it through?",
    options: [
      { label: "Decide quickly", description: "Trust gut instinct" },
      { label: "Take my time", description: "Analyze all angles" },
      { label: "Depends on stakes", description: "Scale effort to importance" },
      { label: "Ask others first", description: "Seek external input" },
    ],
  },
  {
    id: "Q5",
    text: "After making a decision, how often do you find yourself regretting or rethinking it?",
    options: [
      { label: "Rarely look back", description: "Commit and move on" },
      { label: "Often second-guess", description: "Revisit choices frequently" },
      { label: "Only if it fails", description: "Outcome determines reflection" },
      { label: "Always briefly", description: "Quick review, then accept" },
    ],
  },
];

const QuestionnaireFlow = ({ onComplete, isProcessing }: QuestionnaireFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, { option: string; elaboration: string }>>({
    Q1: { option: "", elaboration: "" },
    Q2: { option: "", elaboration: "" },
    Q3: { option: "", elaboration: "" },
    Q4: { option: "", elaboration: "" },
    Q5: { option: "", elaboration: "" },
  });

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const isFirstQuestion = currentStep === 0;
  const currentResponse = responses[currentQuestion.id];

  const handleOptionSelect = (optionLabel: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        option: optionLabel,
      },
    }));
  };

  const handleElaborationChange = (value: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        elaboration: value,
      },
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Convert to simple string format for reflection
      const formattedResponses: Record<string, string> = {};
      Object.entries(responses).forEach(([key, value]) => {
        formattedResponses[key] = value.elaboration 
          ? `${value.option} — ${value.elaboration}`
          : value.option;
      });
      onComplete(formattedResponses);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstQuestion) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey && currentResponse.option) {
      handleNext();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-center gap-2">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
              index === currentStep
                ? "bg-primary"
                : index < currentStep
                ? "bg-primary/40"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Question number */}
      <p className="text-center text-sm text-muted-foreground font-body">
        Question {currentStep + 1} of {questions.length}
      </p>

      {/* Question text */}
      <div className="text-center px-4">
        <h2 className="font-display text-2xl md:text-3xl text-foreground leading-relaxed">
          {currentQuestion.text}
        </h2>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentQuestion.options.map((option) => (
          <button
            key={option.label}
            onClick={() => handleOptionSelect(option.label)}
            disabled={isProcessing}
            className={`p-4 rounded-xl text-left transition-all duration-200 border ${
              currentResponse.option === option.label
                ? "bg-primary/10 border-primary text-foreground"
                : "bg-secondary/50 border-border/50 hover:bg-secondary hover:border-border text-foreground/80"
            }`}
          >
            <p className="font-body font-medium text-sm">{option.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
          </button>
        ))}
      </div>

      {/* Elaboration input */}
      {currentResponse.option && (
        <div className="glass-panel rounded-2xl p-1 shadow-soft animate-fade-in">
          <Textarea
            value={currentResponse.elaboration}
            onChange={(e) => handleElaborationChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add your own thoughts (optional)..."
            className="min-h-[80px] border-0 bg-transparent resize-none text-base placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 p-4"
            disabled={isProcessing}
          />
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between items-center pt-2">
        <Button
          onClick={handleBack}
          disabled={isFirstQuestion || isProcessing}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground font-body"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!currentResponse.option || isProcessing}
          className="group px-6 py-3 h-auto text-base font-body font-medium rounded-xl transition-all duration-300 hover:shadow-glow"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Reflecting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {isLastQuestion ? "See reflection" : "Next"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuestionnaireFlow;
