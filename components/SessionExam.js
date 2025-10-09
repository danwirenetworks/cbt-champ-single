"use client";

import { useEffect } from "react";
import CountdownTimer from "./shared/CountdownTimer";
import ExamNavigator from "./shared/ExamNavigator";
import { useExamSession } from "/hooks/useExamSession";
import ExamQuestionPanel from "./ExamQuestionPanel";
import ReviewPanel from "./shared/ReviewPanel";

export default function SessionExam(props) {
  const {
    activeSubjectId,
    setActiveSubjectId,
    currentIndex,
    setCurrentIndex,
    answers,
    markedForReview,
    currentQuestion,
    activeQuestions,
    showReview,
    setShowReview,
    handleAnswer,
    handleAnswerByKey,
    toggleMarkReview,
    handleNext,
    handlePrev,
    jumpToQuestion,
    submitAnswers,
    unansweredCount,
    markedCount,
  } = useExamSession(props);

  const { subjects, examDuration } = props;

  // ✅ Global keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toUpperCase();

      if (showReview) {
        if (key === "R") setShowReview(false);
        if (key === "Y") submitAnswers();
      } else {
        if (key === "N") handleNext();
        if (key === "P") handlePrev();
        if (key === "S") setShowReview(true);
        if (["A", "B", "C", "D"].includes(key)) {
          handleAnswerByKey(key.toLowerCase());
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showReview, handleNext, handlePrev, handleAnswerByKey, submitAnswers]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ⏳ Top Bar */}
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

      {/* ❓ Question or Review */}
      {showReview ? (
        <ReviewPanel
          answers={answers}
          unansweredCount={unansweredCount}
          markedCount={markedCount}
          onConfirm={submitAnswers}
          onCancel={() => setShowReview(false)}
        />
      ) : (
        currentQuestion && (
          <ExamQuestionPanel
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            onAnswer={(opt) => handleAnswer(currentQuestion.id, opt)}
            marked={markedForReview[currentQuestion.id]}
            onToggleReview={() => toggleMarkReview(currentQuestion.id)}
          />
        )
      )}

      {/* 🧭 Navigator */}
      {!showReview && (
        <ExamNavigator
          currentIndex={currentIndex}
          totalQuestions={activeQuestions.length}
          questionIds={activeQuestions.map((q) => q.id)}
          answers={answers}
          markedForReview={markedForReview}
          onNext={handleNext}
          onPrev={handlePrev}
          onJump={jumpToQuestion}
          onSubmitInit={() => setShowReview(true)}
          onSubmitCancel={() => setShowReview(false)}
          onSubmitConfirm={submitAnswers}
          onSelectOption={handleAnswerByKey}
        />
      )}
      
    </div>
    
  );
}
