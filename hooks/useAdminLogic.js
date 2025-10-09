import { useEffect, useState } from "react";

export function useAdminLogic() {
  // 🔧 UI State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [errorMessage, setErrorMessage] = useState(null);

  // 📦 Data
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [candidates, setCandidates] = useState([]);

  // 🎯 Selection
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // ✍️ Inputs
  const [examInput, setExamInput] = useState("");
  const [examDuration, setExamDuration] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [subjectDuration, setSubjectDuration] = useState(30);
  const [questionInput, setQuestionInput] = useState("");
  const [options, setOptions] = useState({ a: "", b: "", c: "", d: "" });
  const [correctOption, setCorrectOption] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupOrder, setGroupOrder] = useState("");
  const [questionCount, setQuestionCount] = useState(50);
  const [allowGroupShuffle, setAllowGroupShuffle] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [candidateExamNo, setCandidateExamNo] = useState("");

  // 🚀 Initial Load
  useEffect(() => {
    loadExams();
    loadCandidates();
  }, []);

  // 📥 Loaders
  const loadExams = async () => {
    try {
      const data = await window.electronAPI.get_exams();
      setExams(Array.isArray(data) ? data : []);
      setErrorMessage(null);
    } catch (err) {
      console.error("❌ Failed to load exams:", err);
      setExams([]);
      setErrorMessage("Failed to load exams.");
    }
  };

  const loadSubjects = async (exam) => {
    try {
      setSelectedExam(exam);
      const data = await window.electronAPI.get_subjects(exam.id);
      setSubjects(Array.isArray(data) ? data : []);
      setSelectedSubject(null);
      setQuestions([]);
      setErrorMessage(null);
    } catch (err) {
      console.error("❌ Failed to load subjects:", err);
      setSubjects([]);
      setErrorMessage("Failed to load subjects.");
    }
  };

  const loadQuestions = async (subject) => {
    try {
      setSelectedSubject(subject);
      const data = await window.electronAPI.get_questions(subject.id);
      setQuestions(Array.isArray(data) ? data : []);
      setErrorMessage(null);
    } catch (err) {
      console.error("❌ Failed to load questions:", err);
      setQuestions([]);
      setErrorMessage("Failed to load questions.");
    }
  };

  const loadCandidates = async () => {
    try {
      const data = await window.electronAPI.get_candidates();
      setCandidates(Array.isArray(data) ? data : []);
      setErrorMessage(null);
    } catch (err) {
      console.error("❌ Failed to load candidates:", err);
      setCandidates([]);
      setErrorMessage("Failed to load candidates.");
    }
  };

  // 🧪 Exam Actions
  const addExam = async () => {
    if (!examInput.trim()) return;
    try {
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
    } catch (err) {
      console.error("❌ Failed to add exam:", err);
      setErrorMessage("Failed to add exam.");
    }
  };

  const updateDuration = async (examId, duration) => {
    try {
      await window.electronAPI.set_exam_duration({ id: examId, duration });
      loadExams();
    } catch (err) {
      console.error("❌ Failed to update duration:", err);
      setErrorMessage("Failed to update duration.");
    }
  };

  const updateTimingMode = async (examId, mode) => {
    try {
      await window.electronAPI.set_exam_timing_mode({ id: examId, mode });
      loadExams();
    } catch (err) {
      console.error("❌ Failed to update timing mode:", err);
      setErrorMessage("Failed to update timing mode.");
    }
  };

  const updateShuffleMode = async (examId, mode) => {
    try {
      await window.electronAPI.set_exam_shuffle_mode({ id: examId, mode });
      loadExams();
    } catch (err) {
      console.error("❌ Failed to update shuffle mode:", err);
      setErrorMessage("Failed to update shuffle mode.");
    }
  };

  const deleteExam = async (id) => {
    try {
      await window.electronAPI.delete_exam(id);
      loadExams();
    } catch (err) {
      console.error("❌ Failed to delete exam:", err);
      setErrorMessage("Failed to delete exam.");
    }
  };

  // 📚 Subject Actions
  const addSubject = async () => {
    if (!subjectInput.trim() || !selectedExam) return;
    try {
      await window.electronAPI.add_subject({
        exam_id: selectedExam.id,
        name: subjectInput,
        duration: subjectDuration,
        questionCount,
        allowGroupShuffle,
      });
      setSubjectInput("");
      loadSubjects(selectedExam);
    } catch (err) {
      console.error("❌ Failed to add subject:", err);
      setErrorMessage("Failed to add subject.");
    }
  };

  const deleteSubject = async (id) => {
    try {
      await window.electronAPI.delete_subject(id);
      loadSubjects(selectedExam);
    } catch (err) {
      console.error("❌ Failed to delete subject:", err);
      setErrorMessage("Failed to delete subject.");
    }
  };

  // ❓ Question Actions
  const addQuestion = async () => {
    if (
      !questionInput.trim() ||
      !selectedSubject ||
      !correctOption ||
      Object.values(options).some((v) => !v.trim())
    )
      return;

    try {
      await window.electronAPI.add_question({
        subject_id: selectedSubject.id,
        question: questionInput,
        option_a: options.a,
        option_b: options.b,
        option_c: options.c,
        option_d: options.d,
        correct_option: correctOption,
        group_id: groupId || null,
        group_order: groupOrder || null,
      });

      setQuestionInput("");
      setOptions({ a: "", b: "", c: "", d: "" });
      setCorrectOption("");
      setGroupId("");
      setGroupOrder("");
      loadQuestions(selectedSubject);
    } catch (err) {
      console.error("❌ Failed to add question:", err);
      setErrorMessage("Failed to add question.");
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await window.electronAPI.delete_question(id);
      loadQuestions(selectedSubject);
    } catch (err) {
      console.error("❌ Failed to delete question:", err);
      setErrorMessage("Failed to delete question.");
    }
  };

  // 👤 Candidate Actions
  const addCandidate = async () => {
    if (!candidateName.trim() || !candidateExamNo.trim()) return;
    try {
      await window.electronAPI.add_candidate({
        name: candidateName,
        schoolNo: candidateExamNo,
      });
      setCandidateName("");
      setCandidateExamNo("");
      loadCandidates();
    } catch (err) {
      console.error("❌ Failed to add candidate:", err);
      setErrorMessage("Failed to add candidate.");
    }
  };

  const deleteCandidate = async (id) => {
    try {
      await window.electronAPI.delete_candidate(id);
      loadCandidates();
    } catch (err) {
      console.error("❌ Failed to delete candidate:", err);
      setErrorMessage("Failed to delete candidate.");
    }
  };

  // 🧠 Return all logic
    return {
    // UI
    activeTab,
    setActiveTab,
    errorMessage,

    // Data
    exams,
    subjects,
    questions,
    candidates,

    // Selection
    selectedExam,
    setSelectedExam,
    selectedSubject,
    setSelectedSubject,

    // Inputs
    examInput,
    setExamInput,
    examDuration,
    setExamDuration,
    subjectInput,
    setSubjectInput,
    subjectDuration,
    setSubjectDuration,
    questionInput,
    setQuestionInput,
    options,
    setOptions,
    correctOption,
    setCorrectOption,
    groupId,
    setGroupId,
    groupOrder,
    setGroupOrder,
    questionCount,
    setQuestionCount,
    allowGroupShuffle,
    setAllowGroupShuffle,
    candidateName,
    setCandidateName,
    candidateExamNo,
    setCandidateExamNo,

    // Loaders
    loadExams,
    loadSubjects,
    loadQuestions,
    loadCandidates,

    // Actions
    addExam,
    updateDuration,
    updateTimingMode,
    updateShuffleMode,
    deleteExam,
    addSubject,
    deleteSubject,
    addQuestion,
    deleteQuestion,
    addCandidate,
    deleteCandidate,
  };
}
