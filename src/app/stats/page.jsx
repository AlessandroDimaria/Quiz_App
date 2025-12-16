"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {playSound} from "../../lib/audio.js"; 

export default function Stats() {
  const [data, setData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("quizStats");
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
        Statistiche Giocatore
      </h1>
      
        {/* 👉 Bottone fuori dalla map */}
        <button
           onClick={() => {
           playSound("/sounds/start.wav", 0.4);
           router.push("/categories");
           }}

          className="mt-6 px-4 py-2 rounded-lg bg-[#2a2540] text-[#ffe066] font-semibold hover:scale-105 transition cursor-pointer"
        >
          ⬅️ Torna alle categorie
        </button>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
  {entries.map(([id, entry]) => (
    <div
      key={id}
      className="p-6 rounded-2xl bg-[#241f36] border border-[#3a3450] transition-all duration-300"
    >
      <h2 className="text-2xl font-bold mb-4 text-[#ffe066] tracking-wide">
        {entry.categoryName}
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between bg-[#2f2944] p-3 rounded-xl border border-[#3a3450]">
          <p className="text-[#ffe066] font-semibold">Partite Giocate</p>
          <p className="text-white text-lg font-bold">{entry.plays}</p>
        </div>

        <div className="flex items-center justify-between bg-[#2f2944] p-3 rounded-xl border border-[#3a3450]">
          <p className="text-[#ffe066] font-semibold">BestScore</p>
          <p className="text-green-400 text-lg font-bold">{entry.bestScore}</p>
        </div>

        <div className="flex items-center justify-between bg-[#2f2944] p-3 rounded-xl border border-[#3a3450]">
          <p className="text-[#ffe066] font-semibold">Ultimo Punteggio</p>
          <p className="text-blue-400 text-lg font-bold">{entry.lastScore}</p>
        </div>

        <div className="flex items-center justify-between bg-[#2f2944] p-3 rounded-xl border border-[#3a3450]">
          <p className="text-[#ffe066] font-semibold">Media Punteggio</p>
          <p className="text-purple-400 text-lg font-bold">
            {entry.averageScore.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>
</div>)}