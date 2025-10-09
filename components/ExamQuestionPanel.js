export default function ExamQuestionPanel({
  question,
  answer,
  onAnswer,
  marked,
  onToggleReview,
}) {
  return (
    <div className="p-4 space-y-4">
      {/* ✅ Question Text */}
      <h2 className="text-lg font-semibold text-gray-800">
        {question?.question || "⚠️ Question text missing"}
      </h2>

      {/* ✅ Options */}
      <div className="space-y-2">
        {["A", "B", "C", "D"].map((opt) => {
          const key = `option${opt}`;
          const label = question?.[key];
          return (
            <button
              key={opt}
              onClick={() => onAnswer(opt.toLowerCase())}
              className={`block w-full p-2 border rounded text-left ${
                answer === opt.toLowerCase() ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              <span className="font-bold mr-2">{opt}.</span>
              {label || "⚠️ Option missing"}
            </button>
          );
        })}
      </div>

      {/* ✅ Mark for Review */}
      <button
        onClick={onToggleReview}
        className={`mt-4 px-4 py-2 rounded ${
          marked ? "bg-yellow-500 text-white" : "bg-gray-300"
        }`}
      >
        {marked ? "✓ Marked for Review" : "Mark for Review"}
      </button>
    </div>
  );
}
