import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'; // Added useRef
import { getStoredToken, isTokenValid, removeStoredToken, setStoredToken } from '@/lib/utils'; // Adjust path if needed
import { UserAPI, InstructorAPI } from '@/services/api.service'; // Adjust path if needed
import { UserProfile, Role, InstructorProfile } from '@/services/api.types';

interface AuthContextType {
  user: UserProfile | null;
  instructorProfile: InstructorProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  reloadUser: () => Promise<void>;
}

const defaultAuthContextValue: AuthContextType = {
  user: null,
  instructorProfile: null,
  isAuthenticated: false,
  isLoading: true, // Start as true until initial check is done
  login: () => {},
  logout: () => {},
  reloadUser: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [instructorProfile, setInstructorProfile] = useState<InstructorProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading

  // useRef to track if the initial load has been attempted.
  // This helps prevent login/reload calls from interfering before mount effect finishes.
  const initialLoadAttempted = useRef(false);

  // --- Stable Callback Functions ---

  // Logout function - Make completely stable with empty dependency array
  const logout = useCallback(() => {
    console.log('AuthContext: Performing Logout.');
    removeStoredToken();
    // Check current state to prevent unnecessary updates if already logged out
    setUser(currentUser => (currentUser !== null ? null : currentUser));
    setInstructorProfile(currentProfile => (currentProfile !== null ? null : currentProfile));
    setIsAuthenticated(currentAuth => (currentAuth !== false ? false : currentAuth));
    setIsLoading(false); // Ensure loading is false after logout
  }, []); // No dependencies = stable reference

  // Function to perform user loading - Stable reference
  const performLoadUser = useCallback(async () => {
    console.log('AuthContext: performLoadUser - Attempting API call...');
    setIsLoading(true);
    try {
      const { data } = await UserAPI.getCurrentUserProfile();
      
      // Log the raw response for debugging
      console.log('AuthContext: Raw API Response:', JSON.stringify(data, null, 2));

      // Validate required fields
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid API response: Expected an object but received ' + typeof data);
      }

      // Map Spring Boot response fields to our User interface
      const userData: UserProfile = {
        userId: data.userId, // Use userId to match UserProfile/UserResponseDTO
        username: data.username,
        email: data.email,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        roles: [], // Initialize empty array
        avatarUrl: data.avatarUrl,
        createdAt: data.createdAt, // Add createdAt
        updatedAt: data.updatedAt, // Add updatedAt
      };

      // Handle roles - Spring Boot might send a single role or an array
      if (data.role) {
        // Single role case
        const roleStr = data.role.toString().toUpperCase();
        if (roleStr in Role) {
          userData.roles = [Role[roleStr as keyof typeof Role]];
        }
      } else if (Array.isArray(data.role)) {
        // Multiple roles case
        userData.roles = data.role
          .map(role => {
            const roleStr = role.toString().toUpperCase();
            return Role[roleStr as keyof typeof Role];
          })
          .filter(role => role !== undefined);
      }

      // Log the constructed user data
      console.log('AuthContext: Constructed User Data:', userData);
      
      setUser(userData);
      setIsAuthenticated(true);
      console.log('AuthContext: performLoadUser - User loaded successfully.');

      // Attempt to load instructor profile if user is an instructor
      if (userData.roles.includes(Role.INSTRUCTOR)) {
        try {
          const instructorResponse = await InstructorAPI.getByUserId(userData.userId);
          setInstructorProfile(instructorResponse.data || null);
          console.log('AuthContext: Instructor profile loaded.');
        } catch (instructorErr) {
          console.error('AuthContext: Failed to load instructor profile:', instructorErr);
          setInstructorProfile(null); // Ensure profile is null on error
        }
      } else {
        setInstructorProfile(null); // Ensure profile is null if not an instructor
      }


    } catch (error) {
      console.error('AuthContext: performLoadUser - Error details:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);


  // --- Effect for Initial Load (Runs ONCE on mount) ---
  useEffect(() => {
    console.log('AuthContext: useEffect [Mount] - Initializing/Token Check...');
    let isMounted = true; // Flag to prevent state updates if unmounted during async ops

    const attemptInitialLoad = async () => {
      const token = getStoredToken();
      const valid = isTokenValid(token);

      if (token && valid) {
        console.log('AuthContext: useEffect [Mount] - Found valid token, loading user...');
        setIsLoading(true);
        try {
          const { data } = await UserAPI.getCurrentUserProfile();
          
          if (!isMounted) return;

          // Validate required fields
          if (!data || typeof data !== 'object') {
            throw new Error('Invalid API response: Expected an object but received ' + typeof data);
          }

          if (!data.userId || !data.username || !data.email) {
            throw new Error('Missing required user fields in API response');
          }

          // Convert role string to Role enum value and validate it
          let roleValue: Role | undefined;
          if (data.role && typeof data.role === 'string') {
            const normalizedRole = data.role.toUpperCase() as keyof typeof Role;
            if (Role[normalizedRole]) {
              roleValue = Role[normalizedRole];
            }
          }

          // Construct user object with type safety and field mapping
          const userData: UserProfile = {
            userId: Number(data.userId), // Use userId to match UserProfile/UserResponseDTO
            username: String(data.username),
            email: String(data.email),
            firstName: data.firstName ? String(data.firstName) : undefined,
            lastName: data.lastName ? String(data.lastName) : undefined,
            roles: roleValue ? [roleValue] : [], // Add the validated role to the array
            avatarUrl: undefined,
            createdAt: data.createdAt, // Add createdAt
            updatedAt: data.updatedAt, // Add updatedAt
          };

          setUser(userData);
          setIsAuthenticated(true);
          console.log('AuthContext: useEffect [Mount] - User loaded successfully.');

          // Attempt to load instructor profile if user is an instructor
          if (userData.roles.includes(Role.INSTRUCTOR)) {
            try {
              const instructorResponse = await InstructorAPI.getByUserId(userData.userId);
              if (isMounted) {
                 setInstructorProfile(instructorResponse.data || null);
                 console.log('AuthContext: useEffect [Mount] - Instructor profile loaded.');
              }
            } catch (instructorErr) {
              console.error('AuthContext: useEffect [Mount] - Failed to load instructor profile:', instructorErr);
              if (isMounted) {
                setInstructorProfile(null); // Ensure profile is null on error
              }
            }
          } else {
             if (isMounted) {
                setInstructorProfile(null); // Ensure profile is null if not an instructor
             }
          }


        } catch (error) {
          console.error('AuthContext: performLoadUser - Error details:', error);
          logout();
        } finally {
          if (isMounted) {
            setIsLoading(false);
            initialLoadAttempted.current = true;
          }
        }
      } else {
        console.log(`AuthContext: useEffect [Mount] - No valid token found. Setting initial state.`);
        if (token && !valid) {
          removeStoredToken();
        }
        setUser(null);
        setInstructorProfile(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        initialLoadAttempted.current = true;
      }
    };

    attemptInitialLoad();

    return () => {
      isMounted = false;
      console.log('AuthContext: useEffect [Mount] - Cleanup.');
    };
  }, [logout]);


  // --- Context Functions ---

  // Login function
  const login = useCallback((token: string) => {
    console.log('AuthContext: login() called.');
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
       console.error('AuthContext Login Warning: Received an invalid token format!', token);
    }
    setStoredToken(token);
    console.log('AuthContext: login - Triggering user load via performLoadUser()...');
    performLoadUser(); // Use the stable loading function
  }, [performLoadUser]); // Depends on stable function

  // Reload user function
  const reloadUser = useCallback(async () => {
    console.log('AuthContext: reloadUser() called.');
    // Optional: Check if initial load is done if race conditions are a concern
    // if (!initialLoadAttempted.current) {
    //    console.warn("AuthContext: reloadUser called before initial load finished.");
    //    return;
    // }
    const token = getStoredToken();
    if (token && isTokenValid(token)) {
        await performLoadUser(); // Use the stable loading function
    } else {
        console.warn('AuthContext: reloadUser() called but no valid token found.');
        logout(); // Ensure logout if token became invalid
    }
  }, [performLoadUser, logout]); // Depends on stable functions

  // --- Provider ---
  return (
    <AuthContext.Provider value={{ user, instructorProfile, isAuthenticated, isLoading, login, logout, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
