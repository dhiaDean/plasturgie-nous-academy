// =============================================
// File: src/services/api.constants.ts
// =============================================

// API Base URL - Configure based on environment
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function to join URL parts safely (optional, Axios handles base URL joining well)
// const joinUrl = (...parts: string[]): string => {
//   const joined = parts.map((part, index) => {
//     let trimmedPart = part;
//     if (index > 0) {
//         trimmedPart = trimmedPart.replace(/^\/+/, '');
//     }
//     if (index < parts.length - 1) {
//         trimmedPart = trimmedPart.replace(/\/+$/, '');
//     }
//     return trimmedPart;
//   }).filter(part => part !== '').join('/');
//   return joined;
// };


// API Endpoints - all paths are relative to API_BASE_URL
export const API_ENDPOINTS = {
  AUTH: {
    BASE: '/api/auth',
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh-token',
    HEALTH: '/api/auth/health', // Example health check endpoint
  },

  USERS: {
    BASE: '/api/users',
    CURRENT_USER: '/api/users/me',
    BY_ID: (id: number | string) => `/api/users/${id}`,
    ROLE_BY_ID: (id: number | string) => `/api/users/${id}/role`, // <<< ADD THIS LINE
    CHECK_USERNAME: '/api/users/check/username',
    CHECK_EMAIL: '/api/users/check/email',
    // AVATAR: (id: number | string) => `/api/users/${id}/avatar`, // Example
  },

  COURSES: {
    BASE: '/api/courses', // Legacy or default for GET all, etc.
    BASE_V2: '/api/courses/v2', // *** NEW: For V2 POST (create with DTO) ***
    BY_ID: (id: number | string) => `/api/courses/${id}`, // Legacy or default for GET by ID
    BY_ID_V2: (id: number | string) => `/api/courses/${id}/v2`, // *** NEW: For V2 PUT (update with DTO) ***
    IMAGE: (id: number | string) => `/api/courses/${id}/image`,
    BY_CATEGORY: (category: string) => `/api/courses/by-category/${category}`,
    BY_MODE: (mode: string) => `/api/courses/by-mode/${mode}`,
    BY_INSTRUCTOR: (instructorId: number | string) => `/api/courses/by-instructor/${instructorId}`,
    SEARCH: '/api/courses/search',
    INSTRUCTORS: (courseId: number | string) => `/api/courses/${courseId}/instructors`,
    INSTRUCTOR: (courseId: number | string, instructorId: number | string) => `/api/courses/${courseId}/instructors/${instructorId}`,
    // ... other existing course endpoints ...
  },


  INSTRUCTORS: {
    BASE: '/api/instructors',
    BY_ID: (id: number | string) => `/api/instructors/${id}`,
    BY_USER: (userId: number | string) => `/api/instructors/by-user/${userId}`, // Assuming this path if it exists
    ME: '/api/instructors/me', // Endpoint for current authenticated instructor
    BY_EXPERTISE: (expertise: string) => `/api/instructors/by-expertise/${expertise}`, // Assuming path, adjust if query param
    BY_MIN_RATING: (minRating: number) => `/api/instructors/by-min-rating/${minRating}`, // Assuming path, adjust if query param
    UPDATE_RATING: (id: number | string) => `/api/instructors/${id}/update-rating`, // Endpoint to trigger rating recalc
    COURSES: (instructorId: number | string) => `/api/instructors/${instructorId}/courses`, // Example
    REVIEWS: (instructorId: number | string) => `/api/instructors/${instructorId}/reviews`, // Example
    // AVATAR: (id: number | string) => `/api/instructors/${id}/avatar`, // Example
  },

  COMPANIES: {
    BASE: '/api/companies',
    BY_ID: (id: number | string) => `/api/companies/${id}`,
    BY_CITY: (city: string) => `/api/companies/by-city/${city}`, // Assuming path
    SEARCH: '/api/companies/search', // e.g., /api/companies/search?name=...
    MY_COMPANY: '/api/companies/my-company', // For company rep to get their company
    // REPRESENTATIVE: (id: number | string) => `/api/companies/${id}/representative`, // Example
  },

  EVENTS: {
    BASE: '/api/events',
    BY_ID: (id: number | string) => `/api/events/${id}`,
    BY_COMPANY: (companyId: number | string) => `/api/events/by-company/${companyId}`,
    UPCOMING: '/api/events/upcoming',
    OPEN_REGISTRATION: '/api/events/open-registration',
    SEARCH: '/api/events/search', // e.g., /api/events/search?title=...
    BY_DATE_RANGE: '/api/events/by-date-range', // e.g., ?startDate=...&endDate=...
    // INCREMENT_PARTICIPANTS: (id: number | string) => `/api/events/${id}/increment-participants`, // These might be internal logic
    // DECREMENT_PARTICIPANTS: (id: number | string) => `/api/events/${id}/decrement-participants`,
    IS_FULL: (id: number | string) => `/api/events/${id}/is-full`, // Example utility endpoint
    REGISTER: (id: number | string) => `/api/events/${id}/register`, // For a user to register for an event
    PARTICIPANTS: (id: number | string) => `/api/events/${id}/participants`, // Example to get list of participants
  },

  EVENT_REGISTRATIONS: {
    BASE: '/api/event-registrations',
    BY_ID: (id: number | string) => `/api/event-registrations/${id}`,
    USER_REGISTRATIONS: (userId: number | string) => `/api/event-registrations/user/${userId}`,
    EVENT_REGISTRATIONS: (eventId: number | string) => `/api/event-registrations/event/${eventId}`,
    ATTENDANCE: (id: number | string) => `/api/event-registrations/${id}/attendance`, // To mark attendance
    // MY_REGISTRATIONS: '/api/event-registrations/me', // Example for current user
  },

  PAYMENTS: {
    BASE: '/api/payments',
    BY_ID: (id: number | string) => `/api/payments/${id}`,
    COURSE: (courseId: number | string) => `/api/payments/course/${courseId}`, // For initiating payment for a course
    EVENT: (eventId: number | string) => `/api/payments/event/${eventId}`,   // For initiating payment for an event
    USER: '/api/payments/user', // Or /api/users/me/payments - for current user's payments
    VERIFY: (token: string) => `/api/payments/verify/${token}`, // Payment verification, e.g., Stripe webhook or client-side token
    REFUND: (id: number | string) => `/api/payments/${id}/refund`,
    CALLBACK: '/api/payments/callback', // e.g., for payment provider redirect
    INITIATE: '/api/payments/initiate', // Generic payment initiation
    HISTORY: '/api/payments/history',   // Current user's payment history
    STATUS: (paymentIntentId: string) => `/api/payments/status/${paymentIntentId}`, // Check status of a payment intent
  },

  ENROLLMENTS: {
    BASE: '/api/enrollments',
    BY_ID: (id: number | string) => `/api/enrollments/${id}`,
    WITH_PAYMENT: '/api/enrollments/with-payment', // Requires courseId and paymentId as params or body
    USER: '/api/enrollments/user', // Or /api/users/me/enrollments - for current user's enrollments
    COURSE: (courseId: number | string) => `/api/enrollments/course/${courseId}`, // Enrollments for a specific course
    STATUS: (status: string) => `/api/enrollments/status/${status}`, // Filter by status
    USER_STATUS: (status: string) => `/api/enrollments/user/status/${status}`, // Current user's enrollments by status
    UPDATE_STATUS: (id: number | string) => `/api/enrollments/${id}/status`, // Update status of an enrollment
    COMPLETE: (id: number | string) => `/api/enrollments/${id}/complete`, // Mark enrollment as complete
    PAYMENT: (id: number | string, paymentId: number | string) => `/api/enrollments/${id}/payment/${paymentId}`, // Link payment
    // MY_ENROLLMENTS: '/api/enrollments/me', // Example for current user
  },

  CERTIFICATIONS: {
    BASE: '/api/certifications',
    BY_ID: (id: number | string) => `/api/certifications/${id}`,
    BY_CODE: (code: string) => `/api/certifications/code/${code}`,
    BY_USER: (userId: number | string) => `/api/certifications/user/${userId}`,
    BY_COURSE: (courseId: number | string) => `/api/certifications/course/${courseId}`,
    BY_STATUS: (status: string) => `/api/certifications/status/${status}`,
    MY_CERTIFICATIONS: '/api/certifications/my-certifications', // For current user
    UPDATE_STATUS: (id: number | string) => `/api/certifications/${id}/status`,
    RENEW: (id: number | string) => `/api/certifications/${id}/renew`,
    REVOKE: (id: number | string) => `/api/certifications/${id}/revoke`,
    VERIFY: (code: string) => `/api/certifications/verify/${code}`, // Public verification by code
    GENERATE_CODE: '/api/certifications/generate-code', // Admin action
    // ISSUE: (userId: number | string, courseId: number | string) => `/api/certifications/issue`, // Admin action
  },

  PRACTICAL_SESSIONS: {
    BASE: '/api/practical-sessions',
    BY_ID: (id: number | string) => `/api/practical-sessions/${id}`,
    BY_COURSE: (courseId: number | string) => `/api/practical-sessions/course/${courseId}`,
    UPCOMING_FOR_USER: '/api/practical-sessions/user/me/upcoming',
    INSTRUCTOR_DASHBOARD: '/api/practical-sessions/instructor/dashboard',
  },

  IMAGE_USERS: { // For user profile pictures specifically
    BASE: '/api/image-users',
    BY_ID: (id: number | string) => `/api/image-users/${id}`, // Get metadata by image ID
    IMAGE_DATA: (id: number | string) => `/api/image-users/${id}/image`, // Get actual image data by image ID
    BY_USER: (userId: number | string) => `/api/image-users/user/${userId}`, // Get metadata for a user's image
    // UPLOAD_FOR_USER: (userId: number | string) => `/api/users/${userId}/avatar` // Might be part of User endpoints
  },

  // Generic Image Upload/Retrieval (if you have one separate from specific entities)
  // IMAGES: {
  //   BASE: '/api/images',
  //   BY_ID: (id: number | string) => `/api/images/${id}`, // Gets image data or metadata
  //   UPLOAD: '/api/images/upload',
  // },

  DATABASE: { // These seem to be public, ensure correct paths
    INFO: '/public/database/info',
    TABLES: '/public/database/tables',
    SEQUENCES: '/public/database/sequences',
    ORACLE_SEQUENCES: '/public/database/oracle-sequences',
  },

  CONTACT: {
    SUBMIT: '/api/contact/submit', // Or just /api/contact
  },

  DASHBOARD: {
    INSTRUCTOR_STATS: (instructorId: number | string) => `/api/dashboard/instructor/${instructorId}/stats`,
    ADMIN_STATS: '/api/dashboard/admin/stats',
    // LEARNER_PROGRESS: (userId: number | string) => `/api/dashboard/learner/${userId}/progress`, // Example
  },

  REVIEWS: { // Example structure, adjust to your actual review endpoints
    BASE: '/api/reviews',
    BY_ID: (id: number | string) => `/api/reviews/${id}`,
    FOR_COURSE: (courseId: number | string) => `/api/courses/${courseId}/reviews`, // Often nested
    FOR_INSTRUCTOR: (instructorId: number | string) => `/api/instructors/${instructorId}/reviews`, // Often nested
    BY_USER: (userId: number | string) => `/api/users/${userId}/reviews`, // Reviews written by a user
    // SUBMIT_COURSE_REVIEW: (courseId: number | string) => `/api/courses/${courseId}/reviews`, // POST here
    // SUBMIT_INSTRUCTOR_REVIEW: (instructorId: number | string) => `/api/instructors/${instructorId}/reviews`, // POST here
  },

  MODULES: { // Example structure for Course Modules
    BASE: (courseId: number | string) => `/api/courses/${courseId}/modules`,
    BY_ID: (courseId: number | string, moduleId: number | string) => `/api/courses/${courseId}/modules/${moduleId}`,
    // LESSONS: (courseId, moduleId, lessonId) => ...
  },
  





};


export default API_ENDPOINTS;
