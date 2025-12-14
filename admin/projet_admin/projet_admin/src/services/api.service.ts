// =============================================
// File: src/services/api.services.ts
// Purpose: Define API interaction functions using Axios
// =============================================

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './api.constants';
import {
  AuthResponse,
  ContactFormRequest,
  LoginRequest,
  UserResponseDTO, // Changed from User
  UserProfile, // Import UserProfile
  ImageMetadataDTO, // Changed from ImageUserMetadata
  PaymentDTO, // Changed from Payment
  InstructorListDTO,
  UserListDTO,
  CourseListDTO,
  UserCreationRequestDTO, // Added for register
  UserUpdateRequestDTO, // Added for updateUser
  UserProfileUpdateRequestDTO, // Added for user profile update
  InstructorInputDTO, // Added
  CourseListDTO as Course, // Alias CourseListDTO as Course for deprecated methods
  CourseDetailResponseDTO, // Changed from CourseDetail
  InstructorResponseDTO as Instructor, // Alias InstructorResponseDTO as Instructor
  EnrollmentDTO, // Changed from Enrollment
  CertificationDTO, // Added back as DTO
  CompanyDTO, // Added back as DTO
  CompanyCreateRequest, // Import CompanyCreateRequest
  DatabaseInfo,
  EventDTO, // Added back as DTO
  EventRegistrationDTO, // Added back as DTO
  Role,
  InstructorResponseDTO,
  AdminStatsResponse, // Added
  InstructorStatsResponse, // Added
  CertificationCreateRequest,
  UserRoleUpdateRequestDTO,
  PracticalSessionDTO, // Add PracticalSessionDTO
  PracticalSessionInputDTO, // Add PracticalSessionInputDTO
  CreatedModuleResponse, // Add CreatedModuleResponse
  ModuleCreationPayload,
  Module // Import Module type
} from './api.types'; // Ensure ALL these types are correctly defined and exported
import { getStoredToken, removeStoredToken } from '@/lib/utils';
// import { PracticalSessionAPI } from './practicalSession.service'; // Remove this import

// --- Axios Instances ---
// In api.service.ts
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // Default Content-Type is removed here; it will be set per request or by Axios for FormData
  withCredentials : true,
});


