"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Editing trackers
  const [editingExam, setEditingExam] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Inputs
  const [examInput, setExamInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [questionForm, setQuestionForm] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
  });

  /* -------------------------
     Lifecycle
  ------------------------- */
  useEffect(() => {
    refreshExams();
  }, []);

  const safeArray = (v) => (Array.isArray(v) ? v : []);

  const refreshExams = async () => {
    try {
      const data = await window.electronAPI.get_exams();
      setExams(safeArray(data));
    } catch (err) {
      console.error("Failed to load exams:", err);
      setExams([]);
    }
  };

  const loadSubjects = async (exam) => {
    setSelectedExam(exam);
    setSelectedSubject(null);
    setQuestions([]);
    try {
      const data = await window.electronAPI.get_subjects(exam.id);
      setSubjects(safeArray(data));
    } catch (err) {
      console.error("Failed to load subjects:", err);
      setSubjects([]);
    }
  };

  const loadQuestions = async (subject) => {
    setSelectedSubject(subject);
    try {
      const data = await window.electronAPI.get_questions(subject.id);
      // Normalize DB keys (optionA vs option_a)
      const normalized = safeArray(data).map((q) => ({
        id: q.id,
        question: q.question,
        option_a: q.option_a ?? q.optionA ?? "",
        option_b: q.option_b ?? q.optionB ?? "",
        option_c: q.option_c ?? q.optionC ?? "",
        option_d: q.option_d ?? q.optionD ?? "",
        correct_option: q.correct_option ?? q.correctOption ?? "A",
      }));
      setQuestions(normalized);
    } catch (err) {
      console.error("Failed to load questions:", err);
      setQuestions([]);
    }
  };

  /* -------------------------
     Exams CRUD
  ------------------------- */
  const addExam = async () => {
    if (!examInput.trim()) return;
    try {
      await window.electronAPI.add_exam(examInput.trim());
      setExamInput("");
      refreshExams();
    } catch (err) {
      console.error("Add exam error:", err);
    }
  };

  const saveExam = async (exam) => {
    if (!examInput.trim()) return;
    try {
      await window.electronAPI.edit_exam({ id: exam.id, name: examInput.trim() });
      setEditingExam(null);
      setExamInput("");
      refreshExams();
    } catch (err) {
      console.error("Save exam error:", err);
    }
  };

  const deleteExam = async (id) => {
    if (!confirm("Delete this exam?")) return;
    try {
      await window.electronAPI.delete_exam(id);
      // clear selection if needed
      if (selectedExam?.id === id) {
        setSelectedExam(null);
        setSubjects([]);
        setSelectedSubject(null);
        setQuestions([]);
      }
      refreshExams();
    } catch (err) {
      console.error("Delete exam error:", err);
    }
  };

  /* -------------------------
     Subjects CRUD
  ------------------------- */
  const addSubject = async () => {
    // FIX: use subjectInput (was newSubject before)
    if (!subjectInput.trim() || !selectedExam) return;
    try {
      // preload/main expects { exam_id, name } in many setups — send exam_id
      await window.electronAPI.add_subject({ exam_id: selectedExam.id, name: subjectInput.trim() });
      setSubjectInput("");
      loadSubjects(selectedExam);
    } catch (err) {
      console.error("Add subject error:", err);
    }
  };

  const saveSubject = async (subj) => {
    if (!subjectInput.trim()) return;
    try {
      await window.electronAPI.edit_subject({ id: subj.id, name: subjectInput.trim() });
      setEditingSubject(null);
      setSubjectInput("");
      loadSubjects(selectedExam);
    } catch (err) {
      console.error("Save subject error:", err);
    }
  };

  const deleteSubject = async (id) => {
    if (!confirm("Delete subject?")) return;
    try {
      await window.electronAPI.delete_subject(id);
      // If current subject removed, clear questions
      if (selectedSubject?.id === id) {
        setSelectedSubject(null);
        setQuestions([]);
      }
      loadSubjects(selectedExam);
    } catch (err) {
      console.error("Delete subject error:", err);
    }
  };

  /* -------------------------
     Questions CRUD
  ------------------------- */
  const addQuestion = async () => {
    if (!selectedSubject) return alert("Pick a subject first.");
    if (!questionForm.question.trim()) return;

    try {
      // main.js expects subject_id & snake_case options in many setups
      await window.electronAPI.add_question({
        subject_id: selectedSubject.id,
        question: questionForm.question.trim(),
        option_a: questionForm.option_a.trim(),
        option_b: questionForm.option_b.trim(),
        option_c: questionForm.option_c.trim(),
        option_d: questionForm.option_d.trim(),
        correct_option: questionForm.correct_option,
      });
      resetQuestionForm();
      loadQuestions(selectedSubject);
    } catch (err) {
      console.error("Add question error:", err);
    }
  };

  const startEditQuestion = (q) => {
    setEditingQuestion(q.id);
    setQuestionForm({
      question: q.question,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option || "A",
    });
  };

  const saveQuestion = async (q) => {
    if (!questionForm.question.trim()) return;
    try {
      await window.electronAPI.edit_question({
        id: q.id,
        question: questionForm.question.trim(),
        option_a: questionForm.option_a.trim(),
        option_b: questionForm.option_b.trim(),
        option_c: questionForm.option_c.trim(),
        option_d: questionForm.option_d.trim(),
        correct_option: questionForm.correct_option,
      });
      setEditingQuestion(null);
      resetQuestionForm();
      loadQuestions(selectedSubject);
    } catch (err) {
      console.error("Save question error:", err);
    }
  };

  const deleteQuestion = async (id) => {
    if (!confirm("Delete question?")) return;
    try {
      await window.electronAPI.delete_question(id);
      loadQuestions(selectedSubject);
    } catch (err) {
      console.error("Delete question error:", err);
    }
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_option: "A",
    });
    setEditingQuestion(null);
  };

  /* -------------------------
     Render
  ------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Console</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Exams */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">Exams</h2>
            <div className="flex gap-2 mb-3">
              <input className="flex-1 border p-2 rounded" value={examInput} onChange={(e) => setExamInput(e.target.value)} placeholder="New exam" />
              <button onClick={addExam} className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add</button>
            </div>

            <ul className="space-y-2 max-h-64 overflow-auto">
              {exams.map((exam) => (
                <li key={exam.id} className="flex justify-between items-center border p-2 rounded">
                  {editingExam === exam.id ? (
                    <div className="flex gap-2 w-full">
                      <input className="flex-1 border p-1 rounded" value={examInput} onChange={(e) => setExamInput(e.target.value)} />
                      <button onClick={() => saveExam(exam)} className="px-2 bg-blue-500 text-white rounded">Save</button>
                      <button onClick={() => setEditingExam(null)} className="px-2 bg-gray-400 text-white rounded">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="cursor-pointer font-medium" onClick={() => loadSubjects(exam)}>{exam.name}</span>
                      <div className="space-x-2">
                        <button onClick={() => { setEditingExam(exam.id); setExamInput(exam.name); }} className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                        <button onClick={() => deleteExam(exam.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">Subjects {selectedExam ? `for ${selectedExam.name}` : ""}</h2>
            <div className="flex gap-2 mb-3">
              <input className="flex-1 border p-2 rounded" value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} placeholder="New subject" />
              <button onClick={addSubject} className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add</button>
            </div>

            <ul className="space-y-2 max-h-64 overflow-auto">
              {subjects.map((s) => (
                <li key={s.id} className="flex justify-between items-center border p-2 rounded">
                  {editingSubject === s.id ? (
                    <div className="flex gap-2 w-full">
                      <input className="flex-1 border p-1 rounded" value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} />
                      <button onClick={() => saveSubject(s)} className="px-2 bg-blue-500 text-white rounded">Save</button>
                      <button onClick={() => setEditingSubject(null)} className="px-2 bg-gray-400 text-white rounded">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="cursor-pointer" onClick={() => loadQuestions(s)}>{s.name}</span>
                      <div className="space-x-2">
                        <button onClick={() => { setEditingSubject(s.id); setSubjectInput(s.name); }} className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                        <button onClick={() => deleteSubject(s.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Questions */}
          <div className="bg-white p-4 rounded shadow md:col-span-1">
            <h2 className="text-lg font-semibold mb-3">Questions {selectedSubject ? `for ${selectedSubject.name}` : ""}</h2>

            <div className="grid grid-cols-1 gap-2 mb-3">
              <input className="border p-2 rounded" placeholder="Question text" value={questionForm.question} onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border p-2 rounded" placeholder="Option A" value={questionForm.option_a} onChange={(e) => setQuestionForm({ ...questionForm, option_a: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Option B" value={questionForm.option_b} onChange={(e) => setQuestionForm({ ...questionForm, option_b: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Option C" value={questionForm.option_c} onChange={(e) => setQuestionForm({ ...questionForm, option_c: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Option D" value={questionForm.option_d} onChange={(e) => setQuestionForm({ ...questionForm, option_d: e.target.value })} />
              </div>
              <select value={questionForm.correct_option} onChange={(e) => setQuestionForm({ ...questionForm, correct_option: e.target.value })} className="border p-2 rounded">
                <option value="A">Correct: A</option>
                <option value="B">Correct: B</option>
                <option value="C">Correct: C</option>
                <option value="D">Correct: D</option>
              </select>
              <div className="flex gap-2">
                <button onClick={() => (editingQuestion ? saveQuestion(questions.find(q => q.id === editingQuestion)) : addQuestion())} className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  {editingQuestion ? "Save Question" : "+ Add Question"}
                </button>
                <button onClick={resetQuestionForm} className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400">Reset</button>
              </div>
            </div>

            <ul className="space-y-3 max-h-80 overflow-auto">
              {questions.map((q) => (
                <li key={q.id} className="border p-3 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium mb-1">{q.question}</p>
                      <ul className="text-sm ml-4 list-disc">
                        <li>A. {q.option_a}</li>
                        <li>B. {q.option_b}</li>
                        <li>C. {q.option_c}</li>
                        <li>D. {q.option_d}</li>
                      </ul>
                      <p className="text-xs mt-1 text-green-700">Correct: {q.correct_option}</p>
                    </div>
                    <div className="space-y-2">
                      <button onClick={() => startEditQuestion(q)} className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                      <button onClick={() => deleteQuestion(q.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

/* NavBar */
function NavBar() {
  return (
    <nav className="bg-gray-900 text-white flex gap-6 px-6 py-3">
      <Link href="/" className="hover:text-blue-400">Home</Link>
      <Link href="/student" className="hover:text-blue-400">Student</Link>
      <Link href="/admin" className="hover:text-blue-400">Admin</Link>
    </nav>
  );
}
