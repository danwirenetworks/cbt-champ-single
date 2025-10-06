"use client";
import { useEffect } from "react";

export default function ExamNavigator({
  currentIndex,
  totalQuestions,
  answers,
  questionIds,
  onNext,
  onPrev,
  onJump,
  onSubmitInit,
  onSubmitCancel,
  onSubmitConfirm,
  onSelectOption,
}) {
  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toUpperCase();

      switch (key) {
        case "N":
          onNext?.();
          break;
        case "P":
          onPrev?.();
          break;
        case "S":
          onSubmitInit?.();
          break;
        case "R":
          onSubmitCancel?.();
          break;
        case "Y":
          onSubmitConfirm?.();
          break;
        case "A":
        case "B":
        case "C":
        case "D":
          onSelectOption?.(key.toLowerCase());
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    onNext,
    onPrev,
    onSubmitInit,
    onSubmitCancel,
    onSubmitConfirm,
    onSelectOption,
  ]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md p-2 flex flex-col">
      {/* Navigation Buttons */}
      <div className="flex justify-between mb-2">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev (P)
        </button>
        <button
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next (N)
        </button>
      </div>

      {/* Question Grid */}
      <div className="flex flex-wrap gap-2 justify-center">
        {questionIds.map((qid, i) => {
          const isAnswered = answers[qid];
          const isActive = i === currentIndex;

          return (
            <button
              key={qid}
              onClick={() => onJump(i)}
              className={`w-10 h-10 flex items-center justify-center rounded font-semibold border ${
                isActive
                  ? "bg-blue-600 text-white"
                  : isAnswered
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}