"use client";
import { useJambMode } from "@/hooks/useJambMode";

export default function JambModeSelector({ subjects, onStartSingle, onStartSession }) {
  const {
    englishSubject,
    otherSubjects,
    selectedSingle,
    setSelectedSingle,
    selectedSession,
    toggleSessionSubject,
    hasValidDuration,
  } = useJambMode(subjects);

  const handleStartSingle = () => {
    const subject = subjects.find((s) => s.id === selectedSingle);
    if (!subject) return alert("Please select a subject");
    if (!hasValidDuration(subject)) {
      return alert(`⚠️ Invalid duration for ${subject.name}`);
    }
    onStartSingle(selectedSingle);
  };

  const handleStartSession = () => {
    if (selectedSession.length !== 3) {
      alert("Please select exactly 3 additional subjects");
      return;
    }

    const selectedSubjects = [englishSubject, ...selectedSession.map((id) =>
      subjects.find((s) => s.id === id)
    )];

    const invalid = selectedSubjects.filter((s) => !hasValidDuration(s));
    if (invalid.length > 0) {
      alert(`⚠️ Invalid duration for: ${invalid.map((s) => s.name).join(", ")}`);
      return;
    }

    onStartSession([englishSubject.id, ...selectedSession]);
  };

  return (
    <div className="space-y-6">
      {/* FREE MODE */}
      <div className="border rounded p-4 bg-white shadow">
        <h2 className="font-bold mb-3">🎯 Free Mode (Single Subject)</h2>
        <select
          value={selectedSingle || ""}
          onChange={(e) => setSelectedSingle(Number(e.target.value))}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select Subject --</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.duration || "?"} min)
            </option>
          ))}
        </select>
        <button
          onClick={handleStartSingle}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Start Test
        </button>
      </div>

      {/* SESSION MODE */}
      <div className="border rounded p-4 bg-white shadow">
        <h2 className="font-bold mb-3">📝 Session Mode (English + 3)</h2>
        {englishSubject && (
          <div className="mb-2 p-2 bg-blue-100 rounded">
            ✅ {englishSubject.name} ({englishSubject.duration || "?"} min) (Compulsory)
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {otherSubjects.map((subject) => (
            <label key={subject.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedSession.includes(subject.id)}
                onChange={() => toggleSessionSubject(subject.id)}
              />
              <span>
                {subject.name} ({subject.duration || "?"} min)
              </span>
            </label>
          ))}
        </div>
        <button
          onClick={handleStartSession}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
        >
          Start Session
        </button>
      </div>
    </div>
  );
}
