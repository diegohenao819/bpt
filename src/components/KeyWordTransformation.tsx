"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";

function KeyWordTransformation({
  questionId,
  question,
  correctAnswer,
  onAnswerUpdate,
}: {
  questionId: number;
  question: string;
  correctAnswer: string | string[]; // Accept string or array of strings
  onAnswerUpdate: (questionId: number, score: number) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Added state for isCorrect
  const { toast } = useToast();

  const handleCheck = () => {
    if (showFeedback) {
      return;
    }
    // Normalize user's answer
    const normalizedAnswer = answer.toLowerCase().trim();

    // Check if correctAnswer is an array and normalize all possible answers
    const possibleAnswers = Array.isArray(correctAnswer)
      ? correctAnswer.map((ans) => ans.toLowerCase().trim())
      : [correctAnswer.toLowerCase().trim()];

    // Check if the user's answer matches any of the possible correct answers
    const answerIsCorrect = possibleAnswers.includes(normalizedAnswer);

    // Update isCorrect state
    setIsCorrect(answerIsCorrect);

    if (answerIsCorrect) {
      setShowFeedback(true);
      const score = getScore(attempts);
      if (!hasAnswered) {
        onAnswerUpdate(questionId, score);
        setHasAnswered(true);
      }
      toast({
        title: "Correct!",
        description: `You have entered the correct transformation on attempt ${
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
        // Prepare correct answers for display
        const correctAnswersDisplay = possibleAnswers.join(" / ");

        toast({
          title: "Incorrect",
          description: `You have exhausted the attempts. The correct transformation is: ${correctAnswersDisplay}.`,
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
      {question.split("\n").map((part, index) => (
        <h2 key={index} className="text-xl font-semibold">
          {part}
        </h2>
      ))}
      <div className="flex items-center">
        <Input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your transformation here"
          disabled={showFeedback}
          onKeyDown={handleKeyDown}
        />
        {showFeedback && isCorrect !== null && (
          <>
            {isCorrect ? (
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
        Check transformation
      </Button>
      {showFeedback && isCorrect !== null && (
        <div className="mt-2">
          <p className={isCorrect ? "text-green-600" : "text-red-600"}>
            {isCorrect
              ? `Correct! Score obtained: ${getScore(attempts).toFixed(2)}`
              : `Incorrect. The correct transformation is: ${Array.isArray(
                  correctAnswer
                )
                  ? correctAnswer.join(" / ")
                  : correctAnswer}`}
          </p>
        </div>
      )}
    </div>
  );
}

export default KeyWordTransformation;
