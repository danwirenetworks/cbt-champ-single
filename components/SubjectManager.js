"use client";
import { useState, useEffect } from "react";

export default function SubjectManager({ selectedExam, selectedSubject, setSelectedSubject }) {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: "", duration: 30 });
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const isSessionMode = selectedExam?.timingMode === "session";

  useEffect(() => {
    if (!selectedExam) return;
    (async () => {
      const data = await window.electronAPI.get_subjects(selectedExam.id);
      setSubjects(data);
    })();
  }, [selectedExam]);

  const handleAdd = async () => {
  if (!selectedExam || !selectedExam.id) {
    return alert("⚠️ Please select an exam first.");
  }
  if (!newSubject.name.trim()) return alert("Enter subject name");

  const res = await window.electronAPI.add_subject({
    exam_id: selectedExam.id,
    name: newSubject.name.trim(),
    duration: isSessionMode ? 0 : parseInt(newSubject.duration, 10) || 30,
  });

  if (!res.error) {
    setNewSubject({ name: "", duration: 30 });
    const updated = await window.electronAPI.get_subjects(selectedExam.id);
    setSubjects(updated);
  }
};

  const handleEdit = async (id, name, duration) => {
    setSavingId(id);
    const res = await window.electronAPI.edit_subject({
      id,
      name,
      duration: isSessionMode ? 0 : parseInt(duration, 10) || 30,
    });
    if (!res.error) {
      const updated = await window.electronAPI.get_subjects(selectedExam.id);
      setSubjects(updated);
      setEditingId(null);
    }
    setTimeout(() => setSavingId(null), 1000);
  };

  return (
    <div className="border rounded p-4 bg-white shadow mt-6">
      <h2 className="font-bold text-lg mb-4">📚 Subjects for {selectedExam?.name}</h2>

      {/* ➕ Add Subject */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Subject name"
          value={newSubject.name}
          onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
          className="border p-2 rounded w-1/2"
        />
        <input
          type="number"
          placeholder="Duration (min)"
          value={newSubject.duration}
          onChange={(e) => setNewSubject({ ...newSubject, duration: e.target.value })}
          className="border p-2 rounded w-1/4"
          disabled={isSessionMode}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Subject
        </button>
      </div>

      {/* 📝 Subject List */}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Duration</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subj) => (
            <tr
              key={subj.id}
              className={`border-b cursor-pointer ${
                selectedSubject?.id === subj.id ? "bg-blue-50" : ""
              }`}
              onClick={() => setSelectedSubject(subj)}
            >
              <td className="py-2">{subj.name}</td>
              <td className="py-2">
                {editingId === subj.id ? (
                  <input
                    type="number"
                    value={subj.duration}
                    onChange={(e) => {
                      const updated = subjects.map((s) =>
                        s.id === subj.id ? { ...s, duration: e.target.value } : s
                      );
                      setSubjects(updated);
                    }}
                    className="border p-1 rounded w-20"
                    disabled={isSessionMode}
                  />
                ) : (
                  <span>{subj.duration} min</span>
                )}
              </td>
              <td className="py-2 space-x-2">
                {editingId === subj.id ? (
                  <button
                    onClick={() => handleEdit(subj.id, subj.name, subj.duration)}
                    className={`px-3 py-1 rounded text-white ${
                      savingId === subj.id ? "bg-green-500 animate-pulse" : "bg-green-600"
                    }`}
                  >
                    {savingId === subj.id ? "Saved ✅" : "Save"}
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingId(subj.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}