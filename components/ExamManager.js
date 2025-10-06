export default function ExamManager({
  exams,
  examInput,
  setExamInput,
  examDuration,
  setExamDuration,
  addExam,
  updateDuration,
  updateTimingMode,
  deleteExam,
  loadSubjects,
}) {
  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">Exams</h2>

      {/* ➕ Add New Exam */}
      <div className="flex flex-col md:flex-row gap-2">
        <input
          className="border p-2 rounded flex-1"
          value={examInput}
          onChange={(e) => setExamInput(e.target.value)}
          placeholder="New exam"
        />
        
        <button
          onClick={addExam}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Exam
        </button>
      </div>

      {/* 📋 Exam List */}
      <ul className="space-y-2 max-h-64 overflow-auto">
        {exams.map((exam) => (
          <li
            key={exam.id}
            className="flex flex-col md:flex-row md:items-center justify-between border p-2 rounded gap-2"
          >
            <div
              className="flex-1 cursor-pointer font-medium"
              onClick={() => loadSubjects(exam)}
            >
              {exam.name}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2">
              {/* ⏱ Timing Mode Toggle */}
              <select
                value={exam.timingMode || "per-subject"}
                onChange={(e) => updateTimingMode(exam.id, e.target.value)}
                className="border p-1 rounded text-sm"
              >
                <option value="per-subject">Per Subject</option>
                <option value="session">Session</option>
              </select>

              {/* ⏱ Session Duration Input */}
              {exam.timingMode === "session" && (
                <input
                  type="number"
                  className="w-20 border p-1 rounded text-center"
                  defaultValue={exam.duration || ""}
                  onBlur={(e) => updateDuration(exam.id, e.target.value || null)}
                  placeholder="Mins"
                />
              )}

              {/* 🗑 Delete Button */}
              <button
                onClick={() => deleteExam(exam.id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}