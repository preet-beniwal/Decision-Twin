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
  },
  {
    id: "Q2",
    text: "You must choose between a stable but average-paying option and a risky option with much higher reward. Which do you choose and why?",
  },
  {
    id: "Q3",
    text: "If someone criticizes you publicly, what affects you more: the logic of what they say or the way they say it?",
  },
  {
    id: "Q4",
    text: "When facing an important decision, do you usually decide quickly or take time to think it through? Explain briefly.",
  },
  {
    id: "Q5",
    text: "After making a decision, how often do you find yourself regretting or rethinking it?",
  },
];

const QuestionnaireFlow = ({ onComplete, isProcessing }: QuestionnaireFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({
    Q1: "",
    Q2: "",
    Q3: "",
    Q4: "",
    Q5: "",
  });

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const isFirstQuestion = currentStep === 0;

  const handleResponseChange = (value: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(responses);
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
    if (e.key === "Enter" && e.metaKey && responses[currentQuestion.id].trim()) {
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

      {/* Input area */}
      <div className="glass-panel rounded-2xl p-1 shadow-soft">
        <Textarea
          value={responses[currentQuestion.id]}
          onChange={(e) => handleResponseChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share your thoughts..."
          className="min-h-[140px] border-0 bg-transparent resize-none text-lg placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 p-5"
          disabled={isProcessing}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
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
          disabled={!responses[currentQuestion.id].trim() || isProcessing}
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