export const ModuleAPI = {
  /**
   * Creates a new module for a specific course.
   * POST /api/courses/{courseId}/modules
   */
  create: async (
    courseId: number,
    moduleDetails: Omit<ModuleCreationPayload, 'courseId'>,
    pdfFile: File | null,
    videoFile: File | null
  ): Promise<CreatedModuleResponse> => {
    const formData = new FormData();
    const fullModuleDetails: ModuleCreationPayload = {
      ...moduleDetails,
      courseId: courseId, // Including for payload consistency, backend can validate against path
    };

    formData.append(
      "moduleData",
      new Blob([JSON.stringify(fullModuleDetails)], { type: "application/json" })
    );

    if (pdfFile) {
      formData.append("pdfFile", pdfFile, pdfFile.name); // Good practice to include filename
    }
    if (videoFile) {
      formData.append("videoFile", videoFile, videoFile.name); // Good practice to include filename
    }

    const endpoint = API_ENDPOINTS.MODULES.BASE(courseId);
    console.log(`[ModuleAPI.create] Sending POST request to: ${endpoint}`);

    try {
      const response = await api.post<CreatedModuleResponse>(endpoint, formData);
      return response.data;
    } catch (error: any) {
      const message = error?.message || "Failed to create module";
      console.error(`[ModuleAPI.create] Error for course ${courseId}: ${message}`, error.response?.data, error);
      throw new Error(error.response?.data?.message || message);
    }
  },

  /**
   * Retrieves all modules for a specific course.
   * GET /api/courses/{courseId}/modules
   */
  getAllByCourseId: async (courseId: number): Promise<Module[]> => {
    const endpoint = API_ENDPOINTS.MODULES.BASE(courseId);
    console.log(`[ModuleAPI.getAllByCourseId] Sending GET request to: ${endpoint}`);
    try {
      const response = await api.get<Module[]>(endpoint);
      return response.data;
    } catch (error: any) {
      const message = error?.message || "Failed to fetch modules for course";
      console.error(`[ModuleAPI.getAllByCourseId] Error for course ${courseId}: ${message}`, error.response?.data, error);
      throw new Error(error.response?.data?.message || message);
    }
  },

  /**
   * Retrieves a specific module by its ID, under a specific course.
   * GET /api/courses/{courseId}/modules/{moduleId}
   */
  getModuleById: async (courseId: number, moduleId: number): Promise<Module> => {
    const endpoint = API_ENDPOINTS.MODULES.BY_ID(courseId, moduleId);
    console.log(`[ModuleAPI.getModuleById] Sending GET request to: ${endpoint}`);
    try {
      const response = await api.get<Module>(endpoint);
      return response.data;
    } catch (error: any) {
      const message = error?.message || "Failed to fetch module details";
      console.error(`[ModuleAPI.getModuleById] Error for course ${courseId}, module ${moduleId}: ${message}`, error.response?.data, error);
      throw new Error(error.response?.data?.message || message);
    }
  },

  /**
   * Updates an existing module.
   * PUT /api/courses/{courseId}/modules/{moduleId}
   */
  update: async (
    courseId: number, // <<<< CORRECTED: courseId is required
    moduleId: number,
    moduleDetails: Partial<Omit<ModuleCreationPayload, 'courseId'>>, // Use a specific ModuleUpdatePayload if fields differ
    pdfFile: File | null,
    videoFile: File | null
  ): Promise<Module> => { // Assuming update returns the updated Module (adjust if it's CreatedModuleResponse or void)
    const formData = new FormData();
    const fullModuleDetailsUpdate: Partial<ModuleCreationPayload> = {
      ...moduleDetails,
      courseId: courseId, // Include for consistency, backend should validate path courseId vs payload courseId
    };

    // Only append moduleData if there are actual textual details to update
    if (Object.keys(moduleDetails).length > 0) {
      formData.append(
        "moduleData",
        new Blob([JSON.stringify(fullModuleDetailsUpdate)], { type: "application/json" })
      );
    }

    if (pdfFile) {
      formData.append("pdfFile", pdfFile, pdfFile.name);
    }
    if (videoFile) {
      formData.append("videoFile", videoFile, videoFile.name);
    }
    // Note: To remove existing files without uploading new ones, your 'moduleData' would
    // typically need flags like { removePdf: true, removeVideo: true },
    // or you'd have dedicated DELETE endpoints for module files.

    const endpoint = API_ENDPOINTS.MODULES.BY_ID(courseId, moduleId); // <<<< CORRECTED: Use nested endpoint
    console.log(`[ModuleAPI.update] Sending PUT request to: ${endpoint}`);

    try {
      const response = await api.put<Module>(endpoint, formData);
      return response.data;
    } catch (error: any) {
      const message = error?.message || "Failed to update module";
      console.error(`[ModuleAPI.update] Error for course ${courseId}, module ${moduleId}: ${message}`, error.response?.data, error);
      throw new Error(error.response?.data?.message || message);
    }
  },

  /**
   * Deletes a module.
   * DELETE /api/courses/{courseId}/modules/{moduleId}
   */
  delete: async (courseId: number, moduleId: number): Promise<void> => { // <<<< CORRECTED: courseId is required
    const endpoint = API_ENDPOINTS.MODULES.BY_ID(courseId, moduleId); // <<<< CORRECTED: Use nested endpoint
    console.log(`[ModuleAPI.delete] Sending DELETE request to: ${endpoint}`);
    try {
      await api.delete<void>(endpoint);
    } catch (error: any) {
      const message = error?.message || "Failed to delete module";
      console.error(`[ModuleAPI.delete] Error for course ${courseId}, module ${moduleId}: ${message}`, error.response?.data, error);
      throw new Error(error.response?.data?.message || message);
    }
  },

  // You can add methods for downloading/deleting module-specific files here:
  // Example:
  // downloadPdf: async (courseId: number, moduleId: number): Promise<Blob> => {
  //   const endpoint = `${API_ENDPOINTS.MODULES.BY_ID(courseId, moduleId)}/pdf`;
  //   console.log(`[ModuleAPI.downloadPdf] Sending GET request to: ${endpoint}`);
  //   try {
  //     const response = await api.get<Blob>(endpoint, { responseType: 'blob' });
  //     return response.data;
  //   } catch (error: any) {
  //     const message = error?.message || "Failed to download PDF";
  //     console.error(`[ModuleAPI.downloadPdf] Error for module ${moduleId}: ${message}`, error.response?.data, error);
  //     throw new Error(error.response?.data?.message || message);
  //   }
  // },
};


const publicApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // Default Content-Type is removed here
  withCredentials: true,
});

// --- Interceptors ---
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) { config.headers.Authorization = `Bearer ${token}`; }
    // Content-Type will be set by individual requests or by Axios for FormData
    // If a request is not FormData and needs JSON, it should specify:
    // if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
    //   config.headers['Content-Type'] = 'application/json';
    // }
    return config;
  },
  (error) => {
    console.error('[API Interceptor] Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('[API Interceptor] Response status:', error.response?.status);
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
        console.warn('[API Interceptor] 401 Unauthorized. Removing token.');
        removeStoredToken();
        // Optionally redirect: window.location.href = '/login';
    } else if (error.response?.status === 403) {
       console.warn('[API Interceptor] 403 Forbidden.');
    } else if (!error.response) {
      console.error('[API Interceptor] Network error:', error.message);
    } else {
       console.error(`[API Interceptor] API Error ${error.response.status}:`, error.response.data || error.message);
    }
    return Promise.reject(error.response?.data || error);
  }
);


// =============================================
// API Service Modules
// =============================================

export const AuthAPI = {
  login: (credentials: LoginRequest): Promise<AxiosResponse<AuthResponse>> => {
    return publicApi.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials, {
        headers: { 'Content-Type': 'application/json' }
    });
  },
  register: (userData: Partial<UserCreationRequestDTO>): Promise<AxiosResponse<UserResponseDTO>> => {
    return publicApi.post<UserResponseDTO>(API_ENDPOINTS.AUTH.REGISTER, userData, {
        headers: { 'Content-Type': 'application/json' }
    });
  },
  healthCheck: (): Promise<AxiosResponse<{ status: string }>> => {
    return publicApi.get<{ status: string }>(API_ENDPOINTS.AUTH.HEALTH);
  },
};

export const UserAPI = {
  getAllUsersForList: (): Promise<AxiosResponse<UserListDTO[]>> =>
    api.get<UserListDTO[]>(API_ENDPOINTS.USERS.BASE),
  getAllUsers_DEPRECATED: (): Promise<AxiosResponse<UserResponseDTO[]>> =>
    api.get<UserResponseDTO[]>(API_ENDPOINTS.USERS.BASE),
  getCurrentUserProfile: (): Promise<AxiosResponse<UserProfile>> => // Change return type to UserProfile
    api.get<UserProfile>(API_ENDPOINTS.USERS.CURRENT_USER), // Change generic type to UserProfile
  getUserById: (id: number): Promise<AxiosResponse<UserResponseDTO>> =>
    api.get<UserResponseDTO>(API_ENDPOINTS.USERS.BY_ID(id)),
  updateUser: (id: number, userDTO: Partial<UserUpdateRequestDTO>): Promise<AxiosResponse<UserResponseDTO>> =>
    api.put<UserResponseDTO>(API_ENDPOINTS.USERS.BY_ID(id), userDTO, {
        headers: { 'Content-Type': 'application/json' }

    }),
    updateUserRole: (id: number, roleUpdateDTO: UserRoleUpdateRequestDTO): Promise<AxiosResponse<{ message: string }>> => {
    return api.put<{ message: string }>(API_ENDPOINTS.USERS.ROLE_BY_ID(id), roleUpdateDTO, {
        headers: { 'Content-Type': 'application/json' }
    });
  },
  deleteUser: (id: number): Promise<AxiosResponse<void>> =>
    api.delete<void>(API_ENDPOINTS.USERS.BY_ID(id)),
  checkUsernameAvailability: (username: string): Promise<AxiosResponse<{ available: boolean }>> =>
    api.get<{ available: boolean }>(API_ENDPOINTS.USERS.CHECK_USERNAME, { params: { username } }),
  checkEmailAvailability: (email: string): Promise<AxiosResponse<{ available: boolean }>> =>
    api.get<{ available: boolean }>(API_ENDPOINTS.USERS.CHECK_EMAIL, { params: { email } }),
  getStudentsByInstructor: (instructorId: number) =>
    api.get<UserListDTO[]>(`/api/users/instructor/${instructorId}/students`),
};

