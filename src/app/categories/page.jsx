"use client";

import { useRouter } from "next/navigation";

export const categories = [
  { id: 9, name: "General Knowledge" },
  { id: 21, name: "Sports" },
  { id: 23, name: "History" },
  { id: 17, name: "Science & Nature" },
  { id: 22, name: "Geography" },
  { id: 11, name: "Film" },
  { id: 15, name: "Video Games" },
  { id: 12, name: "Music" },
];

export default function Categories() {
  const router = useRouter();

  function selectCategory(id) {
    router.push(`/quiz?category=${id}`);
  }

return (
  <div className="min-h-screen w-full bg-[#1c192b] page-slide-right flex justify-center">
    <div className="p-6 max-w-xl w-full">
      
      <h1 className="text-3xl font-bold text-center mb-6 text-white">
        Scegli una categoria
      </h1>

      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => selectCategory(cat.id)}
            className="p-4 rounded-xl text-lg font-semibold bg-linear-to-br from-[#ffe066] to-[#ffcc00] text-black shadow-[0_0_15px_rgba(255,230,102,0.6)] hover:scale-105 hover:shadow-[0_0_25px_rgba(255,230,102,0.9)] transition-all duration-300 cursor-pointer"
          >
            {cat.name}
          </button>
        ))}
      </div>
<button
  onClick={() => router.push("/stats")}
  className="mb-8 px-6 py-3 rounded-xl mt-4 bg-[#2a2540] text-[#ffe066] font-semibold hover:scale-105 transition-all"
>
  ⬅️ Statistiche Giocatore
</button>
    </div>
  </div>
);
}
