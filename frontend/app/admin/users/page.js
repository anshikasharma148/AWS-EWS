'use client';

import { useState } from 'react';

export default function ManageUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', role: 'engineer', email: 'john@example.com' },
  ]);

  const [form, setForm] = useState({ name: '', email: '', role: '' });

  const addUser = () => {
    const id = users.length + 1;
    setUsers([...users, { id, ...form }]);
    setForm({ name: '', email: '', role: '' });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Manage Users</h2>
      <div className="mt-4">
        <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-2 mr-2" />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="border p-2 mr-2" />
        <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="border p-2 mr-2">
          <option value="">Select Role</option>
          <option value="engineer">Engineer</option>
          <option value="viewer">Viewer</option>
        </select>
        <button onClick={addUser} className="bg-blue-500 text-white px-4 py-2 rounded">Add User</button>
      </div>

      <ul className="mt-6 space-y-2">
        {users.map(u => (
          <li key={u.id} className="border p-2 rounded">
            {u.name} ({u.email}) — <strong>{u.role}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
