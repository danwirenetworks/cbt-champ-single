export default function QuestionPanel({
  question,
  answer,
  onAnswer,
  marked,
  onToggleReview,
}) {
  const options = ["a", "b", "c", "d"];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">
        {question.text}
      </h2>

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onAnswer(opt)} // ✅ this must fire correctly
            className={`block w-full p-2 border rounded text-left ${
              answer === opt ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            <span className="font-bold mr-2">{opt.toUpperCase()}.</span>
            {question[`option_${opt}`]}
          </button>
        ))}
      </div>

      {/* Mark for Review */}
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
