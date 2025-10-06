
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import JambModeSelector from "../components/JambModeSelector";
import SessionExam from "../components/SessionExam";
import ReviewScreen from "../components/ReviewScreen";

export default function StudentPage() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [sessionConfig, setSessionConfig] = useState(null);
  const [reviewData, setReviewData] = useState(null);

  const studentId = 1; // Replace with actual student ID when login is added

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

  if (reviewData) {
    return (
      <ReviewScreen
        subjects={reviewData.subjects}
        questionsBySubject={reviewData.questionsBySubject}
        answers={reviewData.answers}
        candidateName={"Candidate"} // Replace with actual name when login is added
      />
    );
  }

  if (!selectedExam) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <NavBar />
        <h1 className="text-2xl font-bold mb-4">Select an Exam</h1>
        <ul>
          {exams.map((exam) => (
            <li
              key={exam.id}
              onClick={() => loadSubjects(exam)}
              className="p-3 bg-white mb-2 shadow cursor-pointer hover:bg-blue-50 rounded"
            >
              {exam.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!sessionConfig) {
    if (selectedExam.name.toLowerCase().includes("jamb")) {
      return (
        <div className="p-6 bg-gray-100 min-h-screen">
          <NavBar />
          <h1 className="text-2xl font-bold mb-4">JAMB Mode</h1>
          <JambModeSelector
            subjects={subjects}
            onStartSingle={startSingle}
            onStartSession={startSession}
          />
        </div>
      );
    } else {
      if (subjects.length === 1) {
        startSingle(subjects[0].id);
        return null;
      }

      return (
        <div className="p-6 bg-gray-100 min-h-screen">
          <NavBar />
          <h1 className="text-2xl font-bold mb-4">Select Subject</h1>
          <ul>
            {subjects.map((subj) => (
              <li
                key={subj.id}
                onClick={() => startSingle(subj.id)}
                className="p-3 bg-white mb-2 shadow cursor-pointer hover:bg-blue-50 rounded"
              >
                {subj.name} ({subj.duration || "?"} min)
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }

  if (sessionConfig) {
    return (
      <SessionExam
        subjects={sessionConfig.subjects}
        questionsBySubject={sessionConfig.questionsBySubject}
        examDuration={sessionConfig.examDuration}
        examId={sessionConfig.examId}
        studentId={sessionConfig.studentId}
        onSubmit={handleSubmit}
      />
    );
  }

  return null;
}