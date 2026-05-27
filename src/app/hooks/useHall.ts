'use client';

import { useState } from 'react';
import { api } from '../services/api';
import {
  Hall,
  SaveHallRequest,
  UpdateHallRequest,
  AdvancedSearchParams,
  ApiResponse,
} from '../types';

export function useHall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save a new hall
  const saveHall = async (hallData: SaveHallRequest): Promise<ApiResponse<Hall>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.saveHall(hallData);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to save hall';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateHall = async (hallData: UpdateHallRequest): Promise<ApiResponse<Hall>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.updateHall(hallData);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update hall';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get hall by ID
const getHallById = async (hallId: string): Promise<ApiResponse<Hall>> => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.getHallById(hallId);
    // The API might return data directly or wrapped in a data property
    return { data: response, status: 200, message: 'Success' };
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to fetch hall details';
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  // Get all active halls
  const getAllActiveHalls = async (): Promise<ApiResponse<Hall[]>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAllActiveHalls();
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch halls';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Search hall by name
  const searchHallByName = async (searchParam: string): Promise<ApiResponse<Hall[]>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.searchHallByName(searchParam);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to search halls';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Search hall by capacity
  const searchHallByCapacity = async (seatCapacity: number): Promise<ApiResponse<Hall[]>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.searchHallByCapacity(seatCapacity);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to search halls by capacity';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Advanced search
  const advancedSearch = async (params: AdvancedSearchParams): Promise<ApiResponse<Hall[]>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedSearch(params);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to perform advanced search';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get halls by amenity
  const getHallsByAmenity = async (amenity: 'hasProjector' | 'hasAc' | 'hasWhiteboard') => {
    setLoading(true);
    setError(null);
    try {
      const allHalls = await getAllActiveHalls();
      if (allHalls.data) {
        const filtered = allHalls.data.filter(hall => hall[amenity] === true);
        return { ...allHalls, data: filtered };
      }
      return allHalls;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to filter halls by amenity';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get halls by minimum capacity
  const getHallsByMinCapacity = async (minCapacity: number) => {
    setLoading(true);
    setError(null);
    try {
      const allHalls = await getAllActiveHalls();
      if (allHalls.data) {
        const filtered = allHalls.data.filter(hall => hall.capacity >= minCapacity);
        return { ...allHalls, data: filtered };
      }
      return allHalls;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to filter halls by capacity';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get hall statistics
  const getHallStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const allHalls = await getAllActiveHalls();
      if (allHalls.data) {
        const total = allHalls.data.length;
        const totalCapacity = allHalls.data.reduce((sum, hall) => sum + hall.capacity, 0);
        const avgCapacity = totalCapacity / total;
        const hallsWithProjector = allHalls.data.filter(h => h.hasProjector).length;
        const hallsWithAC = allHalls.data.filter(h => h.hasAc).length;
        const hallsWithWhiteboard = allHalls.data.filter(h => h.hasWhiteboard).length;
        
        return {
          total,
          totalCapacity,
          avgCapacity: Math.round(avgCapacity),
          hallsWithProjector,
          hallsWithAC,
          hallsWithWhiteboard,
          projectorPercentage: (hallsWithProjector / total) * 100,
          acPercentage: (hallsWithAC / total) * 100,
          whiteboardPercentage: (hallsWithWhiteboard / total) * 100,
        };
      }
      return null;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch hall statistics';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get hall by location
  const getHallsByLocation = async (location: string) => {
    setLoading(true);
    setError(null);
    try {
      const allHalls = await getAllActiveHalls();
      if (allHalls.data) {
        const filtered = allHalls.data.filter(hall =>
          hall.location.toLowerCase().includes(location.toLowerCase())
        );
        return { ...allHalls, data: filtered };
      }
      return allHalls;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to filter halls by location';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Export all functions
  return {
    loading,
    error,
    saveHall,
    updateHall,
    getHallById,
    getAllActiveHalls,
    searchHallByName,
    searchHallByCapacity,
    advancedSearch,
    getHallsByAmenity,
    getHallsByMinCapacity,
    getHallStats,
    getHallsByLocation,
  };
}