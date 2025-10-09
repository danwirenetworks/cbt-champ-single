export default function AdminLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </div>
  );
}
