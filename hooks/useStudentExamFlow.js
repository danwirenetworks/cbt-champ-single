import { useEffect, useState } from "react";

export function useStudentExamFlow(studentId = 1) {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [sessionConfig, setSessionConfig] = useState(null);
  const [reviewData, setReviewData] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await window.electronAPI.get_exams();
      setExams(data);
    })();
  }, []);

  const loadSubjects = async (exam) => {
    setSelectedExam(exam);
    const subj = await window.electronAPI.get_subjects(exam.id);
    setSubjects(subj);
  };

  const startSingle = async (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;

    const duration = parseInt(subject.duration, 10);
    if (isNaN(duration) || duration <= 0) {
      alert(`⚠️ Invalid duration for subject: ${subject.name}`);
      return;
    }

    const questions = await window.electronAPI.get_questions(subjectId);
    setSessionConfig({
      mode: "single",
      examId: selectedExam.id,
      studentId,
      subjects: [subject],
      questionsBySubject: { [subjectId]: questions },
      examDuration: duration,
    });
  };

  const startSession = async (subjectIds) => {
    const subjectObjects = subjects.filter((s) => subjectIds.includes(s.id));
    const questionMap = {};
    let totalTime = 0;

    for (const subj of subjectObjects) {
      const questions = await window.electronAPI.get_questions(subj.id);
      questionMap[subj.id] = questions;

      const duration = parseInt(subj.duration, 10);
      if (!isNaN(duration) && duration > 0) {
        totalTime += duration;
      } else {
        console.warn(`⚠️ Skipping subject with invalid duration: ${subj.name}`);
      }
    }

    if (totalTime === 0) {
      alert("⚠️ Invalid total time. Please check subject durations.");
      return;
    }

    setSessionConfig({
      mode: "session",
      examId: selectedExam.id,
      studentId,
      subjects: subjectObjects,
      questionsBySubject: questionMap,
      examDuration: selectedExam.duration || totalTime,
    });
  };

  const handleSubmit = (answers) => {
    alert("✅ Exam submitted!");
    localStorage.removeItem("cbt_answers");
    setReviewData({
      subjects: sessionConfig.subjects,
      questionsBySubject: sessionConfig.questionsBySubject,
      answers,
    });
    setSessionConfig(null);
  };

  return {
    exams,
    subjects,
    selectedExam,
    sessionConfig,
    reviewData,
    loadSubjects,
    startSingle,
    startSession,
    handleSubmit,
  };
}
