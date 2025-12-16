"use client";

import { useRouter } from "next/navigation";
import {playSound} from "../../lib/audio.js"; 

export default function QuizResults({ score, questions, userAnswers }) {
  const router = useRouter();

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

      {/* BOTTONE TORNA ALLE CATEGORIE */}
      <button
        className="mt-8 px-6 py-3 rounded-xl bg-linear-to-br from-[#ffe066] to-[#ffcc00] text-black font-semibold shadow-[0_0_15px_rgba(255,230,102,0.6)] hover:scale-105 transition cursor-pointer"
          onClick={() => {
                   playSound("/sounds/start.wav", 0.4);
                   router.push("/categories");
                   }}
      >
        Torna alle categorie
      </button>
    </div>
  );
}