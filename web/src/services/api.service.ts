// =============================================
// File: src/services/api.services.ts
// Purpose: Define API interaction functions using Axios
// =============================================

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './api.constants';
import {
  AuthResponse,
  ContactRequest,
  LoginRequest,
  User, // Make sure User type is imported and correctly defined
  ImageUserMetadata,
  Payment,
  PracticalSessionDTO, // Assuming Payment type is defined in api.types.ts
  // Add other necessary type imports here (e.g., Course, Event, Certification etc.)
} from './api.types';
import { getStoredToken, removeStoredToken } from '@/lib/utils'; // Adjust path as needed

// Create main API instance with interceptors
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json', // Removed to allow FormData uploads
  // },
  withCredentials: true, // Use if your backend relies on cookies/sessions AND CORS allows it
});

// Create publicApi as a separate axios instance for public endpoints
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json', // Removed to allow FormData uploads
  // },
  withCredentials: true, // Use if your backend relies on cookies/sessions AND CORS allows it
});

// Request Interceptor for the authenticated 'api' instance
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      // console.log('[API Interceptor] Token found, adding Authorization header.');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('[API Interceptor] No token found in storage.');
    }
    return config;
  },
  (error) => {
    console.error('[API Interceptor] Request error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('[API Interceptor] Response status:', error.response?.status);
    const originalRequest = error.config; // Potentially useful for retry logic

    if (error.response?.status === 401 && !originalRequest._retry) { // Prevent infinite loops
        console.warn('[API Interceptor] Received 401 Unauthorized. Removing token.');
        removeStoredToken();
        // Optionally redirect to login page
        // window.location.href = '/login'; // Example redirect
    } else if (error.response?.status === 403) {
       console.warn('[API Interceptor] Received 403 Forbidden.');
       // Optionally redirect to an 'unauthorized' page
       // window.location.href = '/unauthorized'; // Example redirect
    } else if (!error.response) {
      console.error('[API Interceptor] Network error or no response:', error.message);
    } else {
       console.error(`[API Interceptor] API Error ${error.response.status}:`, error.response.data ? JSON.stringify(error.response.data) : error.message);
    }
    // Reject with structured error if possible, otherwise the original error
    return Promise.reject(error.response?.data || error);
  }
);


// =============================================
// API Service Modules
// =============================================

export const AuthAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    console.log('[API Service] Attempting login...');
    const response = await publicApi.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    console.log('[API Service] Login successful.');
    return response.data;
  },
  register: (userData: any): Promise<AxiosResponse> =>
    publicApi.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  healthCheck: (): Promise<AxiosResponse> =>
    publicApi.get(API_ENDPOINTS.AUTH.HEALTH),
};

