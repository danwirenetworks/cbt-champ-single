export default function TimeSettings({ exams, updateDuration }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Time Settings</h2>
      <p className="text-gray-600 mb-4">
        Adjust default time for each exam. Subject-level timing coming soon.
      </p>

      <ul className="space-y-2">
        {exams.map((exam) => (
          <li
            key={exam.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>{exam.name}</span>
            <input
              type="number"
              className="w-24 border p-1 rounded text-center"
              defaultValue={exam.duration || ""}
              onBlur={(e) => updateDuration(exam.id, e.target.value)}
              placeholder="Minutes"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}