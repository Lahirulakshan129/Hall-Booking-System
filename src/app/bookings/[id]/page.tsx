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
      console.log('Booking details:', data);
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

  const formatTime = (time: string) => {
    if (!time) return 'N/A';
    return time.substring(0, 5);
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
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Bookings
          </button>
        </div>
      </>
    );
  }

  const isVerified = booking.status === true || booking.status === 1;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold">{booking.bookingFor}</h1>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isVerified ? 'Verified' : 'Cancelled'}
              </span>
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-500">Booking ID</label>
                  <p className="font-mono text-sm">{booking.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Created At</label>
                  <p>{new Date(booking.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Hall</label>
                <p className="font-semibold">{booking.hall?.name}</p>
                <p className="text-sm text-gray-600">{booking.hall?.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-500">Reserved Date</label>
                  <p>{booking.reservedDate}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Time</label>
                  <p>
                    {formatTime(booking.startTime)}
                    {booking.endTime && booking.endTime !== booking.startTime && 
                      ` - ${formatTime(booking.endTime)}`
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-500">Expected Participants</label>
                  <p>{booking.expectedParticipants}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Hall Capacity</label>
                  <p>{booking.hall?.capacity}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Special Requirements</label>
                <p className="text-gray-700">{booking.specialRequirements || 'None'}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Requested By</label>
                <p>{booking.requestedBy?.username} (ID: {booking.requestedBy?.userId})</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Hall Amenities</label>
                <div className="flex gap-2 mt-1">
                  {booking.hall?.hasProjector && (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">Projector</span>
                  )}
                  {booking.hall?.hasAc && (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">AC</span>
                  )}
                  {booking.hall?.hasWhiteboard && (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">Whiteboard</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/bookings')}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Back to List
              </button>
              <button
                onClick={() => router.push(`/bookings/edit/${booking.id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit Booking
              </button>
              {!isVerified ? (
                <button
                  onClick={() => handleStatusUpdate(true)}
                  disabled={updating}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Verify Booking'}
                </button>
              ) : (
                <button
                  onClick={() => handleStatusUpdate(false)}
                  disabled={updating}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Cancel Booking'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}