// --- ADDED UserAPI Module ---
export const UserAPI = {
  /**
   * Gets the full profile details for the currently authenticated user.
   * Assumes backend endpoint '/users/me' or similar exists.
   * @returns AxiosResponse containing the full User object.
   */
  getCurrentUserProfile: (): Promise<AxiosResponse<User>> => {
    console.log('[API Service] Getting current user profile...');
    return api.get<User>('/users/me');
  },

  /**
   * Updates the profile information for the currently authenticated user.
   * Sends only the fields provided in profileData (Partial Update).
   * @param profileData Partial User object with fields to update (e.g., { firstName: 'New', lastName: 'Name' }).
   * @param authUser The authenticated user object.
   * @returns AxiosResponse containing the updated User object.
   */
  updateUserProfile: (profileData: Partial<User>, authUser: User): Promise<AxiosResponse<User>> => {
    console.log('[API Service] Updating user profile...');
    // Get the current user's ID from the auth context
    const token = getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const userId = authUser.userId || authUser.id;
    if (!userId) {
      throw new Error('User ID not found in auth context');
    }
    
    // Create a complete user object with all required fields from the User interface
    const completeUserData = {
      id: authUser.id,
      userId: authUser.userId,
      email: authUser.email,
      username: authUser.username,
      firstName: profileData.firstName || authUser.firstName,
      lastName: profileData.lastName || authUser.lastName,
      roles: authUser.roles,
      avatarUrl: authUser.avatarUrl,
      password: "NO_CHANGE" // Add a default password that backend will recognize as "no change"
    };
    
    // Use the correct endpoint that matches the backend
    return api.put<User>(`/users/${userId}`, completeUserData);
  },

  /**
   * Changes the password for the currently authenticated user.
   * @param passwordData Object containing oldPassword and newPassword.
   * @returns AxiosResponse (often empty body on success).
   */
  changePassword: (passwordData: { oldPassword: string; newPassword: string }): Promise<AxiosResponse<void | { message?: string; error?: string }>> => {
    console.log('[API Service] UserAPI.changePassword attempting to change password via:', API_ENDPOINTS.USERS.CHANGE_CURRENT_USER_PASSWORD);
    const token = getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return api.put<void | { message?: string; error?: string }>(
      API_ENDPOINTS.USERS.CHANGE_CURRENT_USER_PASSWORD,
      passwordData,
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } 
      }
    );
  },
};
// --- END UserAPI Module ---


export const CertificationAPI = {
  create: (userId: number, courseId: number, issueDate: string, expiryDate?: string): Promise<AxiosResponse> =>
    api.post(API_ENDPOINTS.CERTIFICATIONS.BASE, null, { params: { userId, courseId, issueDate, expiryDate } }),
  getById: (id: number): Promise<AxiosResponse> => api.get(`${API_ENDPOINTS.CERTIFICATIONS.BASE}/${id}`),
  getByCode: (code: string): Promise<AxiosResponse> => api.get(API_ENDPOINTS.CERTIFICATIONS.BY_CODE(code)),
  getByUser: (userId: number): Promise<AxiosResponse> => api.get(API_ENDPOINTS.CERTIFICATIONS.BY_USER(userId)),
  getByCourse: (courseId: number): Promise<AxiosResponse> => api.get(API_ENDPOINTS.CERTIFICATIONS.BY_COURSE(courseId)),
  getByStatus: (status: string): Promise<AxiosResponse> => api.get(API_ENDPOINTS.CERTIFICATIONS.BY_STATUS(status)),
  getMyCertifications: (): Promise<AxiosResponse> => api.get(API_ENDPOINTS.CERTIFICATIONS.MY_CERTIFICATIONS),
  updateStatus: (id: number, status: string): Promise<AxiosResponse> =>
    api.put(API_ENDPOINTS.CERTIFICATIONS.UPDATE_STATUS(id), null, { params: { status } }),
  renew: (id: number, newExpiryDate: string): Promise<AxiosResponse> =>
    api.put(API_ENDPOINTS.CERTIFICATIONS.RENEW(id), null, { params: { newExpiryDate } }),
  revoke: (id: number): Promise<AxiosResponse> => api.put(API_ENDPOINTS.CERTIFICATIONS.REVOKE(id)),
  verify: (code: string): Promise<AxiosResponse> => api.get(API_ENDPOINTS.CERTIFICATIONS.VERIFY(code)),
  generateCode: (): Promise<AxiosResponse> => api.get(API_ENDPOINTS.CERTIFICATIONS.GENERATE_CODE),
  delete: (id: number): Promise<AxiosResponse> => api.delete(`${API_ENDPOINTS.CERTIFICATIONS.BASE}/${id}`),
};

export const PracticalSessionAPI = {
  getUpcomingPracticalSessionsForUser: () => {
    return api.get('/practical-sessions/upcoming');
  },
  
  getPracticalSessionById: (id: number) => {
    return api.get(`/practical-sessions/${id}`);
  },
  
  getPracticalSessionsByCourse: (courseId: number) => {
    return api.get(`/practical-sessions/course/${courseId}`);
  },
  
  registerForSession: (sessionId: number) => {
    return api.post(`/practical-sessions/${sessionId}/register`);
  },
  
  cancelRegistration: (sessionId: number) => {
    return api.delete(`/practical-sessions/${sessionId}/register`);
  }
};

