'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Layout/Navbar';
import { useHall } from '@/hooks/useHall';
import { useAuth } from '@/contexts/AuthContext';
import { Hall } from '@/types';

export default function HallDetailsPage() {
  const { id } = useParams();
  const [hall, setHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);
  const { getHallById } = useHall();
  const { hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchHallDetails();
  }, [id]);

  const fetchHallDetails = async () => {
    try {
      const response = await getHallById(id as string);
      if (response.data) {
        setHall(response.data);
      }
    } catch (error) {
      console.error('Error fetching hall details:', error);
    } finally {
      setLoading(false);
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

  if (!hall) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Hall not found</h2>
            <button
              onClick={() => router.push('/halls')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Back to Halls
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
          >
            ← Back
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{hall.name}</h1>
              <p className="text-gray-600 mt-2">{hall.location}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              hall.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {hall.status ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hall Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500">Capacity</label>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{hall.capacity} people</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500">Amenities</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${hall.hasProjector ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="ml-2 text-gray-700">Projector</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${hall.hasAc ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="ml-2 text-gray-700">Air Conditioning</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${hall.hasWhiteboard ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="ml-2 text-gray-700">Whiteboard</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1 text-gray-900">{hall.description || 'No description provided'}</p>
                </div>
                
                {hall.createdAt && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500">Created At</label>
                    <p className="mt-1 text-gray-900">{new Date(hall.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => router.push(`/bookings/create?hallId=${hall.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Book This Hall
              </button>
              {hasRole('ROLE_ADMIN') && (
                <button
                  onClick={() => router.push(`/halls/edit/${hall.id}`)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Edit Hall
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}