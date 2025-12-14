// API Base URL - update this to your actual backend API URL
export const API_BASE_URL = 'http://localhost:5000/api'; // Example, use your backend URL

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    HEALTH: '/auth/health'
  },
  USERS: {
    
    CURRENT_USER: '/users/me',
    BY_ID: (id: number | string) => `/users/${id}`,
    CHANGE_CURRENT_USER_PASSWORD: '/users/me/password', // <<< ENSURE THIS IS CORRECT
    // PROFILE_PASSWORD: '/api/users/profile/password', // If you had this, it's different
    CHECK_USERNAME: '/users/check/username',
    CHECK_EMAIL: '/users/check/email',
    PROFILE: '/users/profile',
   
  },
  COURSES: {
    BASE: '/courses',
    BY_CATEGORY: (category: string) => `/courses/by-category/${category}`,
    BY_MODE: (mode: string) => `/courses/by-mode/${mode}`,
    BY_INSTRUCTOR: (instructorId: number) => `/courses/by-instructor/${instructorId}`,
    SEARCH: '/courses/search',
    CERTIFICATION_ELIGIBLE: (eligible: boolean) => `/courses/certification-eligible/${eligible}`,
    MAX_PRICE: (maxPrice: number) => `/courses/max-price/${maxPrice}`,
    INSTRUCTORS: (courseId: number) => `/courses/${courseId}/instructors`,
    INSTRUCTOR: (courseId: number, instructorId: number) => `/courses/${courseId}/instructors/${instructorId}`,
    ENROLL: (id: number) => `/courses/${id}/enroll`,
    REVIEWS: (id: number) => `/courses/${id}/reviews`
  },
  COMPANIES: {
    BASE: '/companies',
    BY_CITY: (city: string) => `/companies/by-city/${city}`,
    SEARCH: '/companies/search',
    MY_COMPANY: '/companies/my-company'
  },
 EVENTS: {
  BASE: '/events', // Correct, maps to /api/events due to global prefix
  BY_COMPANY: (companyId: number) => `/events/by-company/${companyId}`, // Correct
  UPCOMING: '/events/upcoming', // Correct
  OPEN_REGISTRATION: '/events/open-registration', // Correct
  SEARCH: '/events/search', // Correct
  BY_DATE_RANGE: '/events/by-date-range', // Correct
  INCREMENT_PARTICIPANTS: (id: number) => `/events/${id}/increment-participants`, // Correct
  DECREMENT_PARTICIPANTS: (id: number) => `/events/${id}/decrement-participants`, // Correct
  IS_FULL: (id: number) => `/events/${id}/is-full`, // Correct
  REGISTER: (id: number) => `/events/${id}/register` // This was for EventAPI.register, but we decided to use EventRegistrationAPI.create
},

  EVENT_REGISTRATIONS: {
    BASE: '/event-registrations',
    BY_USER: (userId: number) => `/event-registrations/user/${userId}`,
    BY_EVENT: (eventId: number) => `/event-registrations/event/${eventId}`,
    ATTENDANCE: (id: number) => `/event-registrations/${id}/attendance`
  },
  INSTRUCTORS: {
    BASE: '/instructors',
    BY_USER: (userId: number) => `/instructors/by-user/${userId}`,
    BY_EXPERTISE: (expertise: string) => `/instructors/by-expertise/${expertise}`,
    BY_MIN_RATING: (minRating: number) => `/instructors/by-min-rating/${minRating}`,
    ME: '/instructors/me',
    UPDATE_RATING: (id: number) => `/instructors/${id}/update-rating`
  },








  PAYMENTS: {
    // --- ADD THIS LINE ---
    BASE: '/payments', // Base path for payment resources (matches @RequestMapping)
    // --- END OF ADDITION ---

    // These match the specific controller methods
    COURSE: (courseId: number) => `/payments/course/${courseId}`, // POST /course/{courseId}
    EVENT: (eventId: number) => `/payments/event/${eventId}`,     // POST /event/{eventId}
    USER: '/payments/user',                                     // GET /user
    VERIFY: (token: string) => `/payments/verify/${token}`,       // GET /verify/{token}
    REFUND: (id: number) => `/payments/${id}/refund`,           // POST /{id}/refund
    CALLBACK: '/payments/callback',                             // GET /callback

    // These might be unused based on the controller provided, but keep for now unless sure
    INITIATE: '/payments/initiate',
    HISTORY: '/payments/history',
    STATUS: '/payments/status'
  },
  PRACTICAL_SESSIONS: {
    BASE: '/api/practical-sessions',
    BY_ID: (id: number | string) => `/api/practical-sessions/${id}`,
    BY_COURSE: (courseId: number | string) => `/api/practical-sessions/course/${courseId}`,
    UPCOMING_FOR_USER: '/api/practical-sessions/user/me/upcoming',
    INSTRUCTOR_DASHBOARD: '/api/practical-sessions/instructor/dashboard',
  },



 
  ENROLLMENTS: {
    BASE: '/enrollments',
    WITH_PAYMENT: '/enrollments/with-payment',
    USER: '/enrollments/user',
    COURSE: (courseId: number) => `/enrollments/course/${courseId}`,
    STATUS: (status: string) => `/enrollments/status/${status}`,
    USER_STATUS: (status: string) => `/enrollments/user/status/${status}`,
    UPDATE_STATUS: (id: number) => `/enrollments/${id}/status`,
    COMPLETE: (id: number) => `/enrollments/${id}/complete`,
    PAYMENT: (id: number, paymentId: number) => `/enrollments/${id}/payment/${paymentId}`
  },
  CERTIFICATIONS: {
    BASE: '/certifications',
    BY_CODE: (code: string) => `/certifications/code/${code}`,
    BY_USER: (userId: number) => `/certifications/user/${userId}`,
    BY_COURSE: (courseId: number) => `/certifications/course/${courseId}`,
    BY_STATUS: (status: string) => `/certifications/status/${status}`,
    MY_CERTIFICATIONS: '/certifications/my-certifications',
    UPDATE_STATUS: (id: number) => `/certifications/${id}/status`,
    RENEW: (id: number) => `/certifications/${id}/renew`,
    REVOKE: (id: number) => `/certifications/${id}/revoke`,
    VERIFY: (code: string) => `/certifications/verify/${code}`,
    GENERATE_CODE: '/certifications/generate-code'
  },
  // --- ADDED IMAGE USERS ENDPOINTS ---
  IMAGE_USERS: {
    BASE: '/image-users', // POST: upload image, GET: get all metadata (admin?)
    BY_ID: (id: number) => `/image-users/${id}`, // GET: get metadata by image ID, DELETE: delete image by ID
    IMAGE_DATA: (id: number) => `/image-users/${id}/image`, // GET: get raw image data (blob) by image ID
    BY_USER: (userId: number) => `/image-users/user/${userId}`, // GET: get all image metadata for a specific user
  },
  // --- END OF ADDITION ---
  DATABASE: {
    INFO: '/public/database/info',
    TABLES: '/public/database/tables',
    SEQUENCES: '/public/database/sequences',
    ORACLE_SEQUENCES: '/public/database/oracle-sequences'
  },
  CONTACT: {
    SUBMIT: '/contact/submit'
  }
};