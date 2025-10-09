export default function CandidatePanel({
  candidates,
  candidateName,
  setCandidateName,
  candidateExamNo,
  setCandidateExamNo,
  addCandidate,
  deleteCandidate,
}) {
  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">👥 Manage Candidates</h2>

      {/* ➕ Add Candidate */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Candidate Name</label>
        <input
          className="border p-2 rounded w-full"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          placeholder="Enter full name"
        />

        <label className="block text-sm font-medium mt-2">Exam Number</label>
        <input
          className="border p-2 rounded w-full"
          value={candidateExamNo}
          onChange={(e) => setCandidateExamNo(e.target.value)}
          placeholder="e.g. 2025-001"
        />

        <button
          onClick={addCandidate}
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ➕ Add Candidate
        </button>
      </div>

      {/* 📋 Candidate List */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Registered Candidates</h3>
        <ul className="space-y-2 max-h-72 overflow-auto">
  {(Array.isArray(candidates) ? candidates : []).map((cand) => (
    <li
      key={cand.id}
      className="border rounded p-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
    >
      <span>{cand.name}</span>
      <span className="text-sm text-gray-500">Exam No: {cand.schoolNo}</span>
    </li>
  ))}
</ul>

      </div>
    </div>
  );
}
