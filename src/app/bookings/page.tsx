'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import { api } from '../services/api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getAllBookings();
      console.log('Bookings data:', data);
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format time to remove seconds if needed
  const formatTime = (time: string) => {
    return time.substring(0, 5); // Converts "12:23:00" to "12:23"
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Bookings</h1>
          <Link href="/bookings/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create Booking
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded shadow">
            <p className="text-gray-500">No bookings found.</p>
            <Link href="/bookings/create" className="text-blue-500 mt-2 inline-block">
              Create your first booking
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{booking.bookingFor}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      <p>
                        <span className="text-gray-500">Hall:</span>{' '}
                        <span className="font-medium">{booking.hall?.name}</span>
                      </p>
                      <p>
                        <span className="text-gray-500">Location:</span>{' '}
                        <span>{booking.hall?.location}</span>
                      </p>
                      <p>
                        <span className="text-gray-500">Date:</span>{' '}
                        <span>{booking.reservedDate}</span>
                      </p>
                      <p>
                        <span className="text-gray-500">Time:</span>{' '}
                        <span>{formatTime(booking.startTime)}</span>
                        {booking.endTime && booking.endTime !== booking.startTime && 
                          ` - ${formatTime(booking.endTime)}`
                        }
                      </p>
                      <p>
                        <span className="text-gray-500">Participants:</span>{' '}
                        <span>{booking.expectedParticipants}</span>
                      </p>
                      <p>
                        <span className="text-gray-500">Created:</span>{' '}
                        <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                    {booking.specialRequirements && (
                      <p className="mt-2 text-sm">
                        <span className="text-gray-500">Requirements:</span>{' '}
                        <span className="text-gray-600">{booking.specialRequirements}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === true || booking.status === 1
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status === true || booking.status === 1 ? 'Verified' : 'Cancelled'}
                    </span>
                    <div className="mt-3 space-x-2">
                      <Link 
                        href={`/bookings/${booking.id}`} 
                        className="text-blue-500 text-sm hover:text-blue-700"
                      >
                        View Details
                      </Link>
                      <Link 
                        href={`/bookings/edit/${booking.id}`} 
                        className="text-green-500 text-sm hover:text-green-700"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}