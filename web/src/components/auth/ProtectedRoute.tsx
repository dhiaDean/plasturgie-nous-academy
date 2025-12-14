import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
// Assuming you have a LoadingSpinner component
// import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = []
}) => {
  const { isAuthenticated, user, isLoading } = useAuth(); // Destructure isLoading
  const location = useLocation();

  // If the initial auth check is still loading, display a loading indicator
  if (isLoading) {
    // Replace with your actual loading component
    // return <LoadingSpinner />;
    return <div>Loading authentication status...</div>;
  }

  // If not loading and not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, check roles if required
  if (requiredRoles.length > 0) {
    // Ensure user data is loaded before checking roles
    if (!user) {
        // This state might occur briefly if isAuthenticated is true but user fetch is delayed
        // Or if loadUser failed but didn't reset isAuthenticated correctly (shouldn't happen with current AuthContext)
        console.warn('ProtectedRoute: Authenticated but user data not available for role check. Displaying loading/error or redirecting.');
        // Option 1: Show loading (might cause flicker if user loads quickly)
         return <div>Loading user data for role check...</div>;
        // Option 2: Redirect to unauthorized or a generic error page
        // return <Navigate to="/unauthorized" replace />;
        // Option 3: Log error and potentially redirect to login as something is wrong
        // console.error("User data missing despite being authenticated.");
        // return <Navigate to="/login" state={{ from: location }} replace />;
    } else {
        const hasRequiredRole = requiredRoles.some(role =>
          user.roles?.includes(role) // Add optional chaining for roles array safety
        );

        if (!hasRequiredRole) {
          console.log(`ProtectedRoute: User roles [${user.roles?.join(', ')}] do not include required roles [${requiredRoles.join(', ')}]. Redirecting to unauthorized.`);
          return <Navigate to="/unauthorized" replace />;
        }
    }
  }

  // If authenticated and (no roles required or has required roles)
  console.log('ProtectedRoute: Access granted.');
  return <>{children}</>;
};