export const InstructorAPI = {
    getAllInstructorsForList: (): Promise<AxiosResponse<InstructorListDTO[]>> =>
        api.get<InstructorListDTO[]>(API_ENDPOINTS.INSTRUCTORS.BASE),
    getAll_DEPRECATED: (): Promise<AxiosResponse<InstructorResponseDTO[]>> =>
        api.get<InstructorResponseDTO[]>(API_ENDPOINTS.INSTRUCTORS.BASE),
    getMe: (): Promise<AxiosResponse<InstructorResponseDTO>> =>
        api.get<InstructorResponseDTO>(API_ENDPOINTS.INSTRUCTORS.ME),
    getByUserId: (userId: number): Promise<AxiosResponse<InstructorResponseDTO>> =>
        api.get<InstructorResponseDTO>(API_ENDPOINTS.INSTRUCTORS.BY_USER(userId)),
    getById: (id: number): Promise<AxiosResponse<InstructorResponseDTO>> =>
        api.get<InstructorResponseDTO>(API_ENDPOINTS.INSTRUCTORS.BY_ID(id)),
    create: (instructorData: Partial<InstructorInputDTO>): Promise<AxiosResponse<InstructorResponseDTO>> =>
        api.post<InstructorResponseDTO>(API_ENDPOINTS.INSTRUCTORS.BASE, instructorData, {
            headers: { 'Content-Type': 'application/json' }
        }),
    update: (id: number, instructorData: Partial<InstructorInputDTO>): Promise<AxiosResponse<InstructorResponseDTO>> =>
        api.put<InstructorResponseDTO>(API_ENDPOINTS.INSTRUCTORS.BY_ID(id), instructorData, {
            headers: { 'Content-Type': 'application/json' }
        }),
    updateRating: (id: number): Promise<AxiosResponse<InstructorResponseDTO>> =>
        api.put<InstructorResponseDTO>(API_ENDPOINTS.INSTRUCTORS.UPDATE_RATING(id)), // Assuming no body, or JSON body if needed
    getByExpertise: (expertise: string): Promise<AxiosResponse<InstructorListDTO[]>> => // Changed to DTO list
        api.get<InstructorListDTO[]>(API_ENDPOINTS.INSTRUCTORS.BY_EXPERTISE(expertise)),
    getByMinRating: (minRating: number): Promise<AxiosResponse<InstructorListDTO[]>> => // Changed to DTO list
        api.get<InstructorListDTO[]>(API_ENDPOINTS.INSTRUCTORS.BY_MIN_RATING(minRating)),
    delete: (id: number): Promise<AxiosResponse<void>> =>
        api.delete<void>(API_ENDPOINTS.INSTRUCTORS.BY_ID(id))
};

