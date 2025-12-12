"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  // ✅ Carica domande
  useEffect(() => {
    if (!category) return;

    setLoading(true);

    fetch(`/api/quiz?category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => console.error("Errore:", err));
  }, [category]);

  // ✅ Timer
  useEffect(() => {
    if (loading || selected !== null) return;
    if (time === 0) return handleTimeout();

    const t = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [time, loading, selected]);

  const handleTimeout = () => {
    setSelected("timeout");
    setTimeout(nextQuestion, 1200);
  };

  const answerClick = (ans) => {
    if (selected) return;

    setSelected(ans);
    if (ans === questions[index].correct) setScore((s) => s + 1);

    setTimeout(nextQuestion, 1200);
  };

  const nextQuestion = () => {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setTime(15);
      setSelected(null);
    } else {
      setShowAnswers(true);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#1c192b] flex items-center justify-center text-white text-xl">
        Caricamento...
      </div>
    );

  // ✅ Schermata finale
  if (showAnswers) {
    return (
      <div className="min-h-screen bg-[#1c192b] text-white flex flex-col items-center justify-center p-6 page-slide-right">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-[0_0_10px_rgba(255,230,102,0.7)]">
          Quiz finito!
        </h1>

        <p className="text-2xl mb-6 text-[#ffe066]">
          Punteggio: {score} / {questions.length}
        </p>

        <button
          className="px-6 py-3 rounded-xl bg-linear-to-br from-[#ffe066] to-[#ffcc00] text-black font-semibold shadow-[0_0_15px_rgba(255,230,102,0.6)] hover:scale-105 transition"
          onClick={() => (window.location.href = "/categories")}
        >
          Torna alle categorie
        </button>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="min-h-screen w-full bg-[#1c192b] text-white p-6 flex justify-center items-center">
      <div className="max-w-xl w-full page-slide-right">

        {/* TIMER */}
        <div className="flex justify-between items-center mb-6">
          <div
            className={`text-xl font-semibold ${
              time <= 5 ? "text-red-400 animate-pulse" : "text-[#ffe066]"
            }`}
          >
            ⏳ {time}s
          </div>
        </div>

        {/* DOMANDA */}
        <h1
          className="text-2xl font-bold mb-6 drop-shadow-[0_0_10px_rgba(255,230,102,0.6)]"
          dangerouslySetInnerHTML={{ __html: q.question }}
        />

        {/* RISPOSTE */}
<div className="space-y-4">
  {q.answers.map((ans, i) => {
    const isCorrect = ans === q.correct;
    const isSelected = ans === selected;

    return (
      <button
        key={i}
        onClick={() => answerClick(ans)}
        disabled={selected !== null}
        className={`w-full p-4 rounded-xl text-lg font-semibold transition-all duration-300 bg-linear-to-br from-[#ffe066] to-[#ffcc00] text-black shadow-[0_0_15px_rgba(255,230,102,0.6)] hover:scale-105 hover:shadow-[0_0_25px_rgba(255,230,102,0.9)]  
          ${selected !== null && isCorrect ? "bg-green-500 text-white from-green-500 to-green-600 shadow-green-500" : ""}
          ${selected !== null && isSelected && !isCorrect ? "bg-red-500 text-white from-red-500 to-red-600 shadow-red-500" : ""}
          ${selected !== null && !isSelected && !isCorrect ? "opacity-40" : ""}
        `}
        dangerouslySetInnerHTML={{ __html: ans }}
      />
    );
  })}
</div>
        <p className="mt-6 text-sm opacity-70 text-center">
          Domanda {index + 1} di {questions.length}
        </p>
      </div>
    </div>
  );
}