'use client';

import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Layout/Navbar';

export default function ProfilePage() {
  const { user, hasRole } = useAuth();

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Your account information</p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{user?.username}</h2>
                <div className="flex gap-2 mt-1">
                  {hasRole('ROLE_ADMIN') && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      Administrator
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user?.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="mt-1 text-gray-900 font-mono text-sm">{user?.userId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Username (NIC)</label>
                  <p className="mt-1 text-gray-900">{user?.username}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Roles</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {user?.roles?.map((role, index) => (
                      <span key={index} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}