export const CourseAPI = {
  // *** THESE NOW POINT TO V2 ENDPOINTS ***
  create: (formData: FormData): Promise<AxiosResponse<CourseListDTO>> => {
    console.log('[API Service] CourseAPI.create (V2) sending FormData to:', API_ENDPOINTS.COURSES.BASE_V2);
    // formData should contain a part "courseDto" (JSON) and "imageFile" (File)
    return api.post<CourseListDTO>(API_ENDPOINTS.COURSES.BASE_V2, formData);
  },

  update: (id: number, formData: FormData): Promise<AxiosResponse<CourseListDTO>> => {
    console.log(`[API Service] CourseAPI.update (V2) for ID ${id} sending FormData to:`, API_ENDPOINTS.COURSES.BY_ID_V2(id));
    // formData should contain a part "courseDto" (JSON) and "imageFile" (File)
    return api.put<CourseListDTO>(API_ENDPOINTS.COURSES.BY_ID_V2(id), formData);
  },

  // --- Methods calling legacy/non-V2 endpoints (assume they remain for other uses or until full migration) ---
  getAllCoursesForList: (): Promise<AxiosResponse<CourseListDTO[]>> =>
    api.get<CourseListDTO[]>(API_ENDPOINTS.COURSES.BASE), // Gets all courses

  // This should return CourseDetailResponseDTO if it's different from CourseListDTO
  getById: (id: number): Promise<AxiosResponse<CourseDetailResponseDTO>> =>
    api.get<CourseDetailResponseDTO>(API_ENDPOINTS.COURSES.BY_ID(id)),

  getCoursesByInstructorForList: (instructorId: number): Promise<AxiosResponse<CourseListDTO[]>> =>
    api.get<CourseListDTO[]>(API_ENDPOINTS.COURSES.BY_INSTRUCTOR(instructorId)),

  delete: (id: number): Promise<AxiosResponse<void>> =>
    api.delete<void>(API_ENDPOINTS.COURSES.BY_ID(id)),

  getImage: (id: number): Promise<AxiosResponse<Blob>> =>
    api.get<Blob>(API_ENDPOINTS.COURSES.IMAGE(id), { responseType: 'blob' }),

  getByCategory: (category: string): Promise<AxiosResponse<CourseListDTO[]>> => // Assuming backend will return DTOs or you map
    api.get<CourseListDTO[]>(API_ENDPOINTS.COURSES.BY_CATEGORY(category)),

  getByMode: (mode: string): Promise<AxiosResponse<CourseListDTO[]>> => // mode is string from path
    api.get<CourseListDTO[]>(API_ENDPOINTS.COURSES.BY_MODE(mode)),

  search: (title: string): Promise<AxiosResponse<CourseListDTO[]>> =>
    api.get<CourseListDTO[]>(API_ENDPOINTS.COURSES.SEARCH, { params: { title } }),

  addInstructor: (courseId: number, instructorId: number): Promise<AxiosResponse<CourseListDTO>> => // Or CourseDetailResponseDTO
    api.post<CourseListDTO>(API_ENDPOINTS.COURSES.INSTRUCTOR(courseId, instructorId)),

  removeInstructor: (courseId: number, instructorId: number): Promise<AxiosResponse<CourseListDTO>> => // Or CourseDetailResponseDTO
    api.delete<CourseListDTO>(API_ENDPOINTS.COURSES.INSTRUCTOR(courseId, instructorId)),

  setInstructors: (courseId: number, instructorIds: number[]): Promise<AxiosResponse<CourseListDTO>> => // Or CourseDetailResponseDTO
    api.put<CourseListDTO>(API_ENDPOINTS.COURSES.INSTRUCTORS(courseId), instructorIds, {
        headers: { 'Content-Type': 'application/json' }
    }),

  getCoursesByInstructor: (instructorId: number) =>
    api.get<CourseListDTO[]>(`/api/courses/instructor/${instructorId}`),
};
// --- Other APIs (Ensure Content-Type is set if not FormData and body exists) ---
export const PaymentAPI = {
  initiateCoursePayment: (courseId: number): Promise<AxiosResponse<PaymentDTO>> =>
    api.post<PaymentDTO>(API_ENDPOINTS.PAYMENTS.COURSE(courseId)), // Assuming no body or JSON body
  initiateEventPayment: (eventId: number): Promise<AxiosResponse<PaymentDTO>> =>
    api.post<PaymentDTO>(API_ENDPOINTS.PAYMENTS.EVENT(eventId)),
  getUserPayments: (): Promise<AxiosResponse<PaymentDTO[]>> =>
    api.get<PaymentDTO[]>(API_ENDPOINTS.PAYMENTS.USER),
  getById: (id: number): Promise<AxiosResponse<PaymentDTO>> =>
    api.get<PaymentDTO>(API_ENDPOINTS.PAYMENTS.BY_ID(id)),
  verify: (token: string): Promise<AxiosResponse<{ valid: boolean }>> =>
    publicApi.get<{ valid: boolean }>(API_ENDPOINTS.PAYMENTS.VERIFY(token)),
  refund: (id: number): Promise<AxiosResponse<{ success: boolean }>> =>
    api.post<{ success: boolean }>(API_ENDPOINTS.PAYMENTS.REFUND(id)),
  handleCallback: (token: string, status: string): Promise<AxiosResponse<string>> =>
    publicApi.get<string>(API_ENDPOINTS.PAYMENTS.CALLBACK, { params: { token, status } }),
};

