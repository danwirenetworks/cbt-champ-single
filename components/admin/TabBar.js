export default function TabBar({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="flex gap-2 border-b pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-t ${
            activeTab === tab.id
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          } transition-all duration-200`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
