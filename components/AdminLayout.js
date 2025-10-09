export default function AdminLayout({ title, children }) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {children}
    </div>
  );
}