export const EnrollmentAPI = {
  create: (courseId: number): Promise<AxiosResponse<EnrollmentDTO>> =>
    api.post<EnrollmentDTO>(API_ENDPOINTS.ENROLLMENTS.BASE, null, { params: { courseId } }),
  createWithPayment: (courseId: number, paymentId: number): Promise<AxiosResponse<EnrollmentDTO>> =>
    api.post<EnrollmentDTO>(API_ENDPOINTS.ENROLLMENTS.WITH_PAYMENT, null, { params: { courseId, paymentId } }),
  getById: (id: number): Promise<AxiosResponse<EnrollmentDTO>> =>
    api.get<EnrollmentDTO>(API_ENDPOINTS.ENROLLMENTS.BY_ID(id)),
  getByUser: (): Promise<AxiosResponse<EnrollmentDTO[]>> =>
    api.get<EnrollmentDTO[]>(API_ENDPOINTS.ENROLLMENTS.USER),
  getByCourse: (courseId: number): Promise<AxiosResponse<EnrollmentDTO[]>> =>
    api.get<EnrollmentDTO[]>(API_ENDPOINTS.ENROLLMENTS.COURSE(courseId)),
  getByStatus: (status: string): Promise<AxiosResponse<EnrollmentDTO[]>> =>
    api.get<EnrollmentDTO[]>(API_ENDPOINTS.ENROLLMENTS.STATUS(status)),
  getByUserAndStatus: (status: string): Promise<AxiosResponse<EnrollmentDTO[]>> =>
    api.get<EnrollmentDTO[]>(API_ENDPOINTS.ENROLLMENTS.USER_STATUS(status)),
  updateStatus: (id: number, status: string): Promise<AxiosResponse<EnrollmentDTO>> =>
    api.put<EnrollmentDTO>(API_ENDPOINTS.ENROLLMENTS.UPDATE_STATUS(id), null, { params: { status } }),
  complete: (id: number, completionDate?: string): Promise<AxiosResponse<EnrollmentDTO>> =>
    api.put<EnrollmentDTO>(API_ENDPOINTS.ENROLLMENTS.COMPLETE(id), null, { params: { completionDate } }),
  addPayment: (id: number, paymentId: number): Promise<AxiosResponse<EnrollmentDTO>> =>
    api.put<EnrollmentDTO>(API_ENDPOINTS.ENROLLMENTS.PAYMENT(id, paymentId)),
  delete: (id: number): Promise<AxiosResponse<void>> =>
    api.delete<void>(API_ENDPOINTS.ENROLLMENTS.BY_ID(id)),
};

// --- Other APIs (Ensure Content-Type is set if not FormData and body exists) ---
export const EventAPI = {
  getAllEvents: (): Promise<AxiosResponse<EventDTO[]>> =>
    api.get<EventDTO[]>(API_ENDPOINTS.EVENTS.BASE),
  getEventById: (id: number): Promise<AxiosResponse<EventDTO>> =>
    api.get<EventDTO>(API_ENDPOINTS.EVENTS.BY_ID(id)),
  createEvent: (eventData: Partial<EventDTO>): Promise<AxiosResponse<EventDTO>> =>
    api.post<EventDTO>(API_ENDPOINTS.EVENTS.BASE, eventData, {
      headers: { 'Content-Type': 'application/json' }
    }),
  updateEvent: (id: number, eventData: Partial<EventDTO>): Promise<AxiosResponse<EventDTO>> =>
    api.put<EventDTO>(API_ENDPOINTS.EVENTS.BY_ID(id), eventData, {
      headers: { 'Content-Type': 'application/json' }
    }),
  deleteEvent: (id: number): Promise<AxiosResponse<void>> =>
    api.delete<void>(API_ENDPOINTS.EVENTS.BY_ID(id)),
};

export const EventRegistrationAPI = {
  registerForEvent: (eventId: number): Promise<AxiosResponse<EventRegistrationDTO>> =>
    api.post<EventRegistrationDTO>(API_ENDPOINTS.EVENT_REGISTRATIONS.BASE, null, { params: { eventId } }),
  getUserRegistrations: (userId: number): Promise<AxiosResponse<EventRegistrationDTO[]>> =>
    api.get<EventRegistrationDTO[]>(API_ENDPOINTS.EVENT_REGISTRATIONS.USER_REGISTRATIONS(userId)),
  getEventRegistrations: (eventId: number): Promise<AxiosResponse<EventRegistrationDTO[]>> =>
    api.get<EventRegistrationDTO[]>(API_ENDPOINTS.EVENT_REGISTRATIONS.EVENT_REGISTRATIONS(eventId)),
  cancelRegistration: (id: number): Promise<AxiosResponse<void>> =>
    api.delete<void>(API_ENDPOINTS.EVENT_REGISTRATIONS.BY_ID(id)),
};

