"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome to CBT Champ
      </h1>
      <p className="text-gray-600 mb-10">Please choose your role:</p>

      <div className="flex space-x-8">
        {/* Student Button */}
        <Link href="/student">
          <button className="px-8 py-4 rounded-xl bg-green-500 text-white font-semibold shadow-lg hover:bg-green-600 hover:scale-105 transform transition-all duration-300">
            Student
          </button>
        </Link>

        {/* Admin Button */}
        <Link href="/admin">
          <button className="px-8 py-4 rounded-xl bg-blue-500 text-white font-semibold shadow-lg hover:bg-blue-600 hover:scale-105 transform transition-all duration-300">
            Admin
          </button>
        </Link>
      </div>
    </div>
  );
}
