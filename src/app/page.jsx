"use client";

import { useRouter } from "next/navigation";
import { playSound } from "../lib/audio.js";

export default function Home() {
  const router = useRouter();
   const handleStartClick = () => {
    playSound('/sounds/start.wav', 0.3);
    router.push("/categories");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#1c192b] relative">

      {/* PARTICELLE ATTORNO AL TITOLO */}
      <div className="particle" style={{ top: "28%", left: "48%", animationDelay: "0s" }}></div>
      <div className="particle" style={{ top: "32%", left: "42%", animationDelay: "0.3s" }}></div>
      <div className="particle" style={{ top: "34%", left: "55%", animationDelay: "0.6s" }}></div>
      <div className="particle" style={{ top: "38%", left: "60%", animationDelay: "0.9s" }}></div>
      <div className="particle" style={{ top: "36%", left: "35%", animationDelay: "1.2s" }}></div>

      {/* TITOLO */}
<h1
  className="text-7xl font-extrabold text-center bg-linear-to-br from-[#ffe066] to-[#ffcc00] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,230,102,0.8)] mb-16"
>
  Quiz Master
</h1>

      {/* PARTICELLE ATTORNO AL BOTTONE */}
      <div className="particle" style={{ top: "55%", left: "47%", animationDelay: "0.2s" }}></div>
      <div className="particle" style={{ top: "58%", left: "53%", animationDelay: "0.5s" }}></div>
      <div className="particle" style={{ top: "62%", left: "44%", animationDelay: "0.8s" }}></div>
      <div className="particle" style={{ top: "65%", left: "50%", animationDelay: "1.1s" }}></div>
      <div className="particle" style={{ top: "60%", left: "58%", animationDelay: "1.4s" }}></div>

      {/* BOTTONE */}
      <button
        onClick={handleStartClick} 
        className="w-32 h-32 rounded-full text-black text-3xl font-semibold flex items-center justify-center relative cursor-pointer"
        style={{
          background: "radial-gradient(circle, #ffe066, #ffcc00)",
          boxShadow: "0 0 25px rgba(255, 230, 102, 0.7)",
          animation: "float 3s ease-in-out infinite",
        }}
      >
        Start
      </button>
    </div>
  );
}