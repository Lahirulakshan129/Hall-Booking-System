'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import { api } from '../../../services/api';
import { useAuth } from '../../../context/authContex';

export default function EditBookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    id: '',
    reservedDate: '',
    startTime: '',
    endTime: '',
    bookingFor: '',
    expectedParticipants: 0,
    specialRequirements: '',
    hallId: '',
    createdAt: '',
  });

  useEffect(() => {
    if (id) {
      fetchBookingData();
      loadHalls();
    }
  }, [id]);

  const fetchBookingData = async () => {
    try {
      setLoading(true);
      const data = await api.getBookingById(id as string);
      
      setForm({
        id: data.id,
        reservedDate: data.reservedDate,
        startTime: data.startTime,
        endTime: data.endTime || '',
        bookingFor: data.bookingFor,
        expectedParticipants: data.expectedParticipants,
        specialRequirements: data.specialRequirements || '',
        hallId: data.hall.id,
        createdAt: data.createdAt,
      });
    } catch (error: any) {
      console.error('Error fetching booking:', error);
      setError(error.message || 'Failed to load booking data');
    } finally {
      setLoading(false);
    }
  };

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
    setUpdating(true);
    setError('');
    setSuccess('');

    // Prepare update data exactly as API expects
    const updateData = {
      id: form.id,
      reservedDate: form.reservedDate,
      startTime: form.startTime,
      endTime: form.endTime || form.startTime,
      bookingFor: form.bookingFor,
      expectedParticipants: Number(form.expectedParticipants),
      specialRequirements: form.specialRequirements || "",
      hall: { id: form.hallId },
      requestedBy: { userId: user?.userId },
      createdAt: form.createdAt,
    };

    try {
      console.log('Updating booking with data:', updateData);
      await api.updateBooking(updateData);
      setSuccess('Booking updated successfully!');
      setTimeout(() => {
        router.push('/bookings');
      }, 2000);
    } catch (error: any) {
      console.error('Update error:', error);
      setError(error.message || 'Failed to update booking');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Booking</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/bookings')}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Update Booking'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}