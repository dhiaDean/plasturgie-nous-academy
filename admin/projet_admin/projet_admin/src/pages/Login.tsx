import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthAPI } from '@/services/api.service';
import type { LoginRequest, AuthResponse } from '@/services/api.types'; // Ensure AuthResponse is imported

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

// --- Constants ---
const ROUTE_PATHS = {
  FORGOT_PASSWORD: '/forgot-password',
  REGISTER: '/register',
  DEFAULT_REDIRECT: '/',
};

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'login.error.invalidCredentials',
  GENERIC_LOGIN_FAILURE: 'login.error.genericLoginFailure',
  INVALID_RESPONSE: 'login.error.invalidResponse',
  UNEXPECTED: 'login.error.unexpected',
};

// --- Type Definitions ---
interface ApiError extends Error {
   response?: { status: number; data?: any; };
   status?: number;
}

// Type guard function
function isApiError(error: unknown): error is ApiError {
  if (error && typeof error === 'object' && 'message' in error) {
    return 'response' in error || 'status' in error;
  }
  return false;
}

/**
 * Login Component
 */
function Login() {
  // --- Hooks ---
  const { t } = useTranslation();
  const { login: setAuthContext } = useAuth(); // Renamed for clarity
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = useMemo(() => location.state?.from?.pathname || ROUTE_PATHS.DEFAULT_REDIRECT, [location.state?.from?.pathname]);

  // --- State ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);

  // --- Derived State ---
  const isSubmitDisabled = isLoading || !username || !password;

  // --- Event Handlers ---
  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value); setError(null); }, []);
  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); setError(null); }, []);

  // Form submission handler
  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitDisabled) return;

    setError(null);
    setIsLoading(true);

    // FIX 1: Change `usernameOrEmail` to `username` to match backend AuthRequest DTO
    const credentials: LoginRequest = {
      username: username.trim(), // Changed from usernameOrEmail
      password: password.trim(),
    };

    try {
      // AuthAPI.login returns Promise<AxiosResponse<AuthResponse>>
      const response = await AuthAPI.login(credentials);
      const responseData: AuthResponse | null = response?.data;

      let token = '';
      if (responseData && typeof responseData === 'object') {
        // FIX 2: Change `accessToken` to `access_token` to match backend AuthResponse DTO JSON key
        token = responseData.access_token || ''; // Changed from responseData.accessToken
      }

      if (token && typeof token === 'string') {
        console.log("Login successful, setting token and navigating...");
        setAuthContext(token);
        navigate(redirectPath, { replace: true });
      } else {
        console.error('Login API response missing or invalid access token:', responseData);
        setError(ERROR_MESSAGES.INVALID_RESPONSE);
      }
    } catch (err: unknown) {
        console.error("Login failed:", err);

        if (isApiError(err)) {
             const status = err.response?.status ?? err.status;
             if (status === 401) { // Backend AuthController returns 401 for authentication failures
                setError(ERROR_MESSAGES.INVALID_CREDENTIALS);
             } else { // Other errors, including 400 for validation
                 console.error("Login API error response data:", err.response?.data);
                 const backendMessage = err.response?.data?.message;
                 // Use backend message if available, otherwise generic
                 setError(backendMessage || ERROR_MESSAGES.GENERIC_LOGIN_FAILURE);
             }
        } else if (err instanceof Error) {
            setError(ERROR_MESSAGES.GENERIC_LOGIN_FAILURE);
        } else {
            setError(ERROR_MESSAGES.UNEXPECTED);
        }
    } finally {
      setIsLoading(false);
    }
  }, [username, password, isSubmitDisabled, setAuthContext, navigate, redirectPath, t]); // Added t to dependency array as it's used in error messages

  // --- Render ---
  return (
    <div className="flex justify-center items-center min-h-[70vh] p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">{t('login.title')}</CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <div ref={errorAlertRef} id="login-error-alert" role="alert" className='mb-4'>
                 <Alert variant="destructive">
                 <AlertTitle>{t('login.error.loginFailed')}</AlertTitle>
                 <AlertDescription>{t(error || ERROR_MESSAGES.UNEXPECTED)}</AlertDescription>
                 </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
             {error && <span id="form-error-description" className="sr-only">{t(error || ERROR_MESSAGES.UNEXPECTED)}</span>}

            <div className="space-y-1.5">
              <Label htmlFor="username">{t('login.label.username')}</Label>
              <Input
                ref={usernameInputRef}
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                required
                disabled={isLoading}
                autoComplete="username"
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "login-error-alert" : undefined}
                className="w-full"
                placeholder={t('login.placeholder.username')}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">{t('login.label.password')}</Label>
                <Link to={ROUTE_PATHS.FORGOT_PASSWORD} className="text-sm text-blue-600 hover:underline">
                  {t('login.link.forgotPassword')}
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                disabled={isLoading}
                autoComplete="current-password"
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "login-error-alert" : undefined}
                className="w-full"
                placeholder={t('login.placeholder.password')}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full bg-brand-purple hover:bg-brand-dark-purple"
              aria-busy={isLoading}
              aria-label={isLoading ? t('login.button.signingIn') : t('login.button.signInAccount')}
            >
              {isLoading ? t('login.button.signingIn') : t('login.button.signIn')}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-gray-600">
            {t('login.text.noAccount')} 
            <Link to={ROUTE_PATHS.REGISTER} className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
              {t('login.link.signUp')}
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;