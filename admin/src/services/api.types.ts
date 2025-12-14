// =============================================
// File: src/services/api.types.ts
// Purpose: Define shared TypeScript interfaces for API requests/responses
// =============================================

export interface ModuleCreationPayload {
  title: string;
  description: string;
  moduleOrder: number;
  courseId: number; // This should match the courseId in the path
}

export interface CreatedModuleResponse {
  moduleId: number;
  title: string;
  description: string;
  moduleOrder: number;
  courseId: number;
  courseTitle?: string;
  pdfFilename?: string;
  hasPdf?: boolean;
  videoFilename?: string;
  hasVideo?: boolean;
}

// Interface for Module as used in ModuleManagementModal.tsx
export interface Module {
  moduleId: number;
  title: string;
  description: string;
  moduleOrder: number;
  courseId: number;
  pdfPath?: string;
  videoPath?: string;
}





export interface UserUpdateRequestDTO { // This is your general update DTO
  username?: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  // role?: Role; // Remove role from here if PUT /api/users/{id} no longer handles it
}
export interface UserRoleUpdateRequestDTO {
  role: Role;
}
// --- Enums ---

export enum Role {
  LEARNER = "LEARNER",
  INSTRUCTOR = "INSTRUCTOR",
  COMPANY_REP = "COMPANY_REP",
  ADMIN = "ADMIN"
}

export enum CourseMode {
  IN_PERSON = "IN_PERSON",
  ONLINE = "ONLINE",
  HYBRID = "HYBRID"
}

export enum ReviewableEntityType {
  COURSE = "COURSE",
  INSTRUCTOR = "INSTRUCTOR"
}

export enum ImageEntityType {
  USER = 'USER',
  COURSE = 'COURSE',
  INSTRUCTOR = 'INSTRUCTOR',
}

// --- Core Simple DTOs ---

export interface SimpleUserDTO {
  userId: number;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface SimpleInstructorDTO {
  instructorId: number;
  fullName: string;
  instructorRating?: number | null;
}

export interface SimpleModuleDTO {
  moduleId: number;
  title: string;
  order?: number | null;
}

// --- Authentication ---

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}
export interface Company {
  companyId: number;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  // Assuming User and Service types exist or will be defined
  // representative: User;
  // services: Service[];
  createdAt: string; // Assuming date is returned as a string
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId?: number;
  username?: string;
  email?: string;
  roles: Role[];
}

// --- User Related Types ---

export interface UserResponseDTO {
  userId: number;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: Role; // Make role optional
  createdAt: string;
  updatedAt: string;
}

export interface UserListDTO {
  userId: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface UserCreationRequestDTO {
  username: string;
  email: string;
  password?: string;
  firstName?: string | null;
  lastName?: string | null;
  role: Role;
}

export interface UserUpdateRequestDTO {
  username?: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: Role;
}
// From your api.types.ts
export interface InstructorListDTO {
  id: number; // This matches the 'id: 1' in your log
  name: string; // This matches 'name: "ahmed balti"'
  bio?: string | null;
  rating?: number | null; // This matches 'rating: 4' (assuming number conversion)
  userId: number; // This matches 'userId: 25'
  expertise?: string | null;
}

export interface UserProfileUpdateRequestDTO {
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword: string;
}

// --- Instructor Related Types ---

export interface InstructorResponseDTO {
  instructorId: number;
  user: UserResponseDTO;
  bio?: string | null;
  expertise?: string | null;
  rating?: number | null;
  createdAt: string;
}

export interface InstructorListDTO {
  id: number;
  name: string;
  bio?: string | null;
  rating?: number | null;
  userId: number;
  expertise?: string | null;
}

export interface InstructorInputDTO {
  userId: number;
  bio: string;
  expertise?: string | null;
}

// --- Course Related Types ---

export interface CourseInputDTO {
  title: string;
  description: string;
  category?: string | null;
  mode: CourseMode;
  price?: number | null;
  certificationEligible?: boolean | null;
  level?: string | null;
  startDate?: string | null;
  durationHours?: number | null;
  location?: string | null;
  instructorIds?: number[];
}

// In src/services/api.types.ts
export interface CourseListDTO {
  courseId: number;
  title: string;
  description?: string; // From Java DTO
  category?: string | null;
  mode: CourseMode; // From Java DTO
  price?: number | null;
  certificationEligible?: boolean; // From Java DTO
  createdAt: string; // From Java DTO (LocalDateTime becomes string)

  firstInstructorName?: string | null;
  firstInstructorId?: number | null;

  imageUrl?: string | null;
  level?: string | null;
  startDate?: string | null; // String representation (YYYY-MM-DD)
  duration?: string | null;  // String like "X heures"
  rating?: number | null;
  reviewCount?: number | null;
  participants?: number | null;
  location?: string | null;