export const CertificationAPI = {
  /**
   * Create a new certification (POST /api/certifications)
   * Params are sent as query params, not in the body.
   */
  create: (
    userId: number,
    courseId: number,
    issueDate: string,
    expiryDate?: string
  ): Promise<AxiosResponse<CertificationDTO>> => {
    const params: any = { userId, courseId, issueDate };
    if (expiryDate) params.expiryDate = expiryDate;
    return api.post<CertificationDTO>(API_ENDPOINTS.CERTIFICATIONS.BASE, null, { params });
  },

  getById: (id: number): Promise<AxiosResponse<CertificationDTO>> =>
    api.get<CertificationDTO>(API_ENDPOINTS.CERTIFICATIONS.BY_ID(id)),

  getByCode: (certificateCode: string): Promise<AxiosResponse<CertificationDTO>> =>
    api.get<CertificationDTO>(API_ENDPOINTS.CERTIFICATIONS.BY_CODE(certificateCode)),

  getByUser: (userId: number): Promise<AxiosResponse<CertificationDTO[]>> =>
    api.get<CertificationDTO[]>(API_ENDPOINTS.CERTIFICATIONS.BY_USER(userId)),

  getByCourse: (courseId: number): Promise<AxiosResponse<CertificationDTO[]>> =>
    api.get<CertificationDTO[]>(API_ENDPOINTS.CERTIFICATIONS.BY_COURSE(courseId)),

  getByStatus: (status: string): Promise<AxiosResponse<CertificationDTO[]>> =>
    api.get<CertificationDTO[]>(API_ENDPOINTS.CERTIFICATIONS.BY_STATUS(status)),

  getMyCertifications: (): Promise<AxiosResponse<CertificationDTO[]>> =>
    api.get<CertificationDTO[]>(API_ENDPOINTS.CERTIFICATIONS.MY_CERTIFICATIONS),

  updateStatus: (id: number, status: string): Promise<AxiosResponse<CertificationDTO>> =>
    api.put<CertificationDTO>(API_ENDPOINTS.CERTIFICATIONS.UPDATE_STATUS(id), null, { params: { status } }),

  renew: (id: number, newExpiryDate: string): Promise<AxiosResponse<CertificationDTO>> =>
    api.put<CertificationDTO>(API_ENDPOINTS.CERTIFICATIONS.RENEW(id), null, { params: { newExpiryDate } }),

  revoke: (id: number): Promise<AxiosResponse<CertificationDTO>> =>
    api.put<CertificationDTO>(API_ENDPOINTS.CERTIFICATIONS.REVOKE(id)),

  verify: (certificateCode: string): Promise<AxiosResponse<{ valid: boolean }>> =>
    api.get<{ valid: boolean }>(API_ENDPOINTS.CERTIFICATIONS.VERIFY(certificateCode)),

  generateCode: (): Promise<AxiosResponse<string>> =>
    api.get<string>(API_ENDPOINTS.CERTIFICATIONS.GENERATE_CODE),

  delete: (id: number): Promise<AxiosResponse<void>> =>
    api.delete<void>(API_ENDPOINTS.CERTIFICATIONS.BY_ID(id)),
};
export const CompanyAPI = {
  getAllCompanies: (): Promise<AxiosResponse<CompanyDTO[]>> =>
    api.get<CompanyDTO[]>(API_ENDPOINTS.COMPANIES.BASE),
  createCompany: (companyData: CompanyCreateRequest): Promise<AxiosResponse<CompanyDTO>> =>
    api.post<CompanyDTO>(API_ENDPOINTS.COMPANIES.BASE, companyData, {
        headers: { 'Content-Type': 'application/json' }
    }),
  deleteCompany: (id: number): Promise<AxiosResponse<void>> =>
    api.delete<void>(API_ENDPOINTS.COMPANIES.BY_ID(id)),
  getCompanyById: (id: number): Promise<AxiosResponse<CompanyDTO>> =>
    api.get<CompanyDTO>(API_ENDPOINTS.COMPANIES.BY_ID(id)),
  updateCompany: (id: number, companyData: CompanyCreateRequest): Promise<AxiosResponse<CompanyDTO>> =>
    api.put<CompanyDTO>(API_ENDPOINTS.COMPANIES.BY_ID(id), companyData, {
        headers: { 'Content-Type': 'application/json' }
    }),
};
export const DatabaseAPI = { /* ... */ };
export const ImageUserAPI = { /* ... */ };
export const ReviewAPI = { /* ... */ };

