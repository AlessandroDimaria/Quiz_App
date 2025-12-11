"use client";

import { useRouter } from "next/navigation";

const categories = [
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
            <div className="page-slide-right p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Scegli una categoria</h1>

      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => selectCategory(cat.id)}
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-lg"
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}