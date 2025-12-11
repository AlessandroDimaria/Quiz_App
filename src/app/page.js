"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  // ✅ Caricamento domande
  useEffect(() => {
    fetch("/api/quiz")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => console.error("Errore:", err));
  }, []);

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

  if (loading) return <p className="p-4">Caricamento...</p>;

  // ✅ Schermata finale
  if (showAnswers) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Quiz finito!</h1>
        <p className="text-xl mb-6">Punteggio: {score} / {questions.length}</p>

        <h2 className="text-2xl font-semibold mb-4">Risposte corrette</h2>

        <ul className="text-left space-y-4">
          {questions.map((q, i) => (
            <li key={i}>
              <div
                className="font-semibold"
                dangerouslySetInnerHTML={{ __html: `${i + 1}. ${q.question}` }}
              />
              <div
                className="text-green-600"
                dangerouslySetInnerHTML={{ __html: q.correct }}
              />
            </li>
          ))}
        </ul>

        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Rifai il quiz
        </button>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">⏳ {time}s</div>
      </div>

      <h1
        className="text-xl font-bold mb-4"
        dangerouslySetInnerHTML={{ __html: q.question }}
      />

      <div className="space-y-3">
        {q.answers.map((ans, i) => {
          const isCorrect = ans === q.correct;
          const isSelected = ans === selected;

          const style =
            selected === null
              ? ""
              : isCorrect
              ? "bg-green-300 dark:bg-green-700"
              : isSelected
              ? "bg-red-300 dark:bg-red-700"
              : "opacity-50";

          return (
            <button
              key={i}
              onClick={() => answerClick(ans)}
              disabled={selected !== null}
              className={`w-full p-3 border rounded transition ${style}`}
              dangerouslySetInnerHTML={{ __html: ans }}
            />
          );
        })}
      </div>

      <p className="mt-4 text-sm opacity-70">
        Domanda {index + 1} di {questions.length}
      </p>
    </div>
  );
}