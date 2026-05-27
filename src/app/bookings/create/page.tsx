'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import { api } from '../../services/api';
import { useAuth } from '../../context/authContex';

export default function CreateBookingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [halls, setHalls] = useState([]);
  const [form, setForm] = useState({
    reservedDate: '',
    startTime: '',
    endTime: '', // Add endTime
    bookingFor: '',
    expectedParticipants: 0,
    specialRequirements: '',
    hallId: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    try {
      const data = await api.getAllActiveHalls();
      setHalls(data);
    } catch (error) {
      console.error('Error loading halls:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const bookingData = {
      reservedDate: form.reservedDate,
      startTime: form.startTime,
      endTime: form.endTime || form.startTime, // Provide endTime (use startTime if not provided)
      bookingFor: form.bookingFor,
      expectedParticipants: Number(form.expectedParticipants),
      specialRequirements: form.specialRequirements,
      hall: { id: form.hallId },
      requestedBy: { userId: user?.userId },
      createdAt: new Date().toISOString(),
    };

    try {
      await api.createBooking(bookingData);
      router.push('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create Booking</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <select
            value={form.hallId}
            onChange={(e) => setForm({ ...form, hallId: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            required
          >
            <option value="">Select Hall</option>
            {halls.map((hall: any) => (
              <option key={hall.id} value={hall.id}>
                {hall.name} - Capacity: {hall.capacity} - {hall.location}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.reservedDate}
            onChange={(e) => setForm({ ...form, reservedDate: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <input
            type="time"
            placeholder="Start Time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <input
            type="time"
            placeholder="End Time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className="w-full p-2 border rounded mb-3"
          />

          <input
            type="text"
            placeholder="Event Name"
            value={form.bookingFor}
            onChange={(e) => setForm({ ...form, bookingFor: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <input
            type="number"
            placeholder="Expected Participants"
            value={form.expectedParticipants}
            onChange={(e) => setForm({ ...form, expectedParticipants: parseInt(e.target.value) })}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <textarea
            placeholder="Special Requirements"
            value={form.specialRequirements}
            onChange={(e) => setForm({ ...form, specialRequirements: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            rows={3}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </form>
      </div>
    </>
  );
}