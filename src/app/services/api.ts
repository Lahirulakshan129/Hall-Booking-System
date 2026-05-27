const BASE_URL = 'http://203.94.72.18/trainee/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Handle unauthorized error
      if (response.status === 401) {
        this.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  }

  // Auth
  async signIn(credentials: any) {
    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  }

  // Halls
  async saveHall(data: any) {
    const payload = {
      name: data.name,
      location: data.location,
      capacity: data.capacity,
      hasProjector: data.hasProjector,
      hasAc: data.hasAc,
      hasWhiteboard: data.hasWhiteboard,
      description: data.description || ""
    };
    return this.request('/production/hall/save', { 
      method: 'POST', 
      body: JSON.stringify(payload) 
    });
  }

  async updateHall(data: any) {
    const payload = {
      id: data.id,
      name: data.name,
      description: data.description || "",
      location: data.location,
      capacity: Number(data.capacity),
      hasProjector: Boolean(data.hasProjector),
      hasAc: Boolean(data.hasAc),
      hasWhiteboard: Boolean(data.hasWhiteboard),
      status: Boolean(data.status)
    };
    return this.request('/production/hall/update', { 
      method: 'POST', 
      body: JSON.stringify(payload) 
    });
  }

  async getHallById(hallId: string) {
    return this.request(`/production/hall/get/one/${hallId}`, { method: 'GET' });
  }

  async getAllActiveHalls() {
    return this.request('/production/hall/get/all/active', { method: 'GET' });
  }

  async searchHallByName(searchParam: string) {
    return this.request(`/production/hall/get/name/like/${searchParam}`, { method: 'GET' });
  }

  async searchHallByCapacity(seatCapacity: number) {
    return this.request(`/production/hall/get/capacity/less/equal/${seatCapacity}`, { method: 'GET' });
  }

  // Bookings
  async createBooking(data: any) {
    const payload = {
      reservedDate: data.reservedDate,
      startTime: data.startTime,
      endTime: data.endTime || data.startTime,
      bookingFor: data.bookingFor,
      expectedParticipants: Number(data.expectedParticipants),
      specialRequirements: data.specialRequirements || "",
      hall: { id: data.hall.id },
      requestedBy: { userId: data.requestedBy.userId },
      createdAt: data.createdAt || new Date().toISOString()
    };
    return this.request('/production/booking/save', { 
      method: 'POST', 
      body: JSON.stringify(payload) 
    });
  }

  async updateBooking(data: any) {
    return this.request('/production/booking/update', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
  }

  async updateBookingStatus(data: any) {
    return this.request('/production/booking/update/status', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
  }

  async getAllBookings() {
    return this.request('/production/booking/get/all/bookings', { method: 'GET' });
  }

  async getBookingById(bookingId: string) {
    return this.request(`/production/booking/get/one/${bookingId}`, { method: 'GET' });
  }
}

export const api = new ApiService();