"use client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"; // Import Select components

import { useToast } from "@/hooks/use-toast";

import { useState } from "react";
import questionsData from "./questions.json";

// Import the components from their new files
import MultipleChoice from "@/components/MultipleChoice";
import FillInTheGap from "@/components/FillInTheGap";
import WordFormation from "@/components/WordFormation";
import KeyWordTransformation from "@/components/KeyWordTransformation";

type Question = {
  id: number;
  type:
    | "multiple-choice"
    | "fill-in-the-gap"
    | "word-formation"
    | "key-word-transformation";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
};

type Section = {
  title: string;
  questions: Question[];
};

const sections: Section[] = questionsData.sections as Section[];

// List of teacher emails
const teacherEmails = [
  "dialhenao@utp.edu.co",
  "laura.alfonso@utp.edu.co",
  "mauricio.ramirez@utp.edu.co",
  "sohincapie@utp.edu.co",
];

export default function UseOfEnglishTest() {
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

  const totalQuestions = sections.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );

  const maxPossibleScore = totalQuestions; // Each question is worth 1 point
  const grade = ((totalScore / maxPossibleScore) * 5.0).toFixed(2);

  const handleSubmit = async () => {
    if (!teacherEmail) {
      toast({
        title: "Error",
        description: "Please select your teacher's email.",
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
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-2xl font-bold my-4 bg-green-300 text-center rounded-md">
            {section.title}
          </h2>
          {section.questions.map((question) => (
            <div key={question.id} className="mb-8">
              {question.type === "multiple-choice" ? (
                <MultipleChoice
                  questionId={question.id}
                  question={question.question}
                  options={question.options!}
                  correctAnswer={question.correctAnswer as string}
                  onAnswerUpdate={handleAnswerUpdate}
                />
              ) : question.type === "fill-in-the-gap" ? (
                <FillInTheGap
                  questionId={question.id}
                  question={question.question}
                  correctAnswer={question.correctAnswer as string}
                  onAnswerUpdate={handleAnswerUpdate}
                />
              ) : question.type === "word-formation" ? (
                <WordFormation
                  questionId={question.id}
                  question={question.question}
                  correctAnswer={question.correctAnswer as string}
                  onAnswerUpdate={handleAnswerUpdate}
                />
              ) : question.type === "key-word-transformation" ? (
                <KeyWordTransformation
                  questionId={question.id}
                  question={question.question}
                  correctAnswer={question.correctAnswer}
                  onAnswerUpdate={handleAnswerUpdate}
                />
              ) : null}
            </div>
          ))}
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
            ? "text-red-800 font-bold text-lg"
            : "text-green-700 font-bold text-lg"
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
        {/* Replace the teacher's email input with a select component */}
        <Select onValueChange={(value) => setTeacherEmail(value)}>
          <SelectTrigger className="w-full mb-2 ">
            <SelectValue placeholder="Select your teacher's email" />
          </SelectTrigger>
          <SelectContent>
            {teacherEmails.map((email) => (
              <SelectItem key={email} value={email}>
                {email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="w-full" onClick={handleSubmit}>
          Send score
        </Button>
      </div>
      
    </div>
  );
}
