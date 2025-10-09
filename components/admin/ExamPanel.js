import { useAdminLogic } from "../../hooks/useAdminLogic"; // adjust path if needed
import TabBar from "./TabBar";
import ExamManager from "../ExamManager";
import SubjectPanel from "./SubjectPanel";
import QuestionPanel from "./QuestionPanel";
import CandidatePanel from "./CandidatePanel";
import { useRef, useEffect, useState } from "react";

export default function ExamPanel() {
  const admin = useAdminLogic();
  const [subTab, setSubTab] = useState("exams");
  const panelRef = useRef(null);

  const subTabs = [
    { id: "exams", label: "Exams" },
    { id: "subjects", label: "Subjects" },
    { id: "questions", label: "Questions" },
    { id: "candidates", label: "Candidates" },
  ];

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [subTab]);

  return (
    <div ref={panelRef} className="bg-white p-4 rounded shadow space-y-4 max-h-[80vh] overflow-y-auto">
      <TabBar activeTab={subTab} setActiveTab={setSubTab} tabs={subTabs} />

      {subTab === "exams" && <ExamManager {...admin} setSubTab={setSubTab} />}
      {subTab === "subjects" && <SubjectPanel {...admin} setSubTab={setSubTab} />}
      {subTab === "questions" && <QuestionPanel {...admin} />}
      {subTab === "candidates" && <CandidatePanel {...admin} />}
    </div>
  );
}