  instructors: SimpleInstructorDTO[]; // From Java DTO
  modules: SimpleModuleDTO[];       // From Java DTO
}

export interface CourseDetailResponseDTO extends CourseListDTO {
  description: string;
  certificationEligible?: boolean | null;
}

export interface CourseModuleInputDTO {
  moduleId?: number;
  title: string;
  description?: string | null;
  order?: number | null;
}

export interface CourseModuleDetailDTO {
  moduleId: number;
  title: string;
  description?: string | null;
  moduleOrder?: number;
}

// --- Review & Module Types ---

export interface ReviewCreationRequestDTO {
  reviewedEntityType: ReviewableEntityType;
  reviewedEntityId: number;
  rating: number;
  comment: string;
}

export interface ReviewResponseDTO {
  reviewId: number;
  user: SimpleUserDTO;
  reviewedEntityType: ReviewableEntityType;
  reviewedEntityId: number;
  reviewedItemName?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// --- Frontend Specific Enriched Display/Model Types ---

export interface UserProfile extends UserResponseDTO {
  avatarUrl?: string | null;
  roles: Role[]; // Add roles array to UserProfile
  instructorProfile?: InstructorResponseDTO; // Add instructorProfile
}

export interface InstructorProfile extends InstructorResponseDTO {
  avatarUrl?: string | null;
}

// --- Other Business Domain DTOs ---

export interface CompanyDTO {
  id: number;
  name: string;
  city?: string | null;
  representativeId?: number | null;
  representativeName?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  website?: string | null;
}

export interface CompanyCreateRequest {
  name: string;
  address?: string | null;
  city?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
}

export interface EventDTO {
  eventId: number; // Corrected to match backend and component usage
  title: string;
  description?: string | null; // Made optional based on Event interface
  location?: string | null; // Made optional based on Event interface
  eventDate?: string | null; // Added based on backend and component usage
  registrationDeadline?: string | null; // Added based on backend and component usage
  price?: number | null; // Added based on backend and component usage
  maxParticipants?: number | null; // Added based on backend and component usage
  currentParticipants?: number | null;
  type?: string | null;
  companyId?: number | null;
  companyName?: string | null;
  createdAt: string; // Added based on backend and Event interface
}

/**
 * Matches the backend Certification entity
 */
export interface CertificationDTO {
  certificationId: number;
  user: UserListDTO | UserResponseDTO; // Use a lightweight DTO for lists, or full user for details
  course: CourseListDTO | CourseDetailResponseDTO;
  certificateCode: string;
  issueDate: string;   // ISO string (LocalDateTime)
  expiryDate?: string; // ISO string (nullable)
  status: 'active' | 'expired' | 'revoked';
  createdAt: string;
}

// For creating a certification (request params)
export interface CertificationCreateRequest {
  userId: number;
  courseId: number;
  issueDate: string;   // ISO string
  expiryDate?: string; // ISO string (optional)
}

export interface EnrollmentDTO {
  id: number;
  enrollmentDate: string;
  status: string;
  completionDate?: string | null;
  userId: number;
  courseId: number;
  paymentId?: number | null;
  courseTitle?: string;
  userUsername?: string;
}

export interface EventRegistrationDTO {
  id: number;
  userId: number;
  eventId: number;
  status: string;
  registrationDate: string;
  attended?: boolean | null;
  eventTitle?: string;
  userUsername?: string;
}

// The 'Event' interface seems to be a more detailed version of EventDTO,
// potentially matching the backend entity. Keeping it for reference,
// but using EventDTO for API interactions.
// export interface Event {
//   eventId: number;
//   title: string;
//   description?: string | null;
//   location?: string | null;
//   eventDate?: string | null; // Assuming ISO string
//   registrationDeadline?: string | null; // Assuming ISO string
//   price?: number | null; // Using number for BigDecimal
//   maxParticipants?: number | null;
//   currentParticipants?: number | null;
//   company?: Company; // Assuming Company interface exists
//   registrations?: EventRegistrationDTO[]; // Assuming EventRegistrationDTO exists
//   createdAt: string; // Assuming ISO string
// }

// --- Practical Session Types ---

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

export interface PracticalSessionInputDTO {
    title: string;
    description?: string;
    sessionDateTime: string; // Assuming ISO string from LocalDateTime
    location: string;
    durationMinutes?: number;
    courseId: number;
    conductingInstructorId: number;
    status?: PracticalSessionStatus; // Optional for creation, mandatory for update?
}


// --- Dashboard Stats ---

export interface AdminStatsResponse {
  totalUsers: number;
  totalInstructors: number;
  totalFormations: number;
  totalIncome: number;
  popularFormations: { title: string; enrollmentCount: number; categoryName?: string }[];
  formationsByCategory: { name: string; value: number }[];
  recentEnrollments: { id: number; userName: string; formationTitle: string; enrolledAt: string }[];
  recentReviews: { id: number; formationTitle: string; rating: number; comment: string; userName: string; createdAt: string }[];
};

export interface InstructorStatsResponse {
  totalStudents: number;
  totalFormations: number;
  totalIncome: number;
  formationPerformance: { title: string; enrollments: number; income: number; averageRating: number }[];
  recentEnrollments: { id: number; userName: string; formationTitle: string; enrolledAt: string }[];
  recentReviews: { id: number; formationTitle: string; rating: number; comment: string; userName: string; createdAt: string }[];
}

// --- API Communication & Utility ---

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  validationErrors?: Record<string, string | string[]>;
}

export interface ContactFormRequest {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}

// --- Payment Specific ---

export interface PaymentInitiateRequest {
  amount: number;
  currency: string;
  courseId?: number | null;
  eventId?: number | null;
  description?: string;
}

export type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'succeeded'
  | 'canceled'
  | 'error';

export interface PaymentInitiateResponse {
  clientSecret?: string | null;
  paymentIntentId?: string | null;
  publishableKey?: string | null;
  status: PaymentIntentStatus;
  message?: string;
}

export interface PaymentConfirmationRequest {
  paymentIntentId: string;
}

export interface PaymentDTO {
  id: number;
  amount: number;
  currency: string;
  status: string;
  paymentProvider?: string;
  providerTransactionId?: string | null;
  paymentDate: string;
  courseId?: number | null;
  eventId?: number | null;
  userId: number;
}

// --- Image Metadata ---

export interface ImageMetadataDTO {
  id: number;
  filename?: string | null;
  contentType: string;
  size?: number | null;
  imageUrl: string;
  entityType?: ImageEntityType;
  entityId?: number;
  createdAt: string;
}

// --- Database Info ---

export interface DatabaseInfo {
  dbName: string;
  version: string;
}
