// =============================================
// File: src/services/api.types.ts
// Purpose: Define shared TypeScript interfaces for API requests/responses
// =============================================
// src/services/api.types.ts
export interface CourseModule {
  moduleId: number;
  title: string;
  description?: string;
  moduleOrder?: number;
courseId?: number; // Optional, as it's implied by parent course
 courseTitle?: string; // Optional

  pdfFilename?: string;
  hasPdf?: boolean;

  videoFilename?: string;
  hasVideo?: boolean;

  lessons?: string[]; // if you plan to send lessons this way
}

export interface Course { // This should map to your CourseListDTO
  courseId: number;
  title: string;
  description?: string;
  category?: string;
  mode?: string; // Or your Mode enum type if you map it
  price?: number;
  certificationEligible?: boolean;
  createdAt?: string; // Or Date
  firstInstructorName?: string;
  firstInstructorId?: number;
  imageUrl?: string;
  level?: string;
  startDate?: string; // Or Date
  duration?: string;
  rating?: number;
  reviewCount?: number;
  participants?: number;
  location?: string;
  instructors?: Instructor[]; // Assuming you have this type
  modules?: CourseModule[]; // This now expects objects with description, pdf/video info
  reviews?: Review[]; // Add reviews property
}

export interface SimpleInstructorDTO { // Example
    instructorId: number;
    fullName: string;
    rating?: number; // Or BigDecimal as string if needed
}
// --- Authentication ---



// src/services/api.types.ts


// src/services/api.types.ts

// ... (other types like Role, CourseMode etc.)

export interface SimpleUserDTO { // Already defined, good for nested user
  userId: number;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface SimpleCourseInfoDTO { // For nested course info
  courseId: number;
  title: string;
  category?: string | null;
  duration?: string | null; // Assuming string like "40 hours" from backend for simplicity
  level?: string | null;
}

// This is the type we'll primarily use in CertificationPage.tsx
// It matches your Java Certification model closely.
export interface Certification {
  certificationId: number;
  certificateCode: string;
  user: SimpleUserDTO;          // Backend sends a nested User object (or simplified DTO)
  course: SimpleCourseInfoDTO;  // Backend sends a nested Course object (or simplified DTO)
  issueDate: string;            // ISO DateTime string
  expiryDate?: string | null;   // ISO DateTime string or null
  status: 'active' | 'expired' | 'revoked' | string; // Allow string for flexibility from backend
  createdAt: string;            // ISO DateTime string
}
export enum PracticalSessionStatus {
  UPCOMING = "UPCOMING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export interface PracticalSessionDTO {
  id: number;
  title: string;
  description?: string;
  sessionDateTime: string; // Assuming ISO string from LocalDateTime
  sessionDateTimeFormatted?: string; // Optional formatted string
  location: string;
  durationMinutes?: number;
  status: PracticalSessionStatus;

  // Information from related entities
  courseId: number;
  courseTitle?: string;
  courseSubTitle?: string;

  conductingInstructorId: number;
  conductingInstructorName?: string;
  conductingInstructorAvatarUrl?: string;
}

// Keep your other DTOs like CourseListDTO, UserListDTO etc. as they are used elsewhere.
// ...



export type SimpleInstructor = { // For listing multiple instructors briefly
  id: number;
  name: string;
};

export type SimpleModule = { // For listing module titles or counts
  title: string;
  // lessonsCount?: number; // Example
};

export type DisplayFormation = {
  courseId: number;
  title: string;
  category: string;
  mode: string; // e.g., "Online", "In-Person"
  price: number;
  createdAt: string; // Or Date
  firstInstructorName: string; // Keep this for prominent display
  firstInstructorId?: number; 

  // --- NEW FIELDS ---
  image?: string; 
  level?: string;
  startDate?: string; // ISO Date string or formatted string
  duration?: string; // e.g., "20 hours", "3 weeks"
  rating?: number; // Average rating (e.g., 4.5)
  reviewCount?: number;
  participants?: number; // Current or max participants
  location?: string; // Specific address if in-person, or "Online" / "À distance"
  
  // For complex data, consider summary or if backend can provide simplified versions for list view
  modules?: SimpleModule[]; // Array of simple module objects
  instructors?: SimpleInstructor[]; // Array of simple instructor objects (can include the firstInstructor again or be a separate list)
  // reviews?: ReviewSummary[]; // For reviews, usually just a count or average rating is on list view
                              // Full reviews are for detail page. reviewCount and rating cover this for list.
};


export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string; // e.g., 'Bearer'
  access_token: string; // Often same as token, included for flexibility
  token_type?: string; // Often 'Bearer'
  username?: string;
  email?: string;
  role?: string; // Or roles?: string[];
}

// --- Core Entities ---

export interface User {
  id?: number;      // Make optional for compatibility
  userId?: number;  // Add this for backend compatibility
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  roles: string[]; // e.g., ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_INSTRUCTOR']
  // Add other user details like avatarUrl if needed
  avatarUrl?: string;
  
}

