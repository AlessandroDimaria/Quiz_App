"use client";

import { useEffect, useState } from "react";
import { playSound } from "../../lib/audio";
import { categories } from "../categories/page";

export default function useQuizLogic(category) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  // -----------------------------
  // FETCH DOMANDE
  // -----------------------------
  useEffect(() => {
    if (!category) return;

    setLoading(true);

    fetch(`/api/quiz?category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  // -----------------------------
  // TIMER
  // -----------------------------
  useEffect(() => {
    if (loading || selected !== null) return;
    if (time === 0) return handleTimeout();

    const t = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [time, loading, selected]);

  // -----------------------------
  // SALVATAGGIO PUNTEGGIO
  // -----------------------------
  useEffect(() => {
    if (showAnswers) {
      saveScoreToLeaderboard(category, score, questions.length);
    }
  }, [showAnswers]);

  function saveScoreToLeaderboard(categoryId, score, total) {
    if (!categoryId) return;

    const key = "quizStats";
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : {};

    const categoryName =
      categories.find((c) => c.id == categoryId)?.name || "Categoria";

    const entry = data[categoryId] || {
      categoryName,
      plays: 0,
      bestScore: 0,
      lastScore: 0,
      averageScore: 0,
    };

    entry.plays += 1;
    entry.lastScore = score;
    entry.bestScore = Math.max(entry.bestScore, score);
    entry.averageScore =
      ((entry.averageScore * (entry.plays - 1)) + score) / entry.plays;

    data[categoryId] = entry;

    localStorage.setItem(key, JSON.stringify(data));
  }

  // -----------------------------
  // TIMEOUT
  // -----------------------------
  const handleTimeout = () => {
    if (!questions[index]) return;

    setSelected("timeout");

    setUserAnswers((prev) => [
      ...prev,
      {
        question: questions[index].question,
        correct: questions[index].correct,
        chosen: "Tempo scaduto",
      },
    ]);

    setTimeout(nextQuestion, 1200);
  };

  // -----------------------------
  // CLICK RISPOSTA
  // -----------------------------
  const answerClick = (ans) => {
    if (selected) return;

    const isCorrect = ans === questions[index].correct;

    setUserAnswers((prev) => [
      ...prev,
      {
        question: questions[index].question,
        correct: questions[index].correct,
        chosen: ans,
      },
    ]);

    setSelected(ans);

    if (isCorrect) {
      playSound("/sounds/right.mp3", 0.2);
      setScore((s) => s + 1);
    } else {
      playSound("/sounds/wrong.mp3", 0.2);
    }

    setTimeout(nextQuestion, 1200);
  };

  // -----------------------------
  // PROSSIMA DOMANDA
  // -----------------------------
  const nextQuestion = () => {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setTime(15);
      setSelected(null);
    } else {
      setShowAnswers(true);
    }
  };

  return {
    questions,
    index,
    score,
    time,
    selected,
    loading,
    showAnswers,
    userAnswers,
    answerClick,
    nextQuestion,
  };
}