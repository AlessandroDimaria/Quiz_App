"use client";

import { useSearchParams } from "next/navigation";
import useQuizLogic from "./useQuizLogic";
import QuizLoader from "./QuizLoader";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";

export default function QuizClient() {
  const params = useSearchParams();
  const category = params.get("category");

  const quiz = useQuizLogic(category);

  if (quiz.loading) return <QuizLoader />;
  if (quiz.showAnswers) return <QuizResults {...quiz} />;
  if (!quiz.questions.length) return <div>Errore nel caricamento</div>;

  return <QuizQuestion {...quiz} />;
}