// Instructor: Ensure this matches your API response for instructors.
// Using 'name' based on component usage, keeping firstName/lastName as optional data points.
export interface Instructor {
  id: number;
  name: string; // Assumed based on component using mainInstructor.name
  firstName?: string; // Optional if 'name' is primary
  lastName?: string; // Optional if 'name' is primary
  expertise?: string; // Kept original field name
  rating?: number; // Kept original field name
  bio?: string;
  title?: string; // Added based on component usage
  userId?: number; // Kept original field name
  courses?: Course[]; // Relationship, potentially large, might be IDs only in some responses
  imageUrl?: string; // For avatar display
}

// CourseModule: Definition for course content structure


// Review: Includes nested optional User info for the reviewer
export interface Review {
  id: number;
  rating: number; // Typically 1-5
  comment: string;
  userId: number;
  courseId: number;
  createdAt: string; // ISO Date string format recommended
  user?: {
    id: number;
    username?: string;
    // Include other minimal details if needed & provided by API
    avatarUrl?: string;
  };
}

// Course: Updated with all fields used in FormationDetail


export interface Company {
  id: number;
  name: string;
  city?: string; // Was required, make optional if possible
  representativeId?: number; // Was required, consider optionality
  address?: string;
  phoneNumber?: string;
  website?: string;
}

export interface Event {
  eventId: number; // Changed from 'id'
  title: string;
  description: string;
  location: string;
  eventDate: string; // Changed from 'startDate', expect ISO string from LocalDateTime
  registrationDeadline: string; // Expect ISO string from LocalDateTime
  price?: number; // Backend sends BigDecimal, frontend will likely receive as number or string
  maxParticipants: number; // Changed from 'capacity'
  currentParticipants: number; // Ensure backend always sends this, initialize to 0 if null
  company: Company; // Backend sends a nested Company object
  
  // Optional fields that might come from backend
  createdAt?: string; // Expect ISO string from LocalDateTime

  // Note: 'endDate' is not directly on backend Event. If needed, frontend might calculate it or backend might add it to a DTO.
  // Note: 'type' is not on backend Event.java. Remove or make truly optional if it's a frontend-only concept.
  // Note: 'companyId' is redundant if you have the full 'company' object.
}

// For EventAPI.create method, if eventData is a partial Event or a specific DTO:
export type CreateEventPayload = Omit<Event, 'eventId' | 'company' | 'currentParticipants' | 'createdAt' | 'registrations'> & {
  // You might not send currentParticipants initially, backend service initializes it.
  // company object is set by backend service using companyId.
};



export interface Enrollment {
  id: number;
  enrollmentDate: string; // Or Date
  status: string; // e.g., 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
  completionDate?: string; // Or Date
  userId: number;
  courseId: number;
  paymentId?: number;
  course?: Course;
  user?: User;
}

export interface EventRegistration {
  id: number;
  userId: number;
  eventId: number;
  status: string; // e.g., 'REGISTERED', 'CANCELLED', 'ATTENDED'
  registrationDate: string; // Or Date
  attended?: boolean; // Default might be false or null
  event?: Event;
  user?: User;
}

export interface Payment {
  id: number;
  amount: number;
  currency: string; // e.g., 'TND', 'USD'
  status: string; // e.g., 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'
  paymentMethod?: string; // Optional depending on detail level
  transactionReference?: string; // Optional
  paymentDate: string; // Or Date
  courseId?: number;
  eventId?: number;
  userId: number;
}

// --- API Communication & Utility ---

export interface ApiError {
  message: string;
  status: number; // HTTP Status Code
  timestamp?: string; // ISO Date string
  path?: string; // URL path where error occurred
  errors?: Record<string, string[]>; // For field validation errors
}

// Generic API response wrapper (optional, depends on backend consistency)
export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: 'success' | 'error';
};

export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// --- Payment Specific Requests/Responses ---

export interface PaymentInitiateRequest {
  amount: number;
  currency: string;
  courseId?: number;
  eventId?: number;
  paymentMethod?: string; // Optional depending on backend flow
}

export interface PaymentVerificationResponse {
  status: string; // e.g., 'VERIFIED', 'FAILED'
  message: string;
  transactionId?: string; // Optional, transaction ID if available
}

// (Legacy/Alternate) Payment Request structure
export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: string;
  courseId?: number;
  eventId?: number;
}


// --- Database Info (if exposed via API) ---

export interface DatabaseInfo {
  dbName: string;
  version: string;
  driver: string;
  url: string;
}

export interface DatabaseTable {
  name: string;
  schema: string;
  type: string; // e.g., 'TABLE', 'VIEW'
}

export interface DatabaseSequence {
  name: string;
  schema: string;
  value: number;
}

export interface ImageUserMetadata {
  id: number; // The ID of the image record itself
  filename: string;
  contentType: string;
  userId: number; // ID of the user this image belongs to
  createdAt?: string; // ISO Date string (optional based on backend response)
  updatedAt?: string; // ISO Date string (optional based on backend response)
  // Note: The actual image data URL is typically constructed, e.g., /api/image-users/{id}/image
}
