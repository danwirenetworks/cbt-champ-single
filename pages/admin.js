import { useAdminLogic } from "../hooks/useAdminLogic";
import TabButton from "../components/TabButton";
import DashboardStats from "../components/DashboardStats";
import ExamManager from "../components/ExamManager";
import SubjectManager from "../components/SubjectManager";
import QuestionManager from "../components/QuestionManager";
import CandidateManager from "../components/CandidateManager";
import ReportsPanel from "../components/ReportsPanel";

export default function AdminPage() {
  const admin = useAdminLogic();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">🛠 Admin Console</h1>

      <div className="flex gap-2 border-b">
        <TabButton id="dashboard" label="Dashboard" {...admin} />
        <TabButton id="exams" label="Exams & Subjects" {...admin} />
        <TabButton id="candidates" label="Candidates" {...admin} />
        <TabButton id="reports" label="Reports" {...admin} />
      </div>

      {admin.activeTab === "dashboard" && <DashboardStats {...admin} />}
      {admin.activeTab === "exams" && (
        <>
          <ExamManager {...admin} />
          <SubjectManager
            selectedExam={admin.selectedExam}
            selectedSubject={admin.selectedSubject}
            setSelectedSubject={admin.setSelectedSubject}
          />
          <QuestionManager
            selectedExam={admin.selectedExam}
            selectedSubject={admin.selectedSubject}
          />
        </>
      )}
      {admin.activeTab === "candidates" && <CandidateManager {...admin} />}
      {admin.activeTab === "reports" && <ReportsPanel />}
    </div>
  );
}