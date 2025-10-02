// components/Layout.js
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 font-bold text-xl border-b border-gray-700">CBT App</div>
        <nav className="flex flex-col p-4 gap-2">
          <Link href="/" className="px-3 py-2 rounded hover:bg-gray-700">🎓 Student Mode</Link>
          <Link href="/admin" className="px-3 py-2 rounded hover:bg-gray-700">🛠️ Admin Console</Link>
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-gray-100 border-b p-4">
          <h1 className="text-lg font-semibold">Offline CBT App</h1>
          <div className="flex gap-3">
            <button onClick={() => router.push("/")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">🔄 Logout</button>
            <button onClick={() => window.electronAPI?.exitApp?.()} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">⏻ Exit</button>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
