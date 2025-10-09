import { useEffect, useState } from "react";

export default function ReportsPanel() {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await window.electronAPI.get_exams();
      setExams(data);
    })();
  }, []);

  const loadReports = async () => {
    if (!selectedExamId) return;
    const data = await window.electronAPI.get_reports(selectedExamId);
    setSubmissions(data);
  };

  const exportResults = async () => {
    if (!selectedExamId) return;
    await window.electronAPI.export_results(selectedExamId);
    alert("✅ Results exported successfully!");
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">📈 Exam Reports</h2>

      {/* 🔽 Exam Selector */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <select
          value={selectedExamId || ""}
          onChange={(e) => setSelectedExamId(parseInt(e.target.value))}
          className="border p-2 rounded w-full md:w-1/2"
        >
          <option value="">Select an exam</option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.name}
            </option>
          ))}
        </select>

        <button
          onClick={loadReports}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Submissions
        </button>

        <button
          onClick={exportResults}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {/* 📋 Submission Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-2">📋 Submission Summary</h3>
        {submissions.length === 0 ? (
          <p className="text-gray-500">No submissions found for this exam.</p>
        ) : (
          <ul className="space-y-2 max-h-72 overflow-auto">
            {submissions.map((sub, index) => (
              <li
                key={index}
                className="border rounded p-3 bg-gray-50 hover:bg-gray-100"
              >
                <p className="font-medium">{sub.candidateName}</p>
                {Object.entries(sub.scores).map(([subject, score]) => (
                  <p key={subject} className="text-sm text-gray-700">
                    {subject}: {score} / {sub.totalMarks[subject]}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
