export default function CandidateManager({
  candidateName,
  setCandidateName,
  candidateExamNo,
  setCandidateExamNo,
  addCandidate,
  candidates,
  deleteCandidate,
}) {
  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">Register Candidates</h2>

      <div className="flex flex-col md:flex-row gap-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />
        <input
          className="border p-2 rounded flex-1"
          placeholder="Exam No"
          value={candidateExamNo}
          onChange={(e) => setCandidateExamNo(e.target.value)}
        />
        <button
          onClick={addCandidate}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>

      <ul className="max-h-64 overflow-auto space-y-2">
        {candidates.map((cand) => (
          <li
            key={cand.id}
            className="flex justify-between border p-2 rounded"
          >
            <span>
              {cand.name} ({cand.exam_no})
            </span>
            <button
              onClick={() => deleteCandidate(cand.id)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}