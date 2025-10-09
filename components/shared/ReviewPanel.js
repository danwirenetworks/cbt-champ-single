export default function ReviewPanel({ answers, unansweredCount, markedCount, onConfirm, onCancel }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🧐 Final Review</h2>
      <ul className="space-y-2">
        {Object.entries(answers).map(([qid, response]) => (
          <li key={qid}>
            <strong>Q{qid}:</strong> {response}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-gray-600">Unanswered: {unansweredCount}</p>
      <p className="text-sm text-yellow-600">Marked for Review: {markedCount}</p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={onConfirm}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ✅ Confirm Submit
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
