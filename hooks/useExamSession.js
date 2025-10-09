import { useState, useEffect, useCallback } from "react";

export function useExamSession({ subjects, questionsBySubject, studentId, examId, onSubmit }) {
  const [activeSubjectId, setActiveSubjectId] = useState(subjects[0]?.id || null);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const activeQuestions = questionsBySubject[activeSubjectId] || [];
  const currentQuestion = activeQuestions[currentIndex];

  useEffect(() => {
    const saved = localStorage.getItem("cbt_answers");
    if (saved) setAnswers(JSON.parse(saved));
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

  const handleAnswer = useCallback((qid, option) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  }, []);

  const handleAnswerByKey = useCallback((option) => {
    const qid = activeQuestions[currentIndex]?.id;
    if (qid) {
      handleAnswer(qid, option);
    }
  }, [activeQuestions, currentIndex, handleAnswer]);

  const toggleMarkReview = useCallback((qid) => {
    setMarkedForReview((prev) => ({ ...prev, [qid]: !prev[qid] }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, activeQuestions]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const jumpToQuestion = useCallback((index) => {
    if (index >= 0 && index < activeQuestions.length) {
      setCurrentIndex(index);
    }
  }, [activeQuestions]);

  const submitAnswers = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    localStorage.removeItem("cbt_answers");
    onSubmit(answers);
  }, [answers, submitted, onSubmit]);

  const unansweredCount = Object.keys(questionsBySubject)
    .flatMap((sid) => questionsBySubject[sid])
    .filter((q) => !answers[q.id]).length;

  const markedCount = Object.values(markedForReview).filter(Boolean).length;

  return {
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
    handleAnswerByKey, // ✅ return this
    toggleMarkReview,
    handleNext,
    handlePrev,
    jumpToQuestion,
    submitAnswers,
    unansweredCount,
    markedCount,
  };
}
