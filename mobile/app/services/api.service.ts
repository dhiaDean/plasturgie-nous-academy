import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS } from './api.constants'; // MODIFIED: Using your provided API_ENDPOINTS
import type {
    AuthRequest, AuthResponse, User, RegisterRequest, Company, Course, Service, Event, Enrollment, Certification, Payment, Review,PracticalSession, ApiError,
    UserProfileUpdate // MODIFIED: Added UserProfileUpdate to imports
} from './api.types';

const TOKEN_STORAGE_KEY = 'auth_token_key';

class ApiService {
  private token: string | null = null;

  async loadTokenFromStorage() {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        this.token = storedToken;
      } catch (e) {
          console.error("ApiService: Failed to load token from storage", e);
          this.token = null;
      }
  }

  setToken(token: string | null) {
    this.token = token;
    console.log('ApiService: Token set in memory:', !!token);
  }

  clearToken() {
    this.token = null;
    console.log('ApiService: Token cleared from memory');
  }

  getToken(): string | null {
      return this.token;
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    console.log(`ApiService Request: ${options.method || 'GET'} ${url}`);

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        });

        if (response.status === 204) {
             console.log(`ApiService Response: ${response.status} No Content`);
             return null as T;
        }

        let responseData: any;
        try {
             responseData = await response.json();
        } catch (e) {
             if (!response.ok) {
                 throw {
                     response: { status: response.status },
                     message: response.statusText || `HTTP error ${response.status}`
                 };
             }
             console.warn(`ApiService Warning: Could not parse JSON for OK response (${response.status}) from ${url}`);
             return null as T;
        }

        if (!response.ok) {
            const errorPayload: ApiError = {
                message: responseData?.message || responseData?.error || `HTTP error! status: ${response.status}`,
                status: response.status,
                details: responseData?.details || responseData,
            };
            console.error('ApiService Error Response:', errorPayload);
            throw { response: { data: errorPayload, status: response.status }, message: errorPayload.message };
        }
        return responseData as T;

    } catch (error: any) {
        console.error('ApiService Fetch/Network Error:', error);
        if (error.response?.data) {
            throw error;
        } else if (error instanceof Error) {
             throw { response: { data: { message: error.message } }, message: error.message };
        } else {
             throw { response: { data: { message: 'An unknown network error occurred' } }, message: 'An unknown network error occurred' };
        }
    }
  }

  // --- Auth ---
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterRequest): Promise<void> {
    await this.request<void>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<User> {
    // MODIFIED: Using API_ENDPOINTS.AUTH.CURRENT_USER as defined in your api.constants.ts
    return this.request<User>(API_ENDPOINTS.AUTH.CURRENT_USER, { method: 'GET' });
  }

  // --- NEW METHOD: updateMyProfile ---
  // This method sends a PUT request to update the current user's profile.
  // It uses the same endpoint as getCurrentUser (API_ENDPOINTS.AUTH.CURRENT_USER) but with the PUT HTTP method.
  // It takes a UserProfileUpdate object as payload.
  // It expects the backend to return the updated User object.
  async updateMyProfile(payload: UserProfileUpdate): Promise<User> {
    // MODIFIED: Using API_ENDPOINTS.AUTH.CURRENT_USER for the PUT request to update the profile
    return this.request<User>(API_ENDPOINTS.AUTH.CURRENT_USER, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async logout(): Promise<void> {
    try {
        // MODIFIED: Using API_ENDPOINTS.AUTH.LOGOUT as defined in your api.constants.ts
        await this.request<void>(API_ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST'
        });
    } catch (error: any) {
        console.warn("Server logout API call failed (status: " + error?.response?.status + "):", error.message);
    } finally {
        this.clearToken();
    }
  }

  // --- Company ---
  async getCompanies(): Promise<Company[]> {
    // MODIFIED: Using API_ENDPOINTS.COMPANIES.BASE as defined in your api.constants.ts
    return this.request<Company[]>(API_ENDPOINTS.COMPANIES.BASE);
  }

  async searchCompanies(query: string): Promise<Company[]> {
    // MODIFIED: Using API_ENDPOINTS.COMPANIES.SEARCH as defined in your api.constants.ts
    return this.request<Company[]>(`${API_ENDPOINTS.COMPANIES.SEARCH}?query=${encodeURIComponent(query)}`);
  }

  async getCompaniesByCity(city: string): Promise<Company[]> {
    // MODIFIED: Using API_ENDPOINTS.COMPANIES.BY_CITY as defined in your api.constants.ts
    return this.request<Company[]>(`${API_ENDPOINTS.COMPANIES.BY_CITY}?city=${encodeURIComponent(city)}`);
  }

  // --- Roles (Client-side list) ---
  async getRoles(): Promise<string[]> {
    return ["ROLE_LEARNER", "ROLE_INSTRUCTOR", "ROLE_ADMIN", "ROLE_COMPANY_REP"];
  }

  // --- Services ---
  async getServices(): Promise<Service[]> {
    // MODIFIED: Using API_ENDPOINTS.SERVICES.BASE as defined in your api.constants.ts
    return this.request<Service[]>(API_ENDPOINTS.SERVICES.BASE);
  }

  // --- Courses ---
  async getCourses(): Promise<Course[]> {
    // MODIFIED: Using API_ENDPOINTS.COURSES.BASE as defined in your api.constants.ts
    return this.request<Course[]>(API_ENDPOINTS.COURSES.BASE);
  }

  async getCourseById(courseId: number | string): Promise<Course> {
    // MODIFIED: Using API_ENDPOINTS.COURSES.BY_ID as defined in your api.constants.ts
    const endpoint = API_ENDPOINTS.COURSES.BY_ID(courseId);
    return this.request<Course>(endpoint);
  }

  // --- Events ---
  async getEvents(): Promise<Event[]> {
    // MODIFIED: Using API_ENDPOINTS.EVENTS.BASE as defined in your api.constants.ts
    return this.request<Event[]>(API_ENDPOINTS.EVENTS.BASE);
  }

  // --- User Specific Data (Examples) ---
  async getUserEnrollments(): Promise<Enrollment[]> {
    // MODIFIED: Using API_ENDPOINTS.ENROLLMENTS.ME as defined in your api.constants.ts
    const endpoint = API_ENDPOINTS.ENROLLMENTS.ME;
    return this.request<Enrollment[]>(endpoint);
  }

  async getUserCertifications(): Promise<Certification[]> {
    // MODIFIED: Using API_ENDPOINTS.CERTIFICATIONS.ME as defined in your api.constants.ts
    const endpoint = API_ENDPOINTS.CERTIFICATIONS.ME;
    return this.request<Certification[]>(endpoint);
  }

   async getUserPayments(): Promise<Payment[]> {
    // MODIFIED: Using API_ENDPOINTS.PAYMENTS.ME as defined in your api.constants.ts
    const endpoint = API_ENDPOINTS.PAYMENTS.ME;
    return this.request<Payment[]>(endpoint);
  }

   async getUserReviews(): Promise<Review[]> {
    // MODIFIED: Using API_ENDPOINTS.REVIEWS.ME as defined in your api.constants.ts
    const endpoint = API_ENDPOINTS.REVIEWS.ME;
    return this.request<Review[]>(endpoint);
  }

  // --- NEW: Practical Sessions Method ---
  async getMyPracticalSessions(): Promise<PracticalSession[]> {
    const endpoint = API_ENDPOINTS.PRACTICAL_SESSIONS.ME;
    return this.request<PracticalSession[]>(endpoint, {
        method: 'GET',
    });
  }
  // --- END NEW ---
}

export const apiService = new ApiService();
