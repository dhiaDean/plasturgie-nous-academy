import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Eye, EyeOff, User, Lock, LogIn, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthAPI } from '../services/api.service';

// --- Constants ---
const ROUTE_PATHS = {
  FORGOT_PASSWORD: '/forgot-password',
  REGISTER: '/register',
  DEFAULT_REDIRECT: '/',
};

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Nom d\'utilisateur ou mot de passe invalide. Veuillez réessayer.',
  GENERIC_LOGIN_FAILURE: 'Échec de la connexion. Veuillez réessayer plus tard.',
  INVALID_RESPONSE: 'Réponse invalide reçue du serveur.',
  UNEXPECTED: 'Une erreur inattendue est survenue. Veuillez réessayer.',
};

// --- Type Definitions ---
interface ApiError extends Error {
  response?: { status: number; data?: any; };
  status?: number;
}

function isApiError(error) {
  if (error && typeof error === 'object' && 'message' in error) {
    return 'response' in error || 'status' in error;
  }
  return false;
}

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
  error?: string | null;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  rightElement?: React.ReactNode;
  [x: string]: any; // Allow other props
}

// --- Components ---
const AnimatedContainer = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
};

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  icon: Icon, 
  error, 
  value,
  onChange,
  disabled = false,
  showPasswordToggle = false,
  rightElement,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {rightElement}
      </div>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
          className={`
            w-full ${Icon ? 'pl-10' : 'pl-4'} ${showPasswordToggle ? 'pr-12' : 'pr-4'} py-3
            border rounded-lg bg-white dark:bg-gray-800 
            text-gray-900 dark:text-white placeholder-gray-500
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            transition-all duration-200 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error 
              ? 'border-red-300 bg-red-50 dark:bg-red-900/20 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
          `}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

const SocialButton = ({ provider, icon, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {icon}
    <span className="ml-2 text-sm font-medium">{provider}</span>
  </button>
);

const SuccessMessage = ({ message, visible }) => (
  <div className={`
    fixed top-4 right-4 z-50 max-w-sm p-4 bg-green-100 dark:bg-green-900/30 
    border border-green-200 dark:border-green-800 rounded-lg shadow-lg
    transition-all duration-300 ease-in-out
    ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
  `}>
    <div className="flex items-center space-x-2">
      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
      <span className="text-sm text-green-800 dark:text-green-200">{message}</span>
    </div>
  </div>
);

// --- Main Component ---
export default function Login() {
  // --- Hooks ---
  const { login: setAuthToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine redirect path once on mount
  const redirectPath = useMemo(() => {
    return location.state?.from?.pathname || ROUTE_PATHS.DEFAULT_REDIRECT;
  }, [location.state?.from?.pathname]);

  // --- State ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Refs for focusing
  const usernameInputRef = useRef(null);

  // --- Derived State ---
  const isSubmitDisabled = isLoading || !username || !password;

  // --- Event Handlers ---
  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
    if (error) setError(null);
  }, [error]);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    if (error) setError(null);
  }, [error]);

  // Form submission handler
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (isSubmitDisabled) return;

    setError(null);
    setIsLoading(true);

    const credentials = {
      username: username.trim(),
      password: password,
    };

    try {
      const response = await AuthAPI.login(credentials);
      
      // Extract the token from the response
      let token = '';
      if (response && typeof response === 'object') {
        token = response.access_token || response.token || '';
      }

      // Validate token
      if (token && typeof token === 'string') {
        setAuthToken(token);
        setShowSuccess(true);
        
        setTimeout(() => {
          setShowSuccess(false);
          navigate(redirectPath, { replace: true });
        }, 1500);
      } else {
        console.error('Login API response missing access token:', response);
        setError(ERROR_MESSAGES.INVALID_RESPONSE);
      }
    } catch (err) {
      console.error("Login failed:", err);

      if (isApiError(err)) {
        const status = err.response?.status ?? err.status;
        if (status === 401) {
          setError(ERROR_MESSAGES.INVALID_CREDENTIALS);
        } else {
          setError(ERROR_MESSAGES.GENERIC_LOGIN_FAILURE);
        }
      } else if (err instanceof Error) {
        setError(ERROR_MESSAGES.GENERIC_LOGIN_FAILURE);
      } else {
        setError(ERROR_MESSAGES.UNEXPECTED);
      }
    } finally {
      setIsLoading(false);
    }
  }, [username, password, isSubmitDisabled, setAuthToken, navigate, redirectPath]);

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);
    // Implement social login logic here
  };

  const handleForgotPassword = () => {
    navigate(ROUTE_PATHS.FORGOT_PASSWORD);
  };

  const handleSignUp = () => {
    navigate(ROUTE_PATHS.REGISTER);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <SuccessMessage 
        message="Connexion réussie ! Redirection en cours..." 
        visible={showSuccess} 
      />
      
      <AnimatedContainer>
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <AnimatedContainer delay={100}>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <LogIn className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Bienvenue
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Connectez-vous à votre compte pour continuer
              </p>
            </div>
          </AnimatedContainer>

       
       

          {/* Login Card */}
          <AnimatedContainer delay={300}>
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Échec de la connexion</h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <div className="space-y-6">
                {/* Username Field */}
                <InputField
                  label="Nom d'utilisateur"
                  name="username"
                  placeholder="Entrez votre nom d'utilisateur"
                  icon={User}
                  value={username}
                  onChange={handleUsernameChange}
                  disabled={isLoading}
                  error={error && username === '' ? 'Le nom d\'utilisateur est requis' : null}
                  autoComplete="username"
                  required
                />

                {/* Password Field */}
                <InputField
                  label="Mot de passe"
                  name="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  icon={Lock}
                  showPasswordToggle={true}
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  error={error && password === '' ? 'Le mot de passe est requis' : null}
                  autoComplete="current-password"
                  required
                  rightElement={
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                    >
                      Mot de passe oublié ?
                    </button>
                  }
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Se connecter
                    </>
                  )}
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vous n'avez pas de compte ?{' '}
                  <button
                    onClick={handleSignUp}
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                  >
                    Inscrivez-vous ici
                  </button>
                </p>
              </div>
            </div>
          </AnimatedContainer>

      
       
        </div>
      </AnimatedContainer>
    </div>
  );
}
