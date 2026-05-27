'use client';

import Link from 'next/link';
import { useAuth } from '../../context/authContex'
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
          <Link href="/halls" className="text-gray-700 hover:text-blue-600">Halls</Link>
          <Link href="/bookings" className="text-gray-700 hover:text-blue-600">Bookings</Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{user?.username}</span>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}