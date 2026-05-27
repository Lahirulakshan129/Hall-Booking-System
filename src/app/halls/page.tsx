'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import { api } from '../services/api';

export default function HallsPage() {
  const [halls, setHalls] = useState([]);
  const [search, setSearch] = useState(''); 

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    const data = await api.getAllActiveHalls();
    setHalls(data);
  };

  const handleSearch = async () => {
    if (search) {
      const data = await api.searchHallByName(search);
      setHalls(data);
    } else {
      loadHalls();
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Halls</h1>
          <Link href="/halls/create" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Hall
          </Link>
        </div>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button onClick={handleSearch} className="bg-gray-500 text-white px-4 rounded">Search</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {halls.map((hall: any) => (
            <div key={hall.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-lg">{hall.name}</h3>
              <p className="text-gray-600">{hall.location}</p>
              <p>Capacity: {hall.capacity}</p>
              <div className="flex gap-2 mt-2">
                <Link href={`/halls/${hall.id}`} className="text-blue-500 text-sm">View</Link>
                <Link href={`/halls/edit/${hall.id}`} className="text-green-500 text-sm">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}