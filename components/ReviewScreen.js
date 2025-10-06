"use client";
import { useEffect } from "react";

export default function ReviewScreen({
  subjects,
  questionsBySubject,
  answers,
  candidateName = "Candidate",
}) {
  // 🧮 Score Calculation
  let totalQuestions = 0;
  let correctCount = 0;

  subjects.forEach((subj) => {
    const questions = questionsBySubject[subj.id] || [];
    totalQuestions += questions.length;
    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (userAnswer && userAnswer === q.correctOption) {
        correctCount += 1;
      }
    });
  });

  const failedCount = totalQuestions - correctCount;
  const scorePercent = ((correctCount / totalQuestions) * 100).toFixed(2);
  const failPercent = ((failedCount / totalQuestions) * 100).toFixed(2);

  // 🖨 Auto-scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen text-gray-800">
      {/* 🧾 Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Exam Report Sheet</h1>
          <p className="text-sm text-gray-600">
            Name: <span className="font-semibold">{candidateName}</span>
          </p>
          <p className="text-sm text-gray-600">
            Date: {new Date().toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print Report
        </button>
      </div>

      {/* 📊 Summary */}
      <div className="mb-6 grid grid-cols-2 gap-4 text-lg">
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="font-semibold">✅ Correct Answers:</p>
          <p>
            {correctCount} out of {totalQuestions}
          </p>
          <p>{scorePercent}%</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="font-semibold">❌ Incorrect Answers:</p>
          <p>
            {failedCount} out of {totalQuestions}
          </p>
          <p>{failPercent}%</p>
        </div>
      </div>

      {/* 📋 Detailed Review */}
      {subjects.map((subj) => (
        <div key={subj.id} className="mb-8">
          <h2 className="text-xl font-bold mb-2">{subj.name}</h2>
          {questionsBySubject[subj.id].map((q, i) => {
            const userAnswer = answers[q.id];
            const correctAnswer = q.correctOption;
            const isCorrect = userAnswer === correctAnswer;

            return (
              <div key={q.id} className="mb-3 p-4 border rounded bg-gray-50">
                <p className="font-medium mb-1">
                  Q{i + 1}: {q.question}
                </p>
                <p>
                  Your answer:{" "}
                  <span className="font-semibold">
                    {userAnswer || "Not answered"}
                  </span>
                </p>
                <p>
                  Correct answer:{" "}
                  <span className="font-semibold">{correctAnswer}</span>
                </p>
                <p className={isCorrect ? "text-green-600" : "text-red-600"}>
                  {isCorrect ? "✅ Correct" : "❌ Incorrect"}
                </p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}