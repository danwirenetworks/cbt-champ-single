export default function QuestionManager({
  selectedExam,
  selectedSubject,
  questions,
  questionText,
  setQuestionText,
  options,
  setOptions,
  correctOption,
  setCorrectOption,
  groupId,
  setGroupId,
  groupOrder,
  setGroupOrder,
  addQuestion,
  deleteQuestion,
}) {
  if (!selectedSubject || !selectedExam) {
    return (
      <div className="bg-white p-6 rounded shadow text-red-600 font-medium">
        ⚠️ Please select an exam and subject to manage questions.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        ❓ Questions for: <span className="text-blue-600">{selectedSubject.name}</span>
      </h2>

      {/* ➕ Add New Question */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Question Text</label>
        <textarea
          className="border p-2 rounded w-full"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter question here"
        />

        {["A", "B", "C", "D"].map((opt) => (
          <div key={opt}>
            <label className="block text-sm font-medium">Option {opt}</label>
            <input
              className="border p-2 rounded w-full"
              value={options[opt]}
              onChange={(e) => setOptions({ ...options, [opt]: e.target.value })}
              placeholder={`Enter option ${opt}`}
            />
          </div>
        ))}

        <label className="block text-sm font-medium mt-2">Correct Option</label>
        <select
          value={correctOption}
          onChange={(e) => setCorrectOption(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select correct option</option>
          {["A", "B", "C", "D"].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium">Group ID (optional)</label>
            <input
              className="border p-2 rounded w-full"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="e.g. MathBasics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Group Order (optional)</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={groupOrder}
              onChange={(e) => setGroupOrder(e.target.value)}
              placeholder="e.g. 1"
            />
          </div>
        </div>

        <button
          onClick={addQuestion}
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ➕ Add Question
        </button>
      </div>

      {/* 📋 Question List */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Available Questions</h3>
        <ul className="space-y-2 max-h-72 overflow-auto">
          {questions.map((q) => (
            <li
              key={q.id}
              className="border rounded p-3 bg-gray-50 hover:bg-gray-100 space-y-1"
            >
              <p className="font-medium">
                Q{q.groupOrder || "?"}: {q.question}
              </p>
              <ul className="text-sm text-gray-700">
                {["A", "B", "C", "D"].map((opt) => (
                  <li key={opt}>
                    {opt}. {q[`option${opt}`]}
                    {q.correctOption === opt && (
                      <span className="text-green-600 font-bold ml-2">✓</span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500">
                Group: {q.groupId || "—"} | Order: {q.groupOrder || "—"}
              </p>
              <button
                onClick={() => deleteQuestion(q.id)}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
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
