import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { AuthAPI } from '../services/api.service';
import { useForm } from 'react-hook-form';
// Assuming useForm is a custom hook in the hooks directory
// import { useForm } from '../hooks/useForm';

// --- Constants ---
const ROUTE_PATHS = {
  LOGIN: '/login',
};

const VALIDATION_MESSAGES = {
  REQUIRED: (field) => `${field} est requis`,
  MIN_LENGTH: (min) => `Minimum ${min} caractères requis`,
  INVALID_EMAIL: 'Adresse e-mail invalide',
  PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas',
  USERNAME_PATTERN: 'Seules les lettres, chiffres et underscores sont autorisés',
};

const DEFAULT_ROLES = [
  { value: "ROLE_LEARNER", label: "Apprenant" },
  { value: "ROLE_INSTRUCTOR", label: "Instructeur" },
  { value: "ROLE_ADMIN", label: "Admin" },
  { value: "ROLE_COMPANY_REP", label: "Représentant d'entreprise" },
];

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

const InputField = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  icon: Icon, 
  error, 
  register, 
  className = '',
  showPasswordToggle = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          {...register}
          {...props}
          className={`
            w-full ${Icon ? 'pl-10' : 'pl-4'} ${showPasswordToggle ? 'pr-12' : 'pr-4'} py-3
            border rounded-lg bg-white dark:bg-gray-800 
            text-gray-900 dark:text-white placeholder-gray-500
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            transition-all duration-200 ease-in-out
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
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
};

const SelectField = ({ label, name, options, error, register, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <User className="absolute inset-y-0 left-0 ml-3 h-5 w-5 text-gray-400 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      <select
        id={name}
        {...register}
        className={`
          w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          transition-all duration-200 ease-in-out
          ${error 
            ? 'border-red-300 bg-red-50 dark:bg-red-900/20 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          }
        `}
      >
        <option value="">-- Sélectionnez un rôle --</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
    {error && (
      <div className="flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span>{error.message}</span>
      </div>
    )}
  </div>
);

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
export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [apiError, setApiError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
    mode: 'onBlur',
  });

  const passwordValue = watch('password');

  const onSubmit = useCallback(async (formData) => {
    setApiError(null);

    const apiPayload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role ? formData.role.replace(/^ROLE_/, '') : 'LEARNER',
    };

    try {
      await AuthAPI.register(apiPayload);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé. Redirection vers la page de connexion...",
        variant: "default",
      });
      
      setTimeout(() => navigate(ROUTE_PATHS.LOGIN), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.message || "Une erreur inattendue est survenue lors de l'inscription.";
      setApiError(errorMessage);
      
      toast({
        title: "Échec de l'inscription",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [navigate, setError, toast]);

  const handleSocialSignup = (provider) => {
    toast({
      title: "Fonctionnalité à venir",
      description: `L'inscription avec ${provider} sera bientôt disponible !`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <SuccessMessage 
        message="Compte créé avec succès ! Redirection en cours..." 
        visible={showSuccess} 
      />
      
      <AnimatedContainer>
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <AnimatedContainer delay={100}>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Créez votre compte
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Rejoignez-nous aujourd'hui et commencez votre parcours
              </p>
            </div>
          </AnimatedContainer>

       

          {/* Form Card */}
          <AnimatedContainer delay={300}>
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
              {/* API Error */}
              {apiError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <span className="text-sm text-red-800 dark:text-red-200">{apiError}</span>
                  </div>
                </div>
              )}

              {/* Form */}
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Prénom"
                    name="firstName"
                    placeholder="Entrez votre prénom"
                    icon={User}
                    error={errors.firstName}
                    register={register("firstName", {
                      required: VALIDATION_MESSAGES.REQUIRED("Prénom"),
                      maxLength: { value: 50, message: "Max 50 caractères" }
                    })}
                  />
                  <InputField
                    label="Nom de famille"
                    name="lastName"
                    placeholder="Entrez votre nom de famille"
                    icon={User}
                    error={errors.lastName}
                    register={register("lastName", {
                      required: VALIDATION_MESSAGES.REQUIRED("Nom de famille"),
                      maxLength: { value: 50, message: "Max 50 caractères" }
                    })}
                  />
                </div>

                {/* Username */}
                <InputField
                  label="Nom d'utilisateur"
                  name="username"
                  placeholder="Choisissez un nom d'utilisateur"
                  icon={User}
                  error={errors.username}
                  register={register("username", {
                    required: VALIDATION_MESSAGES.REQUIRED("Nom d'utilisateur"),
                    minLength: { value: 3, message: VALIDATION_MESSAGES.MIN_LENGTH(3) },
                    maxLength: { value: 30, message: "Max 30 caractères" },
                    pattern: { value: /^[a-zA-Z0-9_]+$/, message: VALIDATION_MESSAGES.USERNAME_PATTERN },
                  })}
                />

                {/* Email */}
                <InputField
                  label="Adresse e-mail"
                  name="email"
                  type="email"
                  placeholder="Entrez votre adresse e-mail"
                  icon={Mail}
                  error={errors.email}
                  register={register("email", {
                    required: VALIDATION_MESSAGES.REQUIRED("Adresse e-mail"),
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: VALIDATION_MESSAGES.INVALID_EMAIL },
                  })}
                />

                {/* Password */}
                <InputField
                  label="Mot de passe"
                  name="password"
                  type="password"
                  placeholder="Créez un mot de passe fort"
                  icon={Lock}
                  showPasswordToggle={true}
                  error={errors.password}
                  register={register("password", {
                    required: VALIDATION_MESSAGES.REQUIRED("Mot de passe"),
                    minLength: { value: 8, message: VALIDATION_MESSAGES.MIN_LENGTH(8) },
                  })}
                />

                {/* Confirm Password */}
                <InputField
                  label="Confirmer le mot de passe"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  icon={Lock}
                  showPasswordToggle={true}
                  error={errors.confirmPassword}
                  register={register("confirmPassword", {
                    required: VALIDATION_MESSAGES.REQUIRED("Confirmation du mot de passe"),
                    validate: value => value === passwordValue || VALIDATION_MESSAGES.PASSWORD_MISMATCH,
                  })}
                />

              
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Création du compte...
                    </>
                  ) : (
                    'Créer un compte'
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vous avez déjà un compte ?{' '}
                  <button
                    onClick={() => navigate(ROUTE_PATHS.LOGIN)}
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                  >
                    Connectez-vous ici
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