// --- Dashboard API ---
export const DashboardAPI = {
  getAdminStats: (): Promise<AxiosResponse<AdminStatsResponse>> =>
    api.get<AdminStatsResponse>(API_ENDPOINTS.DASHBOARD.ADMIN_STATS),
  getInstructorStats: (instructorId: number): Promise<AxiosResponse<InstructorStatsResponse>> =>
    api.get<InstructorStatsResponse>(API_ENDPOINTS.DASHBOARD.INSTRUCTOR_STATS(instructorId)),
};

// --- Practical Session API ---
const PracticalSessionAPI = {
  /**
   * Create a new practical session.
   * POST /api/practical-sessions
   */
  createPracticalSession: (sessionInputDTO: PracticalSessionInputDTO): Promise<AxiosResponse<PracticalSessionDTO>> => {
    return api.post<PracticalSessionDTO>(API_ENDPOINTS.PRACTICAL_SESSIONS.BASE, sessionInputDTO, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  /**
   * Get a practical session by its ID.
   * GET /api/practical-sessions/{sessionId}
   */
  getPracticalSessionById: (sessionId: number): Promise<AxiosResponse<PracticalSessionDTO>> => {
    return api.get<PracticalSessionDTO>(API_ENDPOINTS.PRACTICAL_SESSIONS.BY_ID(sessionId));
  },

  /**
   * Get practical sessions for a specific course.
   * GET /api/practical-sessions/course/{courseId}
   */
  getPracticalSessionsByCourseId: (courseId: number): Promise<AxiosResponse<PracticalSessionDTO[]>> => {
    return api.get<PracticalSessionDTO[]>(API_ENDPOINTS.PRACTICAL_SESSIONS.BY_COURSE(courseId));
  },

  /**
   * Get upcoming practical sessions for the current authenticated user.
   * GET /api/practical-sessions/user/me/upcoming
   */
  getUpcomingPracticalSessionsForUser: (): Promise<AxiosResponse<PracticalSessionDTO[]>> => {
    return api.get<PracticalSessionDTO[]>(API_ENDPOINTS.PRACTICAL_SESSIONS.UPCOMING_FOR_USER);
  },

  /**
   * Get practical sessions for the current authenticated instructor's dashboard.
   * GET /api/practical-sessions/instructor/dashboard
   */
  getPracticalSessionsForInstructorDashboard: (): Promise<AxiosResponse<PracticalSessionDTO[]>> => {
    return api.get<PracticalSessionDTO[]>(API_ENDPOINTS.PRACTICAL_SESSIONS.INSTRUCTOR_DASHBOARD);
  },

  /**
   * Update an existing practical session.
   * PUT /api/practical-sessions/{sessionId}
   */
  updatePracticalSession: (sessionId: number, sessionInputDTO: PracticalSessionInputDTO): Promise<AxiosResponse<PracticalSessionDTO>> => {
    return api.put<PracticalSessionDTO>(API_ENDPOINTS.PRACTICAL_SESSIONS.BY_ID(sessionId), sessionInputDTO, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  /**
   * Delete a practical session by its ID.
   * DELETE /api/practical-sessions/{sessionId}
   */
  deletePracticalSession: (sessionId: number): Promise<AxiosResponse<void>> => {
    return api.delete<void>(API_ENDPOINTS.PRACTICAL_SESSIONS.BY_ID(sessionId));
  },
};


// =============================================
// Legacy/Utility Functions
// =============================================
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await AuthAPI.login(credentials);
    return response.data;
};
export const register = async (userData: Partial<UserCreationRequestDTO>): Promise<UserResponseDTO> => { // Changed to return User directly
    const response = await AuthAPI.register(userData);
    return response.data;
};
export const getCurrentUser = async (): Promise<UserResponseDTO> => {
    const response = await UserAPI.getCurrentUserProfile();
    return response.data;
};
export const submitContactForm = async (contactData: ContactFormRequest): Promise<any> => {
    const response = await publicApi.post(API_ENDPOINTS.CONTACT.SUBMIT, contactData, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export { publicApi, PracticalSessionAPI }; // Export PracticalSessionAPI
