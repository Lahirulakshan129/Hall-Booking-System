export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  username: string;
  userId: string;
  status: number;
  roles: string[];
}

export interface Hall {
  id: string;
  name: string;
  location: string;
  capacity: number;
  hasProjector: boolean;
  hasAc: boolean;
  hasWhiteboard: boolean;
  status: boolean;
  description?: string;
}

export interface SaveHallRequest {
  name: string;
  location: string;
  capacity: number;
  hasProjector: boolean;
  hasAc: boolean;
  hasWhiteboard: boolean;
  description?: string; 
}

export interface UpdateHallRequest {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  hasProjector: boolean;
  hasAc: boolean;
  hasWhiteboard: boolean;
  status: boolean;
}

export interface Booking {
  id: string;
  reservedDate: string;
  startTime: string;
  endTime?: string;
  bookingFor: string;
  expectedParticipants: number;
  specialRequirements: string;
  hall: Hall;
  requestedBy: { userId: string };
  status: boolean;
  createdAt: string;
}

export interface CreateBookingRequest {
  reservedDate: string;
  startTime: string;
  bookingFor: string;
  expectedParticipants: number;
  specialRequirements: string;
  hall: { id: string };
  requestedBy: { userId: string };
  createdAt: string;
}

export interface UpdateBookingRequest {
  id: string;
  reservedDate: string;
  startTime: string;
  endTime: string;
  bookingFor: string;
  expectedParticipants: number;
  specialRequirements: string;
  hall: { id: string };
  requestedBy: { userId: string };
  createdAt: string;
}

export interface UpdateBookingStatusRequest {
  id: string;
  status: boolean;
  updatedAt: string;
}