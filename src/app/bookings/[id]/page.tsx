'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import { api } from '../../services/api';
import { useAuth } from '../../context/authContex';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const data = await api.getBookingById(id as string);
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: boolean) => {
    if (!confirm(`Are you sure you want to ${status ? 'verify' : 'cancel'} this booking?`)) {
      return;
    }

    setUpdating(true);
    try {
      await api.updateBookingStatus({
        id: booking.id,
        status: status,
        updatedAt: new Date().toISOString(),
      });
      await loadBooking();
      alert(`Booking ${status ? 'verified' : 'cancelled'} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update booking status');
    } finally {
      setUpdating(false);
    }
  };

  // Helper function to check if booking is verified
  const isVerified = (status: any): boolean => {
    if (typeof status === 'boolean') return status;
    if (typeof status === 'number') return status === 1;
    if (typeof status === 'string') return status === 'true' || status === '1';
    return false;
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

  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="max-w-3xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Booking not found
          </div>
          <button
            onClick={() => router.push('/bookings')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Back to Bookings
          </button>
        </div>
      </>
    );
  }

  const verified = isVerified(booking.status);

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{booking.bookingFor}</h1>
            <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
              verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {verified ? 'Verified' : 'Cancelled'}
            </span>
          </div>
          
          <div className="space-y-2 border-t pt-4">
            <p><strong>Booking ID:</strong> {booking.id}</p>
            <p><strong>Hall:</strong> {booking.hall?.name}</p>
            <p><strong>Location:</strong> {booking.hall?.location}</p>
            <p><strong>Date:</strong> {booking.reservedDate}</p>
            <p><strong>Start Time:</strong> {booking.startTime}</p>
            {booking.endTime && <p><strong>End Time:</strong> {booking.endTime}</p>}
            <p><strong>Expected Participants:</strong> {booking.expectedParticipants}</p>
            <p><strong>Special Requirements:</strong> {booking.specialRequirements || 'None'}</p>
            <p><strong>Created At:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => router.push('/bookings')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
            <button
              onClick={() => router.push(`/bookings/edit/${booking.id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            {!verified ? (
              <button
                onClick={() => handleStatusUpdate(true)}
                disabled={updating}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Verify Booking'}
              </button>
            ) : (
              <button
                onClick={() => handleStatusUpdate(false)}
                disabled={updating}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Cancel Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}