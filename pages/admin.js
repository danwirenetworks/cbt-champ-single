import { useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import TabBar from "../components/admin/TabBar";
import DashboardPanel from "../components/admin/DashboardPanel";
import ExamPanel from "../components/admin/ExamPanel";
import CandidatePanel from "../components/admin/CandidatePanel";
import ReportsPanel from "../components/admin/ReportsPanel";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "exams", label: "Exams & Subjects" },
    { id: "candidates", label: "Candidates" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <AdminLayout title="🛠 Admin Console">
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      <div className="mt-4">
        {activeTab === "dashboard" && <DashboardPanel />}
        {activeTab === "exams" && <ExamPanel />}
        {activeTab === "candidates" && <CandidatePanel />}
        {activeTab === "reports" && <ReportsPanel />}
      </div>
    </AdminLayout>
  );
}
