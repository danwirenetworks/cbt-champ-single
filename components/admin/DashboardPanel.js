import { useEffect, useState } from "react";

export default function DashboardPanel() {
  const [stats, setStats] = useState({
    exams: 0,
    subjects: 0,
    candidates: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    (async () => {
      const exams = await window.electronAPI.get_exams();
      const candidates = await window.electronAPI.get_candidates();

      let subjectCount = 0;
      for (const exam of exams) {
        const subjects = await window.electronAPI.get_subjects(exam.id);
        subjectCount += subjects.length;
      }

      setStats({
        exams: exams.length,
        subjects: subjectCount,
        candidates: candidates.length,
      });

      // Mocked recent activity
      setRecentActivity([
        { type: "exam", action: "Added", name: "Math CBT" },
        { type: "subject", action: "Deleted", name: "Old Physics" },
        { type: "candidate", action: "Registered", name: "Femi Adeyemi" },
      ]);
    })();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">📊 System Overview</h2>

      {/* ✅ Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Exams" value={stats.exams} color="blue" />
        <StatCard label="Subjects" value={stats.subjects} color="green" />
        <StatCard label="Candidates" value={stats.candidates} color="purple" />
      </div>

      {/* 🕒 Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold mb-2">🕒 Recent Activity</h3>
        <ul className="space-y-2">
          {recentActivity.map((item, index) => (
            <li
              key={index}
              className="bg-gray-50 p-3 rounded border flex justify-between items-center"
            >
              <span>
                <strong>{item.action}</strong> {item.type}: {item.name}
              </span>
              <span className="text-xs text-gray-500">Just now</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const bg = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
  }[color];

  return (
    <div className={`p-4 rounded shadow ${bg}`}>
      <h4 className="text-sm font-medium">{label}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
