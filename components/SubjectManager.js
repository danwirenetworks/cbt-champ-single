export default function SubjectManager({
  selectedExam,
  subjects,
  subjectInput,
  setSubjectInput,
  subjectDuration,
  setSubjectDuration,
  questionCount,
  setQuestionCount,
  allowGroupShuffle,
  setAllowGroupShuffle,
  addSubject,
  deleteSubject,
  selectedSubject,
  setSelectedSubject,
  loadQuestions,   // ✅ added for question loading
  setSubTab,       // ✅ added for tab switching
}) {
  if (!selectedExam) {
    return (
      <div className="bg-white p-6 rounded shadow text-red-600 font-medium">
        ⚠️ Please select an exam first to manage subjects.
      </div>
    );
  }

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    loadQuestions(subject);     // ✅ load questions for selected subject
    setSubTab("questions");     // ✅ switch to Questions tab
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        📚 Subjects for: <span className="text-blue-600">{selectedExam.name}</span>
      </h2>

      {/* ➕ Add New Subject */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Subject Name</label>
        <input
          className="border p-2 rounded w-full"
          value={subjectInput}
          onChange={(e) => setSubjectInput(e.target.value)}
          placeholder="Enter subject name"
        />

        <label className="block text-sm font-medium mt-2">Duration (minutes)</label>
        <input
          type="number"
          className="border p-2 rounded w-full"
          value={subjectDuration}
          onChange={(e) => setSubjectDuration(e.target.value)}
          placeholder="e.g. 45"
        />

        <label className="block text-sm font-medium mt-2">Question Count</label>
        <input
          type="number"
          className="border p-2 rounded w-full"
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
          placeholder="e.g. 20"
        />

        <label className="inline-flex items-center mt-2">
          <input
            type="checkbox"
            checked={allowGroupShuffle}
            onChange={(e) => setAllowGroupShuffle(e.target.checked)}
            className="mr-2"
          />
          Allow Group Shuffle
        </label>

        <button
          onClick={addSubject}
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ➕ Add Subject
        </button>
      </div>

      {/* 📋 Subject List */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Available Subjects</h3>
        <ul className="space-y-2 max-h-72 overflow-auto">
          {subjects.map((subj) => (
            <li
              key={subj.id}
              className={`border rounded p-3 flex justify-between items-center cursor-pointer ${
                selectedSubject?.id === subj.id ? "bg-blue-100" : "bg-gray-50 hover:bg-gray-100"
              }`}
              onClick={() => handleSubjectClick(subj)} // ✅ updated
            >
              <div>
                <p className="font-medium">{subj.name}</p>
                <p className="text-sm text-gray-600">
                  Duration: {subj.duration} min | Questions: {subj.questionCount} | Group Shuffle:{" "}
                  {subj.allowGroupShuffle ? "✓" : "✗"}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSubject(subj.id);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
