"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentPage() {
  /* -------------------------
     State
  ------------------------- */
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 30); // 30 mins
  const [showSubmit, setShowSubmit] = useState(false); // submission screen
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const safeArray = (v) => (Array.isArray(v) ? v : []);

  /* -------------------------
     Load Exams on Mount
  ------------------------- */
  useEffect(() => {
    async function loadExams() {
      try {
        const data = await window.electronAPI.get_exams();
        setExams(safeArray(data));
      } catch (err) {
        console.error("Load exams failed:", err);
        setExams([]);
      }
    }
    loadExams();
  }, []);

  /* -------------------------
     Load Subjects when Exam selected
  ------------------------- */
  useEffect(() => {
    async function loadSubjects() {
      if (!selectedExam) return;
      try {
        const data = await window.electronAPI.get_subjects(selectedExam.id);
        setSubjects(safeArray(data));
        setSelectedSubject(null);
        setQuestions([]);
        setCurrentIndex(0);
        setAnswers({});
        setFlagged({});
      } catch (err) {
        console.error("Load subjects failed:", err);
        setSubjects([]);
      }
    }
    loadSubjects();
  }, [selectedExam]);

  /* -------------------------
     Load Questions when Subject selected
  ------------------------- */
  useEffect(() => {
    async function loadQuestions() {
      if (!selectedSubject) return;
      try {
        const data = await window.electronAPI.get_questions(selectedSubject.id);
        const normalized = safeArray(data).map((q) => ({
          id: q.id,
          question: q.question,
          optionA: q.optionA ?? q.option_a ?? "",
          optionB: q.optionB ?? q.option_b ?? "",
          optionC: q.optionC ?? q.option_c ?? "",
          optionD: q.optionD ?? q.option_d ?? "",
          correctOption: q.correctOption ?? q.correct_option ?? "A",
        }));
        setQuestions(normalized);
        setCurrentIndex(0);
        setAnswers({});
        setFlagged({});
      } catch (err) {
        console.error("Load questions failed:", err);
        setQuestions([]);
      }
    }
    loadQuestions();
  }, [selectedSubject]);

  /* -------------------------
     Timer
  ------------------------- */
  useEffect(() => {
    if (showSubmit || showQuitConfirm) return; // pause timer
    const interval = setInterval(() => setTimeLeft((t) => Math.max(t - 1, 0)), 1000);
    return () => clearInterval(interval);
  }, [showSubmit, showQuitConfirm]);

  /* -------------------------
     Keyboard Navigation
  ------------------------- */
  useEffect(() => {
    const handleKey = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || document.activeElement?.isContentEditable) return;

      if (showSubmit || showQuitConfirm) {
        // inside confirmation screens handle R/Y etc
        return;
      }

      const q = questions[currentIndex];
      if (!q) return;

      const key = e.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(key)) {
        handleAnswer(q.id, key);
      } else if (key === "N") {
        next();
      } else if (key === "P") {
        prev();
      } else if (key === "S") {
        setShowSubmit(true);
      } else if (key === "B") {
        setShowQuitConfirm(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [questions, currentIndex, answers, showSubmit, showQuitConfirm]);

  /* -------------------------
     Handlers
  ------------------------- */
  const handleAnswer = (qid, option) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
    if (!selectedExam || !selectedSubject) return;
    // save to DB via IPC — main expects snake_case (student_id, exam_id, question_id)
    try {
      window.electronAPI.save_answer({
        student_id: 1, // demo, later replace with logged-in student id
        exam_id: selectedExam.id,
        question_id: qid,
        selected_option: option,
      });
    } catch (err) {
      console.error("Save answer error:", err);
    }
  };

  const toggleFlag = (qid) => setFlagged((p) => ({ ...p, [qid]: !p[qid] }));
  const next = () => setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  const prev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  const handleFinalSubmit = () => {
    // TODO: implement final scoring & persistence
    alert("✅ Submission complete!");
    setShowSubmit(false);
    // optionally return to exams list
    setSelectedExam(null);
    setSelectedSubject(null);
    setQuestions([]);
  };

  const handleQuitConfirm = () => {
    // two-step confirmation handled by UI
    setShowQuitConfirm(false);
    // discard progress and return back to exam selection
    setQuestions([]);
    setSelectedExam(null);
    setSelectedSubject(null);
    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setTimeLeft(60 * 30);
  };

  const formatTime = (t) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  /* -------------------------
     Render
  ------------------------- */

  // 1) Choose Exam
  if (!selectedExam) {
    return (
      <div className="min-h-screen p-6 bg-gray-100">
        <NavBar />
        <h1 className="text-2xl font-bold mb-4">Select an Exam</h1>
        <ul className="space-y-2">
          {exams.map((exam) => (
            <li key={exam.id} className="bg-white p-3 rounded shadow cursor-pointer hover:bg-blue-50" onClick={() => setSelectedExam(exam)}>
              {exam.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // 2) Choose Subject
  if (!selectedSubject) {
    return (
      <div className="min-h-screen p-6 bg-gray-100">
        <NavBar />
        <h1 className="text-2xl font-bold mb-4">Select a Subject for {selectedExam.name}</h1>
        <ul className="space-y-2">
          {subjects.map((s) => (
            <li key={s.id} className="bg-white p-3 rounded shadow cursor-pointer hover:bg-blue-50" onClick={() => setSelectedSubject(s)}>
              {s.name}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <button onClick={() => setSelectedExam(null)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Back</button>
        </div>
      </div>
    );
  }

  // 3) Quit confirm modal
  if (showQuitConfirm) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">Are you sure you want to quit?</h2>
          <p className="mb-4">All progress on this test will be lost.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setShowQuitConfirm(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button onClick={handleQuitConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Quit</button>
          </div>
        </div>
      </div>
    );
  }

  // 4) Submit confirm modal
  if (showSubmit) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Submit Test?</h2>
          <p className="mb-6">You answered {Object.keys(answers).length} of {questions.length} questions.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setShowSubmit(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Return (R)</button>
            <button onClick={handleFinalSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm (Y)</button>
          </div>
        </div>
      </div>
    );
  }

  // 5) Main exam UI
  const q = questions[currentIndex];
  if (!q) {
    return (
      <div className="min-h-screen p-6 bg-gray-100">
        <NavBar />
        <p>Loading question...</p>
        <button onClick={() => setSelectedSubject(null)} className="mt-4 px-4 py-2 bg-gray-400 text-white rounded">Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavBar />
      <div className="bg-blue-600 text-white flex justify-between items-center p-4">
        <h1 className="font-bold">{selectedExam.name} — {selectedSubject.name}</h1>
        <div>Time Left: {formatTime(timeLeft)}</div>
      </div>

      <div className="flex flex-1">
        <div className="flex-1 p-6">
          <h2 className="text-lg font-semibold mb-4">Q{currentIndex + 1}. {q.question}</h2>

          <div className="space-y-3">
            {["optionA", "optionB", "optionC", "optionD"].map((opt, i) => {
              const label = String.fromCharCode(65 + i);
              const text = q[opt];
              return (
                <label key={opt} className={`flex items-center p-3 border rounded cursor-pointer transition ${answers[q.id] === label ? "bg-blue-50 border-blue-400" : "bg-white hover:bg-gray-100"}`}>
                  <input type="radio" name={`question-${q.id}`} value={label} checked={answers[q.id] === label} onChange={() => handleAnswer(q.id, label)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <span className="ml-3">{label}. {text}</span>
                </label>
              );
            })}
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={prev} disabled={currentIndex === 0} className="px-4 py-2 rounded bg-gray-300 disabled:opacity-50">Previous (P)</button>
            <button onClick={() => toggleFlag(q.id)} className={`px-4 py-2 rounded ${flagged[q.id] ? "bg-yellow-500 text-white" : "bg-gray-200"}`}>{flagged[q.id] ? "Unflag" : "Flag"}</button>
            <button onClick={next} disabled={currentIndex === questions.length - 1} className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50">Next (N)</button>
          </div>

          <div className="mt-6 flex justify-between">
            <button onClick={() => setShowQuitConfirm(true)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Back</button>
            <button onClick={() => setShowSubmit(true)} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Submit (S)</button>
          </div>
        </div>

        <aside className="w-64 bg-white border-l p-4 overflow-y-auto">
          <h3 className="font-bold mb-2">Questions</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((qq, idx) => (
              <button key={qq.id} onClick={() => setCurrentIndex(idx)} className={`h-10 w-10 rounded-full text-sm font-bold transition ${currentIndex === idx ? "bg-blue-600 text-white" : answers[qq.id] ? "bg-green-400" : flagged[qq.id] ? "bg-yellow-400" : "bg-gray-200 hover:bg-gray-300"}`}>{idx + 1}</button>
            ))}
          </div>
        </aside>
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
