import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/services/api.types'; // Keep Role import

// =============================================
// *** ADD THIS INTERFACE DEFINITION ***
// =============================================
interface ProtectedRouteProps {
  children: React.ReactNode;  // Standard prop for component children
  requiredRoles?: Role[]; // Use the Role enum type for requiredRoles prop
}
// =============================================
// *** END OF ADDED INTERFACE ***
// =============================================


export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  // Default to empty array if requiredRoles is not provided
  requiredRoles = []
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) { return <div>Loading authentication status...</div>; }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check roles only if requiredRoles array has items
  if (requiredRoles.length > 0) {
    if (!user || !Array.isArray(user.roles)) { // Check user and roles array exist
        console.warn('ProtectedRoute: Authenticated but user data/roles not available for role check.');
        // Decide how to handle: show loading, redirect, or error
        return <div>Loading user data...</div>;
    } else {
        // Check if the user's roles array contains AT LEAST ONE of the required roles
        const hasRequiredRole = requiredRoles.some(requiredRoleEnum =>
             user.roles.includes(requiredRoleEnum) // Direct enum comparison
         );

        if (!hasRequiredRole) {
          console.log(`ProtectedRoute: User roles [${user.roles.join(', ')}] do not include required roles [${requiredRoles.join(', ')}]. Redirecting.`);
          // Redirect to an unauthorized page or maybe the home page
          return <Navigate to="/unauthorized" replace />;
        }
    }
  }

  // If authenticated AND (no roles required OR user has a required role)
  console.log('ProtectedRoute: Access granted.');
  return <>{children}</>; // Render the protected content
};

// Optional: Export default if this is the main export of the file
// export default ProtectedRoute;