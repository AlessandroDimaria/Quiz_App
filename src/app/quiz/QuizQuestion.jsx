"use client";

import { useRouter } from "next/navigation";
import {playSound} from "../../lib/audio.js"; 

export default function QuizQuestion({
  questions,
  index,
  time,
  selected,
  answerClick,
}) {
  const q = questions[index];
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-[#1c192b] text-white p-6 flex justify-center items-center">
      <div className="max-w-xl w-full page-slide-right">

        {/* BOTTONE TORNA ALLE CATEGORIE */}
        <button
            onClick={() => {
           playSound("/sounds/start.wav", 0.4);
           router.push("/categories");
           }}
          className="mb-6 px-4 py-2 rounded-lg bg-[#2a2540] text-[#ffe066] font-semibold hover:scale-105 transition cursor-pointer"
        >
          ⬅️ Torna alle categorie
        </button>

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
                    selected !== null && !isSelected && !isCorrect
                      ? "opacity-40"
                      : ""
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