import React from "react";

export default function QuestionPanel({
  selectedSubject,
  questions,
  questionInput,
  setQuestionInput,
  options,
  setOptions,
  correctOption,
  setCorrectOption,
  groupId,
  setGroupId,
  groupOrder,
  setGroupOrder,
  addQuestion,
}) {
  if (!selectedSubject) {
    return <p className="text-gray-500">Select a subject to add questions.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Questions for: {selectedSubject.name}
      </h2>

      {/* Add Question Form */}
      <div className="space-y-2">
        <input
          className="border p-2 rounded w-full"
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          placeholder="Enter question text"
        />

        {/* Options */}
        {["a", "b", "c", "d"].map((key) => (
          <input
            key={key}
            className="border p-2 rounded w-full"
            value={options[key]}
            onChange={(e) =>
              setOptions({ ...options, [key]: e.target.value })
            }
            placeholder={`Option ${key.toUpperCase()}`}
          />
        ))}

        {/* Correct Option */}
        <select
          className="border p-2 rounded w-full"
          value={correctOption}
          onChange={(e) => setCorrectOption(e.target.value)}
        >
          <option value="">Select correct option</option>
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
          <option value="d">D</option>
        </select>

        {/* Group ID and Order (optional) */}
        <input
          className="border p-2 rounded w-full"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          placeholder="Group ID (optional)"
        />
        <input
          type="number"
          className="border p-2 rounded w-full"
          value={groupOrder}
          onChange={(e) => setGroupOrder(e.target.value)}
          placeholder="Group Order (optional)"
        />

        <button
          onClick={addQuestion}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Add Question
        </button>
      </div>

      {/* Existing Questions */}
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-700">Existing Questions</h3>
        {questions.length === 0 ? (
          <p className="text-gray-500">No questions yet.</p>
        ) : (
          <ul className="space-y-2">
            {questions.map((q) => (
              <li key={q.id} className="border p-2 rounded bg-gray-50">
                <strong>{q.question}</strong>
                <div className="text-sm text-gray-600">
                  A: {q.optionA} | B: {q.optionB} | C: {q.optionC} | D: {q.optionD}
                </div>
                <div className="text-sm text-green-600">
                  ✅ Correct: {q.correctOption.toUpperCase()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
