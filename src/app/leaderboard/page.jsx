"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Leaderboard() {
  const [data, setData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("quizLeaderboard");
    if (raw) setData(JSON.parse(raw));
  }, []);

  const entries = Object.entries(data);

  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-[#1c192b] text-white flex items-center justify-center text-xl">
        Nessun punteggio salvato ancora.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c192b] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#ffe066]">
        La tua Leaderboard
      </h1>
      
        {/* 👉 Bottone fuori dalla map */}
        <button
          onClick={() => router.push("/categories")}
          className="mt-6 px-4 py-2 rounded-lg bg-[#2a2540] text-[#ffe066] font-semibold hover:scale-105 transition cursor-pointer"
        >
          ⬅️ Torna alle categorie
        </button>
      <div className="space-y-4 max-w-xl mx-auto">
        {entries.map(([id, entry]) => (
          <div
            key={id}
            className="p-4 bg-[#2a2540] rounded-xl shadow text-white"
          >
            <h2 className="text-xl font-semibold mb-2 text-[#ffe066]">
              {entry.categoryName}
            </h2>

            <p>Partite giocate: {entry.plays}</p>
            <p>Punteggio migliore: {entry.bestScore}</p>
            <p>Ultimo punteggio: {entry.lastScore}</p>
            <p>Media punteggi: {entry.averageScore.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}