export const CompanyAPI = {
  create: (companyData: any): Promise<AxiosResponse> => api.post(API_ENDPOINTS.COMPANIES.BASE, companyData),
  getAll: (): Promise<AxiosResponse> => api.get(API_ENDPOINTS.COMPANIES.BASE),
  getById: (id: number): Promise<AxiosResponse> => api.get(`${API_ENDPOINTS.COMPANIES.BASE}/${id}`),
  getByCity: (city: string): Promise<AxiosResponse> => api.get(API_ENDPOINTS.COMPANIES.BY_CITY(city)),
  search: (name: string): Promise<AxiosResponse> => api.get(API_ENDPOINTS.COMPANIES.SEARCH, { params: { name } }),
  getMyCompany: (): Promise<AxiosResponse> => api.get(API_ENDPOINTS.COMPANIES.MY_COMPANY),
  update: (id: number, companyData: any): Promise<AxiosResponse> => api.put(`${API_ENDPOINTS.COMPANIES.BASE}/${id}`, companyData),
  delete: (id: number): Promise<AxiosResponse> => api.delete(`${API_ENDPOINTS.COMPANIES.BASE}/${id}`),
};

export const CourseAPI = {
  create: (courseData: any): Promise<AxiosResponse> => api.post(API_ENDPOINTS.COURSES.BASE, courseData),
  getAll: (): Promise<AxiosResponse> => api.get(API_ENDPOINTS.COURSES.BASE),
  getById: (id: number): Promise<AxiosResponse> => api.get(`${API_ENDPOINTS.COURSES.BASE}/${id}`),
  getByCategory: (category: string): Promise<AxiosResponse> => api.get(API_ENDPOINTS.COURSES.BY_CATEGORY(category)),
  getByMode: (mode: string): Promise<AxiosResponse> => api.get(API_ENDPOINTS.COURSES.BY_MODE(mode)),
  getByInstructor: (instructorId: number): Promise<AxiosResponse> => api.get(API_ENDPOINTS.COURSES.BY_INSTRUCTOR(instructorId)),
  search: (title: string): Promise<AxiosResponse> => api.get(API_ENDPOINTS.COURSES.SEARCH, { params: { title } }),
  getByCertificationEligible: (eligible: boolean): Promise<AxiosResponse> =>
    api.get(API_ENDPOINTS.COURSES.CERTIFICATION_ELIGIBLE(eligible)),
  getByMaxPrice: (maxPrice: number): Promise<AxiosResponse> => api.get(API_ENDPOINTS.COURSES.MAX_PRICE(maxPrice)),
  update: (id: number, courseData: any): Promise<AxiosResponse> => api.put(`${API_ENDPOINTS.COURSES.BASE}/${id}`, courseData),
  addInstructor: (courseId: number, instructorId: number): Promise<AxiosResponse> =>
    api.post(API_ENDPOINTS.COURSES.INSTRUCTOR(courseId, instructorId)),
  removeInstructor: (courseId: number, instructorId: number): Promise<AxiosResponse> =>
    api.delete(API_ENDPOINTS.COURSES.INSTRUCTOR(courseId, instructorId)),
  setInstructors: (courseId: number, instructorIds: number[]): Promise<AxiosResponse> =>
    api.put(API_ENDPOINTS.COURSES.INSTRUCTORS(courseId), instructorIds),
  delete: (id: number): Promise<AxiosResponse> => api.delete(`${API_ENDPOINTS.COURSES.BASE}/${id}`),
};

