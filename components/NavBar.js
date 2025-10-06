"use client";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-gray-900 text-white p-3 flex justify-between items-center">
      <h1 className="font-bold text-lg">CBT Platform</h1>
      <div className="flex gap-4">
        <Link href="/">
          <span className="cursor-pointer hover:text-blue-300">Home</span>
        </Link>
        <Link href="/student">
          <span className="cursor-pointer hover:text-blue-300">Student</span>
        </Link>
        <Link href="/admin">
          <span className="cursor-pointer hover:text-blue-300">Admin</span>
        </Link>
      </div>
    </nav>
  );
}
