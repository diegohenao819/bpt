"use client";

import { useState } from "react";
import MultipleChoice from "@/components/MultipleChoice";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "If I ________ harder, I would have passed the exam.",
    options: ["had studied", "studied", "study", "will study"],
    correctAnswer: "had studied",
  },
  {
    id: 2,
    question: "She wouldn't have called if she ________ about the meeting.",
    options: ["knew", "had known", "know", "will know"],
    correctAnswer: "had known",
  },
  {
    id: 3,
    question: "If it rains tomorrow, we ________ indoors.",
    options: ["stay", "stayed", "will stay", "would stay"],
    correctAnswer: "will stay",
  },
  {
    id: 4,
    question: "Provided that he ________ early, we will catch the train.",
    options: ["arrives", "arrived", "will arrive", "would arrive"],
    correctAnswer: "arrives",
  },
  {
    id: 5,
    question: "I would buy a house if I ________ enough money.",
    options: ["have", "had", "will have", "would have"],
    correctAnswer: "had",
  },
];

export default function ConditionalsPractice() {
  const [scores, setScores] = useState<{ [key: number]: number }>({});

  const handleAnswerUpdate = (id: number, score: number) => {
    setScores((prev) => ({ ...prev, [id]: score }));
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Conditionals Practice</h1>
      {questions.map((q) => (
        <div key={q.id} className="mb-6">
          <MultipleChoice
            questionId={q.id}
            question={q.question}
            options={q.options}
            correctAnswer={q.correctAnswer}
            onAnswerUpdate={handleAnswerUpdate}
          />
        </div>
      ))}
      <h2 className="text-xl font-bold mt-8">Results</h2>
      <p>
        You have obtained {totalScore.toFixed(2)} points out of a maximum of {questions.length}.
      </p>
    </div>
  );
}