export const EventAPI = {
  // 1. create: Backend expects companyId as @RequestParam, eventData as @RequestBody
  create: (eventData: any, companyId: number): Promise<AxiosResponse> =>
    api.post(API_ENDPOINTS.EVENTS.BASE, eventData, { params: { companyId } }), // Correct structure

  // 2. getAll: Correct
  getAll: (): Promise<AxiosResponse> => api.get(API_ENDPOINTS.EVENTS.BASE),

  // 3. getById: Correct
  getById: (id: number): Promise<AxiosResponse> => api.get(`${API_ENDPOINTS.EVENTS.BASE}/${id}`),

  // 4. getByCompany: Correct
  getByCompany: (companyId: number): Promise<AxiosResponse> => api.get(API_ENDPOINTS.EVENTS.BY_COMPANY(companyId)),

  // 5. getUpcoming: Correct
  getUpcoming: (): Promise<AxiosResponse> => api.get(API_ENDPOINTS.EVENTS.UPCOMING),

  // 6. getWithOpenRegistration: Correct
  getWithOpenRegistration: (): Promise<AxiosResponse> => api.get(API_ENDPOINTS.EVENTS.OPEN_REGISTRATION),

  // 7. search: Correct (backend EventController uses @RequestParam String title)
  search: (title: string): Promise<AxiosResponse> => api.get(API_ENDPOINTS.EVENTS.SEARCH, { params: { title } }),

  // 8. getByDateRange: Correct (backend uses @RequestParam for startDate, endDate)
  getByDateRange: (startDate: string, endDate: string): Promise<AxiosResponse> =>
    api.get(API_ENDPOINTS.EVENTS.BY_DATE_RANGE, { params: { startDate, endDate } }),

  // 9. update: Correct
  update: (id: number, eventData: any): Promise<AxiosResponse> => api.put(`${API_ENDPOINTS.EVENTS.BASE}/${id}`, eventData),

  // 10. incrementParticipants: Correct
  incrementParticipants: (id: number): Promise<AxiosResponse> => api.post(API_ENDPOINTS.EVENTS.INCREMENT_PARTICIPANTS(id)),

  // 11. decrementParticipants: Correct
  decrementParticipants: (id: number): Promise<AxiosResponse> => api.post(API_ENDPOINTS.EVENTS.DECREMENT_PARTICIPANTS(id)),

  // 12. checkIfFull: Correct
  checkIfFull: (id: number): Promise<AxiosResponse> => api.get(API_ENDPOINTS.EVENTS.IS_FULL(id)),

  // 13. delete: Correct
  delete: (id: number): Promise<AxiosResponse> => api.delete(`${API_ENDPOINTS.EVENTS.BASE}/${id}`),
};

export const EventRegistrationAPI = {
  create: (eventId: number): Promise<AxiosResponse> => api.post(API_ENDPOINTS.EVENT_REGISTRATIONS.BASE, { eventId }), // Simplified, assuming backend gets userId from token
  getAll: (): Promise<AxiosResponse> => api.get(API_ENDPOINTS.EVENT_REGISTRATIONS.BASE),
  getById: (id: number): Promise<AxiosResponse> => api.get(`${API_ENDPOINTS.EVENT_REGISTRATIONS.BASE}/${id}`),
  getByUser: (userId: number): Promise<AxiosResponse> => api.get(API_ENDPOINTS.EVENT_REGISTRATIONS.BY_USER(userId)), // Maybe use '/me' if applicable
  getByEvent: (eventId: number): Promise<AxiosResponse> => api.get(API_ENDPOINTS.EVENT_REGISTRATIONS.BY_EVENT(eventId)),
  markAttendance: (id: number, attended: boolean): Promise<AxiosResponse> =>
    api.put(API_ENDPOINTS.EVENT_REGISTRATIONS.ATTENDANCE(id), { attended }),
  cancel: (id: number): Promise<AxiosResponse> => api.delete(`${API_ENDPOINTS.EVENT_REGISTRATIONS.BASE}/${id}`),
};

