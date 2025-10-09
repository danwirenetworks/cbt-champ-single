import NavBar from "../components/NavBar";
import JambModeSelector from "../components/JambModeSelector";
import SessionExam from "../components/SessionExam";
import ReviewScreen from "../components/ReviewScreen";
import { useStudentExamFlow } from "../hooks/useStudentExamFlow";

export default function StudentPage() {
  const {
    exams,
    subjects,
    selectedExam,
    sessionConfig,
    reviewData,
    loadSubjects,
    startSingle,
    startSession,
    handleSubmit,
  } = useStudentExamFlow();

  if (reviewData) {
    return (
      <ReviewScreen
        subjects={reviewData.subjects}
        questionsBySubject={reviewData.questionsBySubject}
        answers={reviewData.answers}
        candidateName={"Candidate"}
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
    const isJamb = selectedExam.name.toLowerCase().includes("jamb");

    if (isJamb) {
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
    }

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
