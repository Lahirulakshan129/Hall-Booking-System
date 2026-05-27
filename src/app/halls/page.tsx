'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import { api } from '../services/api';

export default function HallsPage() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search states
  const [searchName, setSearchName] = useState('');
  const [searchCapacity, setSearchCapacity] = useState('');
  const [advancedSearch, setAdvancedSearch] = useState({
    name: '',
    capacity: '',
    hasProjector: false,
    hasAc: false,
    hasWhiteboard: false,
    status: true
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    try {
      setLoading(true);
      const data = await api.getAllActiveHalls();
      setHalls(data);
    } catch (error) {
      console.error('Error loading halls:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search by Name
  const handleSearchByName = async () => {
    if (!searchName) {
      loadHalls();
      return;
    }
    
    try {
      setLoading(true);
      const data = await api.searchHallByName(searchName);
      setHalls(data);
    } catch (error) {
      console.error('Error searching by name:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search by Capacity (less than or equal)
  const handleSearchByCapacity = async () => {
    if (!searchCapacity) {
      loadHalls();
      return;
    }
    
    try {
      setLoading(true);
      const data = await api.searchHallByCapacity(parseInt(searchCapacity));
      setHalls(data);
    } catch (error) {
      console.error('Error searching by capacity:', error);
    } finally {
      setLoading(false);
    }
  };

  // Advanced Search
  const handleAdvancedSearch = async () => {
    try {
      setLoading(true);
      const data = await api.advancedSearch({
        name: advancedSearch.name || 'null',
        capacity: advancedSearch.capacity ? parseInt(advancedSearch.capacity) : 0,
        hasProjector: advancedSearch.hasProjector,
        hasAc: advancedSearch.hasAc,
        hasWhiteboard: advancedSearch.hasWhiteboard,
        status: advancedSearch.status
      });
      setHalls(data);
    } catch (error) {
      console.error('Error in advanced search:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchName('');
    setSearchCapacity('');
    setAdvancedSearch({
      name: '',
      capacity: '',
      hasProjector: false,
      hasAc: false,
      hasWhiteboard: false,
      status: true
    });
    loadHalls();
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
          <h1 className="text-2xl font-bold">Halls</h1>
          <Link href="/halls/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Hall
          </Link>
        </div>
        
        {/* Search Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setShowAdvanced(false)}
                className={`px-4 py-2 text-sm font-medium ${!showAdvanced ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              >
                Basic Search
              </button>
              <button
                onClick={() => setShowAdvanced(true)}
                className={`px-4 py-2 text-sm font-medium ${showAdvanced ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              >
                Advanced Search
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {/* Basic Search */}
            {!showAdvanced && (
              <div className="space-y-4">
                {/* Search by Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter hall name..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearchByName()}
                    />
                    <button 
                      onClick={handleSearchByName} 
                      className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Search by Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search by Capacity (≤)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Max capacity..."
                      value={searchCapacity}
                      onChange={(e) => setSearchCapacity(e.target.value)}
                      className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearchByCapacity()}
                    />
                    <button 
                      onClick={handleSearchByCapacity} 
                      className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
                    >
                      Filter
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Search */}
            {showAdvanced && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hall Name</label>
                  <input
                    type="text"
                    placeholder="Enter hall name (or 'null' for any)"
                    value={advancedSearch.name}
                    onChange={(e) => setAdvancedSearch({ ...advancedSearch, name: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Capacity</label>
                  <input
                    type="number"
                    placeholder="Enter minimum capacity"
                    value={advancedSearch.capacity}
                    onChange={(e) => setAdvancedSearch({ ...advancedSearch, capacity: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={advancedSearch.hasProjector}
                        onChange={(e) => setAdvancedSearch({ ...advancedSearch, hasProjector: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Projector</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={advancedSearch.hasAc}
                        onChange={(e) => setAdvancedSearch({ ...advancedSearch, hasAc: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Air Conditioning</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={advancedSearch.hasWhiteboard}
                        onChange={(e) => setAdvancedSearch({ ...advancedSearch, hasWhiteboard: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Whiteboard</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={advancedSearch.status === true}
                        onChange={() => setAdvancedSearch({ ...advancedSearch, status: true })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={advancedSearch.status === false}
                        onChange={() => setAdvancedSearch({ ...advancedSearch, status: false })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Inactive</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={handleAdvancedSearch} 
                    className="flex-1 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  >
                    Advanced Search
                  </button>
                  <button 
                    onClick={resetFilters} 
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Reset Button for Basic Search */}
            {!showAdvanced && (searchName || searchCapacity) && (
              <div className="mt-4">
                <button 
                  onClick={resetFilters} 
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Found {halls.length} hall(s)
        </div>

        {/* Halls Grid */}
        {halls.length === 0 ? (
          <div className="text-center py-12 bg-white rounded shadow">
            <p className="text-gray-500">No halls found matching your criteria.</p>
            <button onClick={resetFilters} className="text-blue-500 mt-2 hover:text-blue-700">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {halls.map((hall: any) => (
              <div key={hall.id} className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{hall.name}</h3>
                    <p className="text-gray-600 text-sm">{hall.location}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    hall.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {hall.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="mt-3 space-y-1">
                  <p className="text-sm">
                    <span className="text-gray-500">Capacity:</span> 
                    <span className="ml-1 font-medium">{hall.capacity} people</span>
                  </p>
                  
                  <div className="flex gap-2 text-xs">
                    {hall.hasProjector && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Projector</span>
                    )}
                    {hall.hasAc && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">AC</span>
                    )}
                    {hall.hasWhiteboard && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Whiteboard</span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4 pt-3 border-t">
                  <Link href={`/halls/${hall.id}`} className="text-blue-500 text-sm hover:text-blue-700">
                    View Details
                  </Link>
                  <Link href={`/halls/edit/${hall.id}`} className="text-green-500 text-sm hover:text-green-700">
                    Edit Hall
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}