export const InstructorAPI = {
  create: (instructorData: any, userId: number): Promise<AxiosResponse> =>
    api.post(API_ENDPOINTS.INSTRUCTORS.BASE, instructorData, { params: { userId } }),
  getAll: (): Promise<AxiosResponse> => api.get(API_ENDPOINTS.INSTRUCTORS.BASE),
  getById: (id: number): Promise<AxiosResponse> => api.get(`${API_ENDPOINTS.INSTRUCTORS.BASE}/${id}`),
  getByUser: (userId: number): Promise<AxiosResponse> => api.get(API_ENDPOINTS.INSTRUCTORS.BY_USER(userId)),
  getByExpertise: (expertise: string): Promise<AxiosResponse> => api.get(API_ENDPOINTS.INSTRUCTORS.BY_EXPERTISE(expertise)),
  getByMinRating: (minRating: number): Promise<AxiosResponse> => api.get(API_ENDPOINTS.INSTRUCTORS.BY_MIN_RATING(minRating)),
  getCurrent: (): Promise<AxiosResponse> => api.get(API_ENDPOINTS.INSTRUCTORS.ME),
  update: (id: number, instructorData: any): Promise<AxiosResponse> => api.put(`${API_ENDPOINTS.INSTRUCTORS.BASE}/${id}`, instructorData),
  updateRating: (id: number): Promise<AxiosResponse> => api.put(API_ENDPOINTS.INSTRUCTORS.UPDATE_RATING(id)),
  delete: (id: number): Promise<AxiosResponse> => api.delete(`${API_ENDPOINTS.INSTRUCTORS.BASE}/${id}`),
};

// --- Corrected PaymentAPI Module (Including fix for BASE constant) ---
export const PaymentAPI = {
  /**
   * Initiates payment for a specific course. Matches POST /course/{courseId}
   * @param courseId The ID of the course.
   * @returns AxiosResponse containing the created Payment object.
   */
  initiateCoursePayment: (courseId: number): Promise<AxiosResponse<Payment>> => {
     console.log(`[API Service] Initiating payment for course ${courseId}...`);
     return api.post<Payment>(API_ENDPOINTS.PAYMENTS.COURSE(courseId));
   },

  /**
   * Initiates payment for a specific event. Matches POST /event/{eventId}
   * @param eventId The ID of the event.
   * @returns AxiosResponse containing the created Payment object.
   */
  initiateEventPayment: (eventId: number): Promise<AxiosResponse<Payment>> => {
    console.log(`[API Service] Initiating payment for event ${eventId}...`);
    return api.post<Payment>(API_ENDPOINTS.PAYMENTS.EVENT(eventId));
  },

  /**
   * Gets all payments for the currently authenticated user. Matches GET /user
   * @returns AxiosResponse containing a list of Payment objects.
   */
  getUserPayments: (): Promise<AxiosResponse<Payment[]>> => {
    console.log(`[API Service] Getting payments for current user...`);
    return api.get<Payment[]>(API_ENDPOINTS.PAYMENTS.USER);
  },

  /**
   * Gets a specific payment by its ID. Matches GET /payments/{id}
   * Uses the BASE endpoint defined in constants.
   * @param id The ID of the payment.
   * @returns AxiosResponse containing the Payment object.
   */
  getById: (id: number): Promise<AxiosResponse<Payment>> => {
    console.log(`[API Service] Getting payment by ID: ${id}...`);
    return api.get<Payment>(`${API_ENDPOINTS.PAYMENTS.BASE}/${id}`); // Uses the fixed BASE constant
  },

  /**
   * Verifies a payment using a token. Matches GET /verify/{token}
   * @param token The verification token.
   * @returns AxiosResponse containing a map like { success: boolean }.
   */
  verify: (token: string): Promise<AxiosResponse<{ success: boolean }>> => {
    console.log(`[API Service] Verifying payment with token: ${token}...`);
    return publicApi.get<{ success: boolean }>(API_ENDPOINTS.PAYMENTS.VERIFY(token));
  },

  /**
   * Initiates a refund for a specific payment (Admin only). Matches POST /payments/{id}/refund
   * @param id The ID of the payment to refund.
   * @returns AxiosResponse containing a map like { success: boolean }.
   */
  refund: (id: number): Promise<AxiosResponse<{ success: boolean }>> => {
    console.log(`[API Service] Requesting refund for payment ID: ${id}...`);
    return api.post<{ success: boolean }>(API_ENDPOINTS.PAYMENTS.REFUND(id));
  },

  /**
   * Handles the callback from the payment gateway. Matches GET /callback
   * @param token The token returned by the gateway.
   * @param status The status returned by the gateway.
   * @returns AxiosResponse containing a success/failure message string.
   */
  handleCallback: (token: string, status: string): Promise<AxiosResponse<string>> => {
    console.log(`[API Service] Handling payment callback for token: ${token}, status: ${status}...`);
    return publicApi.get<string>(API_ENDPOINTS.PAYMENTS.CALLBACK, { params: { token, status } });
  },
};
// --- END PaymentAPI Module ---


