
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";

function WordFormation({
  questionId,
  question,
  correctAnswer,
  onAnswerUpdate,
}: {
  questionId: number;
  question: string;
  correctAnswer: string;
  onAnswerUpdate: (questionId: number, score: number) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const { toast } = useToast();

  const handleCheck = () => {
    if (showFeedback) {
      return;
    }
    if (answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
      setShowFeedback(true);
      const score = getScore(attempts);
      if (!hasAnswered) {
        onAnswerUpdate(questionId, score);
        setHasAnswered(true);
      }
      toast({
        title: "Correct!",
        description: `You have entered the correct word on attempt ${
          attempts + 1
        }. Score obtained: ${score.toFixed(2)}.`,
        variant: "default",
      });
    } else {
      setAttempts(attempts + 1);
      if (attempts >= 2) {
        setShowFeedback(true);
        if (!hasAnswered) {
          onAnswerUpdate(questionId, 0);
          setHasAnswered(true);
        }
        toast({
          title: "Incorrect",
          description: `You have exhausted the attempts. The correct word is: ${correctAnswer}.`,
          variant: "destructive",
        });
      } else {
        setAnswer(""); // Clear input
        toast({
          title: "Incorrect",
          description: `Attempt ${
            attempts + 1
          } of 3. A 25% deduction will be applied to the score. Try again.`,
          variant: "destructive",
        });
      }
    }
  };

  const getScore = (attempts: number) => {
    if (attempts === 0) return 1.0;
    if (attempts === 1) return 0.75;
    if (attempts === 2) return 0.5;
    return 0;
  };

  // Handle the Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && answer && !showFeedback && !hasAnswered) {
      handleCheck();
    }
  };

  return (
    <div className="space-y-4 border-4 p-4 rounded-md">
        
      <h2 className="text-xl font-semibold">
      <span className="text-sm font-normal">{questionId} </span>
        {question}</h2>
      <div className="flex items-center">
        <Input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here"
          disabled={showFeedback}
          onKeyDown={handleKeyDown}
        />
        {showFeedback && (
          <>
            {answer.toLowerCase().trim() ===
            correctAnswer.toLowerCase().trim() ? (
              <CheckIcon className="text-green-600 ml-2" />
            ) : (
              <Cross2Icon className="text-red-600 ml-2" />
            )}
          </>
        )}
      </div>
      <Button
        className="bg-green-600"
        onClick={handleCheck}
        disabled={!answer || showFeedback || hasAnswered}
      >
        Check word
      </Button>
      {showFeedback && (
        <div className="mt-2">
          <p
            className={
              answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
              ? `Correct! Score obtained: ${getScore(attempts).toFixed(2)}`
              : `Incorrect. The correct word is: ${correctAnswer}`}
          </p>
        </div>
      )}
    </div>
  );
}

export default WordFormation;