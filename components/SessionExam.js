"use client";
import { useState, useEffect } from "react";
import CountdownTimer from "./shared/CountdownTimer";
import ExamNavigator from "./shared/ExamNavigator";

export default function SessionExam({
  subjects,
  questionsBySubject,
  examDuration,
  onSubmit,
  studentId,
  examId,
}) {
  const [activeSubjectId, setActiveSubjectId] = useState(subjects[0].id);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const activeQuestions = questionsBySubject[activeSubjectId] || [];
  const currentQuestion = activeQuestions[currentIndex];

  useEffect(() => {
    const saved = localStorage.getItem("cbt_answers");
    if (saved) {
      setAnswers(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cbt_answers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    const interval = setInterval(() => {
      window.electronAPI.save_answers_bulk({
        student_id: studentId,
        exam_id: examId,
        answers: Object.entries(answers).map(([qid, selected_option]) => ({
          question_id: parseInt(qid),
          selected_option,
        })),
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [answers, studentId, examId]);

  const handleSelectOption = (key) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: key.toUpperCase(),
    }));
  };

  const handleAnswer = (qid, option) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const toggleMarkReview = (qid) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [qid]: !prev[qid],
    }));
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const jumpToQuestion = (index) => {
    if (index >= 0 && index < activeQuestions.length) {
      setCurrentIndex(index);
    }
  };

  const openSubmitModal = () => {
    setShowReview(true);
  };

  const closeSubmitModal = () => {
    alert("Submission cancelled.");
    setShowReview(false);
  };

  const submitAnswers = () => {
    if (submitted) return;
    setSubmitted(true);
    localStorage.removeItem("cbt_answers");
    onSubmit(answers);
  };

  const unansweredCount = Object.keys(questionsBySubject)
    .flatMap((sid) => questionsBySubject[sid])
    .filter((q) => !answers[q.id]).length;

  const markedCount = Object.values(markedForReview).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ⏳ Top Bar: Timer + Submit Button */}
<div className="bg-white p-4 shadow sticky top-0 z-10 flex justify-between items-center">
  <CountdownTimer
    durationMinutes={examDuration}
    onTimeout={() => setShowReview(true)}
  />
  <button
    onClick={() => setShowReview(true)}
    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
  >
    Submit Exam
  </button>
</div>

      {/* 📚 Subject Tabs */}
      <div className="flex gap-2 bg-white p-2 shadow">
        {subjects.map((subj) => (
          <button
            key={subj.id}
            onClick={() => {
              setActiveSubjectId(subj.id);
              setCurrentIndex(0);
            }}
            className={`px-4 py-2 rounded ${
              subj.id === activeSubjectId
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {subj.name}
          </button>
        ))}
      </div>

      {/* ❓ Question Area or Review */}
      {showReview ? (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">🧐 Final Review</h2>
          <ul className="space-y-2">
            {Object.entries(answers).map(([qid, response]) => (
              <li key={qid}>
                <strong>Q{qid}:</strong> {response}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            Unanswered: {unansweredCount}
          </p>
          <p className="text-sm text-yellow-600">
            Marked for Review: {markedCount}
          </p>
          <button
            onClick={submitAnswers}
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
          >
            ✅ Confirm Submit
          </button>
        </div>
      ) : (
        currentQuestion && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">
              Q{currentIndex + 1}. {currentQuestion.question}
            </h2>
            {["A", "B", "C", "D"].map((opt) => (
              <label
                key={opt}
                className={`block border rounded p-3 mb-2 cursor-pointer ${
                  answers[currentQuestion.id] === opt
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${currentQuestion.id}`}
                  className="mr-2"
                  value={opt}
                  checked={answers[currentQuestion.id] === opt}
                  onChange={() => handleAnswer(currentQuestion.id, opt)}
                />
                {opt}. {currentQuestion[`option${opt}`]}
              </label>
            ))}
            <button
              onClick={() => toggleMarkReview(currentQuestion.id)}
              className={`mt-2 px-3 py-1 rounded text-sm ${
                markedForReview[currentQuestion.id]
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {markedForReview[currentQuestion.id]
                ? "Unmark Review"
                : "Mark for Review"}
            </button>
          </div>
        )
      )}

      {/* 🧭 Navigator */}
      {!showReview && (
        <ExamNavigator
          currentIndex={currentIndex}
          totalQuestions={activeQuestions.length}
          questionIds={activeQuestions.map((q) => q.id)}
          answers={answers}
          onNext={handleNext}
          onPrev={handlePrev}
          onJump={jumpToQuestion}
          onSubmitInit={openSubmitModal}
          onSubmitCancel={closeSubmitModal}
          onSubmitConfirm={submitAnswers}
          onSelectOption={handleSelectOption}
        />
      )}
    </div>
  );
}