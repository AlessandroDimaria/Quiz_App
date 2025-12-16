"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "../categories/page";
import { playSound } from "../../lib/audio";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  

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
      .catch((err) => {
        console.error("Errore:", err);
        setLoading(false);
      });
  }, [category]);

  // ✅ Timer
  useEffect(() => {
    if (loading || selected !== null) return;
    if (time === 0) return handleTimeout();

    const t = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [time, loading, selected]);

  // ✅ Salva punteggio in leaderboard quando il quiz è finito
  useEffect(() => {
    if (showAnswers) {
      saveScoreToLeaderboard(category, score, questions.length);
    }
  }, [showAnswers, category, score, questions.length]);

  function getCategoryName(id) {
    const cat = categories.find((c) => c.id == id);
    return cat ? cat.name : "Categoria sconosciuta";
  }

  function saveScoreToLeaderboard(categoryId, score, total) {
    if (!categoryId) return; // extra sicurezza

    const key = "quizStats";
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    const data = raw ? JSON.parse(raw) : {};

    const categoryName = getCategoryName(categoryId);

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

const answerClick = (ans) => {
  if (selected) return;
  if (!questions[index]) return;

  setUserAnswers((prev) => [
    ...prev,
    {
      question: questions[index].question,
      correct: questions[index].correct,
      chosen: ans,
    },
  ]);

  setSelected(ans);
  const isCorrect = ans === questions[index].correct;
  
  if (isCorrect) {
    playSound('/sounds/right.mp3', 0.2); // ✅ GIUSTA
    setScore((s) => s + 1);
  } else {
    playSound('/sounds/wrong.mp3', 0.2);  // ❌ SBAGLIATA
  }

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

  // ✅ return condizionali DOPO tutti gli hook

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c192b] flex items-center justify-center text-white text-xl">
         <img 
        src="loading.gif" 
        alt="Caricamento..." 
      />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#1c192b] flex items-center justify-center text-white text-xl flex-col gap-4">
        <p>Non sono riuscito a caricare le domande.</p>
        <button
          onClick={() => router.push("/categories")}
          className="px-4 py-2 rounded-lg bg-[#2a2540] text-[#ffe066] font-semibold hover:scale-105 transition cursor-pointer"
        >
          Torna alle categorie
        </button>
      </div>
    );
  }

  const q = questions[index];

  if (!q) {
    return (
      <div className="min-h-screen bg-[#1c192b] flex items-center justify-center text-white text-xl">
        Errore nel caricamento delle domande
      </div>
    );
  }

  // ✅ Schermata finale
  if (showAnswers) {
    return (
      <div className="min-h-screen bg-[#1c192b] text-white p-6 flex flex-col items-center page-slide-right">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-[0_0_10px_rgba(255,230,102,0.7)]">
          Quiz finito!
        </h1>

        <p className="text-2xl mb-6 text-[#ffe066]">
          Punteggio: {score} / {questions.length}
        </p>

        <h2 className="text-2xl font-semibold mb-4">Le tue risposte</h2>

        <ul className="w-full max-w-xl space-y-4">
          {userAnswers.map((item, i) => {
            const isCorrect = item.chosen === item.correct;

            return (
              <li key={i} className="p-4 rounded-xl bg-[#2a2540] shadow">
                <p
                  className="font-semibold mb-2"
                  dangerouslySetInnerHTML={{
                    __html: `${i + 1}. ${item.question}`,
                  }}
                />

                <p
                  className={`mb-1 ${
                    isCorrect ? "text-green-400" : "text-red-400"
                  }`}
                >
                  Tua risposta:{" "}
                  <span dangerouslySetInnerHTML={{ __html: item.chosen }} />
                </p>

                {!isCorrect && (
                  <p className="text-green-400">
                    Corretta:{" "}
                    <span dangerouslySetInnerHTML={{ __html: item.correct }} />
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        <button
          className="mt-8 px-6 py-3 rounded-xl bg-linear-to-br from-[#ffe066] to-[#ffcc00] text-black font-semibold shadow-[0_0_15px_rgba(255,230,102,0.6)] hover:scale-105 transition cursor-pointer"
          onClick={() => router.push("/categories")}
        >
          Torna alle categorie
        </button>
      </div>
    );
  }

  // ✅ Schermata quiz in corso
  return (
    <div className="min-h-screen w-full bg-[#1c192b] text-white p-6 flex justify-center items-center">
      <div className="max-w-xl w-full page-slide-right">
        <div className="max-w-xl w-full page-slide-right">
          <button
            onClick={() => router.push("/categories")}
            className="mb-6 px-4 py-2 rounded-lg bg-[#2a2540] text-[#ffe066] font-semibold hover:scale-105 transition cursor-pointer"
          >
            ⬅️ Torna alle categorie
          </button>
        </div>

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
                className={`w-full p-4 rounded-xl text-lg font-semibold transition-all duration-300 bg-linear-to-br from-[#ffe066] to-[#ffcc00] text-black shadow-[0_0_15px_rgba(255,230,102,0.6)] hover:scale-105 hover:shadow-[0_0_25px_rgba(255,230,102,0.9)] cursor-pointer 
          ${
            selected !== null && isCorrect
              ? "bg-green-500 text-white from-green-500 to-green-600 shadow-green-500"
              : ""
          }
          ${
            selected !== null && isSelected && !isCorrect
              ? "bg-red-500 text-white from-red-500 to-red-600 shadow-red-500"
              : ""
          }
          ${
            selected !== null && !isSelected && !isCorrect ? "opacity-40" : ""
          }
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