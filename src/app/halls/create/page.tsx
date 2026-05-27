'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import { api } from '../../services/api';

export default function CreateHallPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    location: '',
    capacity: 0,
    hasProjector: false,
    hasAc: false,
    hasWhiteboard: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.saveHall(form);
    router.push('/halls');
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create Hall</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <input
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <label className="flex items-center mb-2">
            <input type="checkbox" checked={form.hasProjector} onChange={(e) => setForm({ ...form, hasProjector: e.target.checked })} />
            <span className="ml-2">Projector</span>
          </label>
          <label className="flex items-center mb-2">
            <input type="checkbox" checked={form.hasAc} onChange={(e) => setForm({ ...form, hasAc: e.target.checked })} />
            <span className="ml-2">AC</span>
          </label>
          <label className="flex items-center mb-4">
            <input type="checkbox" checked={form.hasWhiteboard} onChange={(e) => setForm({ ...form, hasWhiteboard: e.target.checked })} />
            <span className="ml-2">Whiteboard</span>
          </label>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Create</button>
        </form>
      </div>
    </>
  );
}