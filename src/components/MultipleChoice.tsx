
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";

function MultipleChoice({
  questionId,
  question,
  options,
  correctAnswer,
  onAnswerUpdate,
}: {
  questionId: number;
  question: string;
  options: string[];
  correctAnswer: string;
  onAnswerUpdate: (questionId: number, score: number) => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [incorrectOptions, setIncorrectOptions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleCheck = () => {
    if (showFeedback) {
      return;
    }

    if (selectedAnswer === correctAnswer) {
      setShowFeedback(true);
      const score = getScore(attempts);
      if (!hasAnswered) {
        onAnswerUpdate(questionId, score);
        setHasAnswered(true);
      }
      toast({
        title: "Correct!",
        description: `You have selected the correct answer on attempt ${
          attempts + 1
        }. Score obtained: ${score.toFixed(2)}.`,
        variant: "default",
      });
    } else {
      setAttempts(attempts + 1);
      setIncorrectOptions((prev) => [...prev, selectedAnswer!]);
      if (attempts >= 2) {
        setShowFeedback(true);
        if (!hasAnswered) {
          onAnswerUpdate(questionId, 0);
          setHasAnswered(true);
        }
        toast({
          title: "Incorrect",
          description: `You have exhausted the attempts. The correct answer is: ${correctAnswer}.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Incorrect",
          description: `Attempt ${
            attempts + 1
          } of 3. A 25% deduction will be applied to the score. Try again.`,
          variant: "destructive",
        });
      }
      setSelectedAnswer(null); // Clear selection for the next attempt
    }
  };

  const getScore = (attempts: number) => {
    if (attempts === 0) return 1.0;
    if (attempts === 1) return 0.75;
    if (attempts === 2) return 0.5;
    return 0;
  };

  // Handle the Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && selectedAnswer && !showFeedback && !hasAnswered) {
      handleCheck();
    }
  };

  return (
    <div
      className="space-y-4 border-4 p-4 rounded-md"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <h2 className="text-xl font-semibold">{question}</h2>
      <RadioGroup
        value={selectedAnswer || ""}
        onValueChange={setSelectedAnswer}
      >
        {options.map((option, index) => {
          const isCorrect = option === correctAnswer;

          const isIncorrect = incorrectOptions.includes(option);
          let icon = null;

          if (showFeedback || isIncorrect) {
            if (isCorrect) {
              icon = <CheckIcon className="text-green-600 ml-2" />;
            } else if (isIncorrect) {
              icon = <Cross2Icon className="text-red-600 ml-2" />;
            }
          }

          return (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option}
                id={`option-${questionId}-${index}`}
                disabled={showFeedback || isIncorrect || hasAnswered}
              />
              <Label
                htmlFor={`option-${questionId}-${index}`}
                className="flex items-center"
              >
                {option}
                {icon}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      <Button
        className="bg-green-600"
        onClick={handleCheck}
        disabled={!selectedAnswer || showFeedback || hasAnswered}
      >
        Check answer
      </Button>
      {showFeedback && (
        <div className="mt-2">
          <p
            className={
              selectedAnswer === correctAnswer
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {selectedAnswer === correctAnswer
              ? `Correct! Score obtained: ${getScore(attempts).toFixed(2)}`
              : `Incorrect. The correct answer is: ${correctAnswer}`}
          </p>
        </div>
      )}
    </div>
  );
}

export default MultipleChoice;