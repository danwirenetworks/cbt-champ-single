"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function EntryPage() {
  const [text, setText] = useState("");
  const fullText = "www.cbtchamp.com";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText((prev) => prev + fullText.charAt(index));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-400">
      <h1 className="text-4xl md:text-6xl font-mono text-white animate-pulse">
        {text}
        <span className="border-r-2 border-white animate-blink ml-1"></span>
      </h1>

      <Link href="/home">
        <button className="mt-10 px-8 py-3 rounded-full bg-white text-amber-600 font-semibold text-lg shadow-lg hover:bg-amber-100 hover:scale-105 transform transition-all duration-300">
          Get Started
        </button>
      </Link>
    </div>
  );
}