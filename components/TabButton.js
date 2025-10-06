export default function TabButton({ id, label, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-t font-medium ${
        activeTab === id ? "bg-white text-blue-600 border border-b-0" : "bg-gray-200 text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}