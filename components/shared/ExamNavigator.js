"use client";

import { useEffect } from "react";

export default function ExamNavigator({
  currentIndex,
  totalQuestions,
  answers,
  questionIds,
  markedForReview = {},
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

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [
    onNext,
    onPrev,
    onSubmitInit,
    onSubmitCancel,
    onSubmitConfirm,
    onSelectOption,
  ]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md p-4 space-y-3 z-50">
      {/* 🔄 Navigation Buttons */}
      <div className="flex justify-between">
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

      {/* 🔢 Question Grid */}
      <div className="flex flex-wrap gap-2 justify-center">
        {questionIds.map((qid, i) => {
          const isAnswered = answers[qid];
          const isMarked = markedForReview[qid];
          const isActive = i === currentIndex;

          let bgColor = "bg-gray-200 hover:bg-gray-300 text-black";
          if (isMarked) bgColor = "bg-yellow-400 text-white";
          if (isAnswered) bgColor = "bg-green-500 text-white";
          if (isActive) bgColor = "bg-blue-600 text-white";

          return (
            <button
              key={qid}
              onClick={() => onJump(i)}
              className={`w-10 h-10 flex items-center justify-center rounded font-semibold border ${bgColor}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
