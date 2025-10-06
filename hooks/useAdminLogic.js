import { useEffect, useState } from "react";

export function useAdminLogic() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [examInput, setExamInput] = useState("");
  const [examDuration, setExamDuration] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [options, setOptions] = useState({ a: "", b: "", c: "", d: "" });
  const [correctOption, setCorrectOption] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateExamNo, setCandidateExamNo] = useState("");

  useEffect(() => {
    loadExams();
    loadCandidates();
  }, []);

  const loadExams = async () => {
    const data = await window.electronAPI.get_exams();
    setExams(data);
  };

  const loadSubjects = async (exam) => {
    setSelectedExam(exam);
    const data = await window.electronAPI.get_subjects(exam.id);
    setSubjects(data);
    setSelectedSubject(null);
    setQuestions([]);
  };

  const loadQuestions = async (subject) => {
    setSelectedSubject(subject);
    const data = await window.electronAPI.get_questions(subject.id);
    setQuestions(data);
  };

  const loadCandidates = async () => {
    const data = await window.electronAPI.get_candidates();
    setCandidates(data);
  };

  const addExam = async () => {
    if (!examInput.trim()) return;
    const newExam = await window.electronAPI.add_exam(examInput);
    if (newExam?.lastInsertRowid && examDuration) {
      await window.electronAPI.set_exam_duration({
        id: newExam.lastInsertRowid,
        duration: examDuration,
      });
    }
    setExamInput("");
    setExamDuration("");
    loadExams();
  };

  const updateDuration = async (examId, duration) => {
    await window.electronAPI.set_exam_duration({ id: examId, duration });
    loadExams();
  };

  const updateTimingMode = async (examId, mode) => {
    await window.electronAPI.set_exam_timing_mode({ id: examId, mode });
    loadExams();
  };

  const deleteExam = async (id) => {
    await window.electronAPI.delete_exam(id);
    loadExams();
  };

  const addSubject = async () => {
    if (!subjectInput.trim() || !selectedExam) return;
    await window.electronAPI.add_subject({
      exam_id: selectedExam.id,
      name: subjectInput,
    });
    setSubjectInput("");
    loadSubjects(selectedExam);
  };

  const deleteSubject = async (id) => {
    await window.electronAPI.delete_subject(id);
    loadSubjects(selectedExam);
  };

  const addQuestion = async () => {
    if (
      !questionInput.trim() ||
      !selectedSubject ||
      !correctOption ||
      Object.values(options).some((v) => !v.trim())
    )
      return;
    await window.electronAPI.add_question({
      subject_id: selectedSubject.id,
      question: questionInput,
      option_a: options.a,
      option_b: options.b,
      option_c: options.c,
      option_d: options.d,
      correct_option: correctOption,
    });
    setQuestionInput("");
    setOptions({ a: "", b: "", c: "", d: "" });
    setCorrectOption("");
    loadQuestions(selectedSubject);
  };

  const deleteQuestion = async (id) => {
    await window.electronAPI.delete_question(id);
    loadQuestions(selectedSubject);
  };

  const addCandidate = async () => {
    if (!candidateName.trim() || !candidateExamNo.trim()) return;
    await window.electronAPI.add_candidate({
      name: candidateName,
      exam_no: candidateExamNo,
    });
    setCandidateName("");
    setCandidateExamNo("");
    loadCandidates();
  };

  const deleteCandidate = async (id) => {
    await window.electronAPI.delete_candidate(id);
    loadCandidates();
  };

  return {
    activeTab,
    setActiveTab,
    exams,
    subjects,
    questions,
    candidates,
    selectedExam,
    setSelectedExam,
    selectedSubject,
    setSelectedSubject,
    examInput,
    setExamInput,
    examDuration,
    setExamDuration,
    subjectInput,
    setSubjectInput,
    questionInput,
    setQuestionInput,
    options,
    setOptions,
    correctOption,
    setCorrectOption,
    candidateName,
    setCandidateName,
    candidateExamNo,
    setCandidateExamNo,
    addExam,
    updateDuration,
    updateTimingMode,
    deleteExam,
    addSubject,
    deleteSubject,
    loadSubjects,
    loadQuestions,
    addQuestion,
    deleteQuestion,
    addCandidate,
    deleteCandidate,
  };
}