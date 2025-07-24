// frontend/app/admin/page.js
export default function AdminHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <ul className="mt-4 list-disc list-inside">
        <li><a href="/admin/users" className="text-blue-500">Manage Users</a></li>
        <li><a href="/admin/settings" className="text-blue-500">Settings</a></li>
      </ul>
    </div>
  );
}