export const EnrollmentAPI = {
  create: (courseId: number): Promise<AxiosResponse> => api.post(API_ENDPOINTS.ENROLLMENTS.BASE, null, { params: { courseId } }),
  createWithPayment: (courseId: number, paymentId: number): Promise<AxiosResponse> =>
    api.post(API_ENDPOINTS.ENROLLMENTS.WITH_PAYMENT, null, { params: { courseId, paymentId } }),
  getById: (id: number): Promise<AxiosResponse> => api.get(`${API_ENDPOINTS.ENROLLMENTS.BASE}/${id}`),
  getByUser: (): Promise<AxiosResponse> => api.get(API_ENDPOINTS.ENROLLMENTS.USER), // Assuming backend gets user from token
  getByCourse: (courseId: number): Promise<AxiosResponse> => api.get(API_ENDPOINTS.ENROLLMENTS.COURSE(courseId)),
  getByStatus: (status: string): Promise<AxiosResponse> => api.get(API_ENDPOINTS.ENROLLMENTS.STATUS(status)),
  getByUserAndStatus: (status: string): Promise<AxiosResponse> => api.get(API_ENDPOINTS.ENROLLMENTS.USER_STATUS(status)),
  updateStatus: (id: number, status: string): Promise<AxiosResponse> =>
    api.put(API_ENDPOINTS.ENROLLMENTS.UPDATE_STATUS(id), null, { params: { status } }),
  complete: (id: number, completionDate?: string): Promise<AxiosResponse> =>
    api.put(API_ENDPOINTS.ENROLLMENTS.COMPLETE(id), null, { params: { completionDate } }),
  addPayment: (id: number, paymentId: number): Promise<AxiosResponse> =>
    api.put(API_ENDPOINTS.ENROLLMENTS.PAYMENT(id, paymentId)),
  delete: (id: number): Promise<AxiosResponse> => api.delete(`${API_ENDPOINTS.ENROLLMENTS.BASE}/${id}`),
};

export const DatabaseAPI = {
  getInfo: (): Promise<AxiosResponse> => publicApi.get(API_ENDPOINTS.DATABASE.INFO),
  getTables: (): Promise<AxiosResponse> => publicApi.get(API_ENDPOINTS.DATABASE.TABLES),
  getSequences: (): Promise<AxiosResponse> => publicApi.get(API_ENDPOINTS.DATABASE.SEQUENCES),
  getOracleSequences: (): Promise<AxiosResponse> => publicApi.get(API_ENDPOINTS.DATABASE.ORACLE_SEQUENCES),
};

