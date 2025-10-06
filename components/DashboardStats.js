export default function DashboardStats({ exams, candidates, subjects, questions }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Quick Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-100 rounded text-center">
          <div className="text-2xl font-bold">{exams.length}</div>
          <div>Exams</div>
        </div>
        <div className="p-4 bg-green-100 rounded text-center">
          <div className="text-2xl font-bold">{candidates.length}</div>
          <div>Candidates</div>
        </div>
        <div className="p-4 bg-yellow-100 rounded text-center">
          <div className="text-2xl font-bold">{subjects.length}</div>
          <div>Subjects (Current Exam)</div>
        </div>
        <div className="p-4 bg-red-100 rounded text-center">
          <div className="text-2xl font-bold">{questions.length}</div>
          <div>Questions (Current Subject)</div>
        </div>
      </div>
    </div>
  );
}