"use client";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import questionsData from "./questions.json";

// Importing icons
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons"; // Make sure you have this package installed

type Question = {
  id: number;
  type: "multiple-choice" | "fill-in-the-gap";
  question: string;
  options?: string[];
  correctAnswer: string;
};

const questions: Question[] = questionsData.questions as Question[];

export default function Component() {
  const { toast } = useToast();
  const [answersStatus, setAnswersStatus] = useState<{ [id: number]: number }>(
    {}
  );
  const [teacherEmail, setTeacherEmail] = useState("");
  const [studentName, setStudentName] = useState("");

  const handleAnswerUpdate = (questionId: number, score: number) => {
    setAnswersStatus((prevStatus) => ({
      ...prevStatus,
      [questionId]: score,
    }));
  };

  const totalScore = Object.values(answersStatus).reduce(
    (sum, curr) => sum + curr,
    0
  );
  const maxPossibleScore = questions.length; // Each question is worth 1 point
  const grade = ((totalScore / maxPossibleScore) * 5.0).toFixed(2);

  const handleSubmit = async () => {
    if (!teacherEmail) {
      toast({
        title: "Error",
        description: "Please enter the teacher's email.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherEmail,
          studentName,
          studentScore: totalScore.toFixed(2),
          totalQuestions: maxPossibleScore,
          studentGrade: grade,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Your score has been sent to ${teacherEmail}.`,
        });
      } else {
        toast({
          title: "Error",
          description: "There was a problem sending the email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 border-4">
      <p className="bg-gradient-to-r from-[#e0ad30] via-[#4e8649] to-[#b81c32] h-3 mb-3"></p>
      <h1 className="text-4xl font-bold text-center ">BPT PRACTICE TEST</h1>
      <p className="text-center mb-4"> (2024-2)</p>
      {questions.map((question) => (
        <div key={question.id} className="mb-8">
          {question.type === "multiple-choice" ? (
            <MultipleChoice
              questionId={question.id}
              question={question.question}
              options={question.options!}
              correctAnswer={question.correctAnswer}
              onAnswerUpdate={handleAnswerUpdate}
            />
          ) : (
            <FillInTheGap
              questionId={question.id}
              question={question.question}
              correctAnswer={question.correctAnswer}
              onAnswerUpdate={handleAnswerUpdate}
            />
          )}
        </div>
      ))}
      <h2 className="text-xl font-bold mb-4">Results</h2>
      <p className="mb-4">
        You have obtained {totalScore.toFixed(2)} points out of a maximum of{" "}
        {maxPossibleScore}.
      </p>
      <p
        className={`mb-4 border-solid border-2 p-2 ${
          Number(grade) <= 3
            ? "text-red-800 bold text-lg"
            : "text-green-700 bold text-lg"
        }`}
      >
        Your grade is: {grade} / 5.0
      </p>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Send results</h2>
        <Input
          type="text"
          placeholder="Your name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="mb-2"
        />
        <Input
          type="email"
          placeholder="Teacher's email"
          value={teacherEmail}
          onChange={(e) => setTeacherEmail(e.target.value)}
          className="mb-2"
        />
        <Button className="w-full" onClick={handleSubmit}>
          Send score
        </Button>
      </div>
      <Footer />
    </div>
  );
}

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

function FillInTheGap({
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
        description: `You have entered the correct answer on attempt ${
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
          description: `You have exhausted the attempts. The correct answer is: ${correctAnswer}.`,
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
      <h2 className="text-xl font-semibold">{question}</h2>
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
        Check answer
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
              : `Incorrect. The correct answer is: ${correctAnswer}`}
          </p>
        </div>
      )}
    </div>
  );
}
