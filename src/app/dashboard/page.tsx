'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import { api } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ halls: 0, bookings: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const halls = await api.getAllActiveHalls();
      const bookings = await api.getAllBookings();
      setStats({ halls: halls.length || 0, bookings: bookings.length || 0 });
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Halls</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.halls}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Bookings</h3>
            <p className="text-3xl font-bold text-green-600">{stats.bookings}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/halls" className="bg-blue-500 text-white p-4 rounded text-center hover:bg-blue-600">
            Manage Halls
          </Link>
          <Link href="/bookings" className="bg-green-500 text-white p-4 rounded text-center hover:bg-green-600">
            Manage Bookings
          </Link>
        </div>
      </div>
    </>
  );
}