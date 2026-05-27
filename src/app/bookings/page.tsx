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
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
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

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Bookings</h1>
          <Link href="/bookings/create" className="bg-blue-500 text-white px-4 py-2 rounded">
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
            {bookings.map((booking: any) => {
              const verified = isVerified(booking.status);
              return (
                <div key={booking.id} className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{booking.bookingFor}</h3>
                      <p>Hall: {booking.hall?.name || 'N/A'}</p>
                      <p>Date: {booking.reservedDate} at {booking.startTime}</p>
                      <p>Participants: {booking.expectedParticipants}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-sm ${
                        verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {verified ? 'Verified' : 'Cancelled'}
                      </span>
                      <div className="mt-2">
                        <Link href={`/bookings/${booking.id}`} className="text-blue-500 text-sm mr-2">View</Link>
                        <Link href={`/bookings/edit/${booking.id}`} className="text-green-500 text-sm">Edit</Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}