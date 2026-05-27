'use client';

import { useState } from 'react';
import { api } from '../services/api';
import {
  CreateBookingRequest,
  UpdateBookingRequest,
  UpdateBookingStatusRequest,
  Booking,
  ApiResponse,
} from '@/types';

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new booking
  const createBooking = async (
    bookingData: CreateBookingRequest
  ): Promise<ApiResponse<Booking>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.createBooking(bookingData);
      return { data: response, status: 200, message: 'Success' };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing booking
  const updateBooking = async (
    bookingData: UpdateBookingRequest
  ): Promise<ApiResponse<Booking>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.updateBooking(bookingData);
      return { data: response, status: 200, message: 'Success' };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update booking status (verify/cancel)
  const updateBookingStatus = async (
    statusData: UpdateBookingStatusRequest
  ): Promise<ApiResponse<Booking>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.updateBookingStatus(statusData);
      return { data: response, status: 200, message: 'Success' };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update booking status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get all bookings
  const getAllBookings = async (): Promise<ApiResponse<Booking[]>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAllBookings();
      return { data: response, status: 200, message: 'Success' };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch bookings';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get booking by ID
  const getBookingById = async (bookingId: string): Promise<ApiResponse<Booking>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getBookingById(bookingId);
      return { data: response, status: 200, message: 'Success' };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch booking details';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get bookings by date range
  const getBookingsByDateRange = async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const allBookings = await getAllBookings();
      if (allBookings.data) {
        const filtered = allBookings.data.filter((booking: Booking) => {
          const bookingDate = new Date(booking.reservedDate);
          return bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate);
        });
        return { ...allBookings, data: filtered };
      }
      return allBookings;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to filter bookings';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get bookings by hall ID
  const getBookingsByHallId = async (hallId: string) => {
    setLoading(true);
    setError(null);
    try {
      const allBookings = await getAllBookings();
      if (allBookings.data) {
        const filtered = allBookings.data.filter(
          (booking: Booking) => booking.hall.id === hallId
        );
        return { ...allBookings, data: filtered };
      }
      return allBookings;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to filter bookings by hall';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get upcoming bookings
  const getUpcomingBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const allBookings = await getAllBookings();
      if (allBookings.data) {
        const today = new Date();
        const filtered = allBookings.data.filter(
          (booking: Booking) => new Date(booking.reservedDate) >= today && booking.status === true
        );
        return { ...allBookings, data: filtered };
      }
      return allBookings;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch upcoming bookings';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get past bookings
  const getPastBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const allBookings = await getAllBookings();
      if (allBookings.data) {
        const today = new Date();
        const filtered = allBookings.data.filter(
          (booking: Booking) => new Date(booking.reservedDate) < today
        );
        return { ...allBookings, data: filtered };
      }
      return allBookings;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch past bookings';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get cancelled bookings
  const getCancelledBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const allBookings = await getAllBookings();
      if (allBookings.data) {
        const filtered = allBookings.data.filter(
          (booking: Booking) => booking.status === false
        );
        return { ...allBookings, data: filtered };
      }
      return allBookings;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch cancelled bookings';
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
    createBooking,
    updateBooking,
    updateBookingStatus,
    getAllBookings,
    getBookingById,
    getBookingsByDateRange,
    getBookingsByHallId,
    getUpcomingBookings,
    getPastBookings,
    getCancelledBookings,
  };
}