// --- ADDED IMAGE USER API MODULE ---
export const ImageUserAPI = {
  /**
   * Uploads an image file for a specific user.
   * Requires explicit userId based on backend controller.
   * @param file The image File object from an input element.
   * @param userId The ID of the user to associate the image with.
   * @returns AxiosResponse potentially containing location header or ID.
   */
  uploadImage: (file: File, userId: number): Promise<AxiosResponse<void>> => {
    if (typeof userId !== "number" || isNaN(userId)) {
      throw new Error("Invalid userId provided to uploadImage");
    }
    if (!file) {
      throw new Error("No file provided to uploadImage");
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString()); // Backend expects 'userId' as request param

    console.log(`[API Service] Uploading image for user ${userId}...`);
    // Axios handles Content-Type for FormData automatically
    return api.post<void>(API_ENDPOINTS.IMAGE_USERS.BASE, formData);
  },

  /**
   * Gets the metadata for a specific image by its ID.
   * @param id The ID of the image record.
   * @returns AxiosResponse containing ImageUserMetadata.
   */
  getImageMetadata: (id: number): Promise<AxiosResponse<ImageUserMetadata>> => {
    console.log(`[API Service] Getting image metadata for ID: ${id}`);
    return api.get<ImageUserMetadata>(API_ENDPOINTS.IMAGE_USERS.BY_ID(id));
  },

  /**
   * Gets the raw image data as a Blob by image ID.
   * Use URL.createObjectURL(response.data) to display in <img> tag.
   * Remember to URL.revokeObjectURL() for cleanup.
   * @param id The ID of the image record.
   * @returns AxiosResponse containing the image Blob.
   */
  getImageData: (id: number): Promise<AxiosResponse<Blob>> => {
    console.log(`[API Service] Getting image data blob for ID: ${id}`);
    return api.get<Blob>(API_ENDPOINTS.IMAGE_USERS.IMAGE_DATA(id), {
      responseType: 'blob', // Important: Tell Axios to expect binary data
    });
  },

  /**
   * Gets all image metadata associated with a specific user ID.
   * @param userId The ID of the user.
   * @returns AxiosResponse containing an array of ImageUserMetadata.
   */
  getImagesForUser: (userId: number): Promise<AxiosResponse<ImageUserMetadata[]>> => {
    console.log(`[API Service] Getting all image metadata for user ID: ${userId}`);
    return api.get<ImageUserMetadata[]>(API_ENDPOINTS.IMAGE_USERS.BY_USER(userId));
  },

  /**
   * Deletes a specific image by its ID.
   * @param id The ID of the image record to delete.
   * @returns AxiosResponse (typically 204 No Content on success).
   */
  deleteImage: (id: number): Promise<AxiosResponse<void>> => {
    console.log(`[API Service] Deleting image with ID: ${id}`);
    return api.delete<void>(API_ENDPOINTS.IMAGE_USERS.BY_ID(id));
  },
};
// --- END IMAGE USER API MODULE ---


// =============================================
// Legacy/Utility Functions (keep if used, but prefer module approach)
// =============================================

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  console.warn('[API Service] Using legacy login function. Consider using AuthAPI.login.');
  return AuthAPI.login(credentials);
};

export const register = async (userData: any): Promise<AxiosResponse> => {
  console.warn('[API Service] Using legacy register function. Consider using AuthAPI.register.');
  return AuthAPI.register(userData);
};

// This legacy function might fetch less data than UserAPI.getCurrentUserProfile
export const getCurrentUser = async (): Promise<User> => {
  console.warn('[API Service] Using legacy getCurrentUser. Consider UserAPI.getCurrentUserProfile for full details.');
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const submitContactForm = async (contactData: ContactRequest): Promise<any> => {
  console.log('[API Service] Submitting contact form...');
  const response = await publicApi.post(API_ENDPOINTS.CONTACT.SUBMIT, contactData);
  return response.data;
};

// Export the public API instance if needed elsewhere for direct use
export { publicApi };
