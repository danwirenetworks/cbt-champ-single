export default function ExamManager({
  exams,
  examInput,
  setExamInput,
  examDuration,
  setExamDuration,
  addExam,
  updateDuration,
  updateTimingMode,
  updateShuffleMode,
  deleteExam,
  loadSubjects,
  setSubTab, // ✅ added for tab switching
}) {
  const isValidExams = Array.isArray(exams);

  const handleExamClick = (exam) => {
    loadSubjects(exam);
    setSubTab("subjects"); // ✅ auto-switch to Subjects tab
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">📝 Manage Exams</h2>

      {/* ➕ Add New Exam */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Exam Name</label>
        <input
          className="border p-2 rounded w-full"
          value={examInput}
          onChange={(e) => setExamInput(e.target.value)}
          placeholder="Enter new exam name"
        />

        <label className="block text-sm font-medium mt-2">Session Duration (optional)</label>
        <input
          type="number"
          className="border p-2 rounded w-full"
          value={examDuration}
          onChange={(e) => setExamDuration(e.target.value)}
          placeholder="Duration in minutes"
        />

        <button
          onClick={addExam}
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ➕ Add Exam
        </button>
      </div>

      {/* 📋 Exam List */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Available Exams</h3>

        {!isValidExams ? (
          <p className="text-red-500">⚠️ Failed to load exams. Please try again.</p>
        ) : exams.length === 0 ? (
          <p className="text-gray-500">No exams available.</p>
        ) : (
          <ul className="space-y-3 max-h-72 overflow-auto">
            {exams.map((exam) => (
              <li
                key={exam.id}
                className="border rounded p-4 bg-gray-50 hover:bg-gray-100 space-y-3"
              >
                {/* 🧭 Exam Name */}
                <div
                  className="font-medium text-blue-700 cursor-pointer hover:underline"
                  onClick={() => handleExamClick(exam)}
                >
                  {exam.name}
                </div>

                {/* ⚙️ Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* ⏱ Timing Mode */}
                  <div>
                    <label className="text-sm font-medium">Timing Mode</label>
                    <select
                      value={exam.timingMode || "per-subject"}
                      onChange={(e) => updateTimingMode(exam.id, e.target.value)}
                      className="mt-1 border p-2 rounded w-full"
                    >
                      <option value="per-subject">Per Subject</option>
                      <option value="session">Session</option>
                    </select>
                  </div>

                  {/* ⏱ Session Duration */}
                  {exam.timingMode === "session" && (
                    <div>
                      <label className="text-sm font-medium">Session Duration</label>
                      <input
                        type="number"
                        className="mt-1 border p-2 rounded w-full"
                        defaultValue={exam.duration || ""}
                        onBlur={(e) => updateDuration(exam.id, e.target.value || null)}
                        placeholder="Minutes"
                      />
                    </div>
                  )}

                  {/* 🔀 Shuffle Mode */}
                  <div>
                    <label className="text-sm font-medium">Shuffle Mode</label>
                    <select
                      value={exam.shuffleMode || "none"}
                      onChange={(e) => updateShuffleMode(exam.id, e.target.value)}
                      className="mt-1 border p-2 rounded w-full"
                    >
                      <option value="none">No Shuffle</option>
                      <option value="full">Shuffle All Questions</option>
                      <option value="grouped">Shuffle by Group</option>
                    </select>
                  </div>
                </div>

                {/* 🗑 Delete */}
                <div className="text-right">
                  <button
                    onClick={() => deleteExam(exam.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete Exam
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
