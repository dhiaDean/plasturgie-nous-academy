import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'; // Added useRef
import { getCurrentUser } from '../services/api.service'; // Adjust path if needed
import { getStoredToken, isTokenValid, removeStoredToken, setStoredToken } from '@/lib/utils'; // Adjust path if needed
import { User } from '@/services/api.types'; // Adjust path if needed

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  reloadUser: () => Promise<void>;
}

const defaultAuthContextValue: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as true until initial check is done
  login: () => {},
  logout: () => {},
  reloadUser: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
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
    setIsAuthenticated(currentAuth => (currentAuth !== false ? false : currentAuth));
    setIsLoading(false); // Ensure loading is false after logout
  }, []); // No dependencies = stable reference

  // Function to perform user loading - Stable reference
  const performLoadUser = useCallback(async () => {
    console.log('AuthContext: performLoadUser - Attempting API call...');
    setIsLoading(true);
    try {
      const userData = await getCurrentUser(); // Assumes token is added by interceptor
      setUser(userData);
      setIsAuthenticated(true);
      console.log('AuthContext: performLoadUser - User loaded successfully via API.', userData);
    } catch (error) {
      console.error('AuthContext: performLoadUser - Failed to load user via API.', error);
      logout(); // Call stable logout on failure
    } finally {
      // Check if component is still mounted implicitly by useCallback/closure context
      // Or add explicit isMounted check if needed for complex scenarios
      setIsLoading(false);
    }
  }, [logout]); // Depends only on stable logout


  // --- Effect for Initial Load (Runs ONCE on mount) ---
  useEffect(() => {
    console.log('AuthContext: useEffect [Mount] - Initializing/Token Check...');
    let isMounted = true; // Flag to prevent state updates if unmounted during async ops

    const attemptInitialLoad = async () => {
      const token = getStoredToken();
      const valid = isTokenValid(token);

      if (token && valid) {
        console.log('AuthContext: useEffect [Mount] - Found valid token, loading user...');
        // No need to call performLoadUser here, do it directly
        // to avoid potential race conditions with login calls.
        setIsLoading(true);
         try {
            const userData = await getCurrentUser();
            if (isMounted) {
                 setUser(userData);
                 setIsAuthenticated(true);
                 console.log('AuthContext: useEffect [Mount] - User loaded successfully.');
            }
         } catch (error) {
            console.error('AuthContext: useEffect [Mount] - Initial load failed.', error);
             if (isMounted) {
                removeStoredToken(); // Clean up explicitly
                setUser(null);
                setIsAuthenticated(false);
            }
         } finally {
             if (isMounted) {
                setIsLoading(false);
                initialLoadAttempted.current = true; // Mark initial load attempt as done
             }
         }
      } else {
        console.log(`AuthContext: useEffect [Mount] - No valid token found. Setting initial state.`);
        if (token && !valid) { // Clean up invalid token
            removeStoredToken();
        }
        // Set initial state directly, no need to call logout() here
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        initialLoadAttempted.current = true; // Mark initial load attempt as done
      }
    };

    attemptInitialLoad();

    // Cleanup function runs on unmount
    return () => {
      isMounted = false;
      console.log('AuthContext: useEffect [Mount] - Cleanup.');
    };
  }, []); // <-- ** EMPTY DEPENDENCY ARRAY ** Ensures this runs only ONCE


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
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);