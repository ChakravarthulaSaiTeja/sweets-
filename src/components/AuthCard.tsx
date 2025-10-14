"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle, AlertCircle } from "lucide-react";

interface AuthCardProps {
  onSignIn?: (credentials: { email: string; password: string; remember: boolean }) => Promise<void>;
  onSignUp?: (payload: { name: string; email: string; mobile?: string; password: string }) => Promise<void>;
  onSuccess?: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  mobile?: string;
  terms?: string;
  general?: string;
}

export default function AuthCard({ onSignIn, onSignUp, onSuccess }: AuthCardProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Form state - persists across panel switches
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const signInEmailRef = useRef<HTMLInputElement>(null);
  const signUpNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  useEffect(() => {
    // Focus first input when switching panels
    if (isSignUp && signUpNameRef.current) {
      signUpNameRef.current.focus();
    } else if (!isSignUp && signInEmailRef.current) {
      signInEmailRef.current.focus();
    }
  }, [isSignUp]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 6) return 'weak';
    if (password.length >= 8 && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return 'strong';
    }
    return 'medium';
  };

  const handlePasswordChange = (password: string) => {
    setSignUpForm(prev => ({ ...prev, password }));
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const validateSignInForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!signInForm.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(signInForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!signInForm.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUpForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!signUpForm.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!signUpForm.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(signUpForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (signUpForm.mobile && !/^\+?[\d\s-()]+$/.test(signUpForm.mobile)) {
      newErrors.mobile = 'Please enter a valid phone number';
    }
    
    if (!signUpForm.password) {
      newErrors.password = 'Password is required';
    } else if (signUpForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!signUpForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (signUpForm.password !== signUpForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!signUpForm.terms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignInForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      if (onSignIn) {
        await onSignIn(signInForm);
      } else {
        // Placeholder for NextAuth integration
        // await signIn('credentials', { email: signInForm.email, password: signInForm.password });
        console.log('Sign in with:', signInForm);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setErrors({ general: 'Invalid email or password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUpForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      if (onSignUp) {
        await onSignUp({
          name: signUpForm.name,
          email: signUpForm.email,
          mobile: signUpForm.mobile || undefined,
          password: signUpForm.password,
        });
      } else {
        // Placeholder for API integration
        // const response = await fetch('/api/auth/signup', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(signUpForm),
        // });
        console.log('Sign up with:', signUpForm);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      if (error.message?.includes('email')) {
        setErrors({ email: 'Email already exists. Sign in instead?' });
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = (provider: 'google' | 'apple') => {
    // Placeholder for NextAuth social login
    // signIn(provider, { callbackUrl: '/account' });
    console.log(`Sign in with ${provider}`);
  };

  const togglePanel = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Toggle Control */}
      <div className="flex justify-end mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-white/20">
          <button
            onClick={togglePanel}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              !isSignUp 
                ? 'bg-maroon text-white shadow-md' 
                : 'text-maroon hover:text-gold'
            }`}
            aria-label={isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
          >
            Sign In
          </button>
          <button
            onClick={togglePanel}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isSignUp 
                ? 'bg-maroon text-white shadow-md' 
                : 'text-maroon hover:text-gold'
            }`}
            aria-label={isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Card Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="relative">
          {/* Sign In Panel */}
          <div 
            className={`absolute inset-0 transition-transform duration-400 ease-[cubic-bezier(.2,.9,.2,1)] ${
              isSignUp ? 'translate-x-full' : 'translate-x-0'
            } ${prefersReducedMotion ? 'transition-none' : ''}`}
            style={{ transform: isSignUp ? 'translateX(100%)' : 'translateX(0)' }}
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-maroon to-gold bg-clip-text text-transparent mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600">Sign in to your Kotaiah&apos;s Sweets account</p>
              </div>

              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                  <span className="text-red-700 text-sm">{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      ref={signInEmailRef}
                      id="signin-email"
                      type="email"
                      value={signInForm.email}
                      onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                      className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-maroon focus:border-maroon transition-all duration-300 ${
                        errors.email ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter your email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'signin-email-error' : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="signin-email-error" className="mt-2 text-sm text-red-600" role="alert" aria-live="polite">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={signInForm.password}
                      onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                      className={`block w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-maroon focus:border-maroon transition-all duration-300 ${
                        errors.password ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter your password"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? 'signin-password-error' : undefined}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="signin-password-error" className="mt-2 text-sm text-red-600" role="alert" aria-live="polite">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={signInForm.remember}
                      onChange={(e) => setSignInForm(prev => ({ ...prev, remember: e.target.checked }))}
                      className="h-4 w-4 text-maroon focus:ring-maroon border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <a href="/auth/forgot" className="text-sm text-maroon hover:text-gold transition-colors">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-maroon to-gold hover:from-gold hover:to-maroon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Social Login */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSocialSignIn('google')}
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-maroon transition-all duration-300"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    onClick={() => handleSocialSignIn('apple')}
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-maroon transition-all duration-300"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Apple
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Up Panel */}
          <div 
            className={`absolute inset-0 transition-transform duration-400 ease-[cubic-bezier(.2,.9,.2,1)] ${
              isSignUp ? 'translate-x-0' : '-translate-x-full'
            } ${prefersReducedMotion ? 'transition-none' : ''}`}
            style={{ transform: isSignUp ? 'translateX(0)' : 'translateX(-100%)' }}
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-maroon to-gold bg-clip-text text-transparent mb-2">
                  Join Our Sweet Family
                </h2>
                <p className="text-gray-600">Create your Kotaiah&apos;s Sweets account</p>
              </div>

              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                  <span className="text-red-700 text-sm">{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      ref={signUpNameRef}
                      id="signup-name"
                      type="text"
                      value={signUpForm.name}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, name: e.target.value }))}
                      className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-maroon focus:border-maroon transition-all duration-300 ${
                        errors.name ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter your full name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'signup-name-error' : undefined}
                    />
                  </div>
                  {errors.name && (
                    <p id="signup-name-error" className="mt-2 text-sm text-red-600" role="alert" aria-live="polite">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="signup-email"
                      type="email"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                      className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-maroon focus:border-maroon transition-all duration-300 ${
                        errors.email ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter your email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'signup-email-error' : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="signup-email-error" className="mt-2 text-sm text-red-600" role="alert" aria-live="polite">
                      {errors.email}
                      {errors.email.includes('already exists') && (
                        <button
                          onClick={() => setIsSignUp(false)}
                          className="ml-2 text-maroon hover:text-gold underline"
                        >
                          Sign In instead?
                        </button>
                      )}
                    </p>
                  )}
                </div>

                {/* Mobile Field */}
                <div>
                  <label htmlFor="signup-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="signup-mobile"
                      type="tel"
                      value={signUpForm.mobile}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, mobile: e.target.value }))}
                      className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-maroon focus:border-maroon transition-all duration-300 ${
                        errors.mobile ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter your mobile number"
                      aria-invalid={!!errors.mobile}
                      aria-describedby={errors.mobile ? 'signup-mobile-error' : undefined}
                    />
                  </div>
                  {errors.mobile && (
                    <p id="signup-mobile-error" className="mt-2 text-sm text-red-600" role="alert" aria-live="polite">
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={signUpForm.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={`block w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-maroon focus:border-maroon transition-all duration-300 ${
                        errors.password ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Create a password"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? 'signup-password-error' : undefined}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Meter */}
                  {signUpForm.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%'}` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 capitalize">{passwordStrength}</span>
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p id="signup-password-error" className="mt-2 text-sm text-red-600" role="alert" aria-live="polite">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`block w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-maroon focus:border-maroon transition-all duration-300 ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Confirm your password"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? 'signup-confirm-password-error' : undefined}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p id="signup-confirm-password-error" className="mt-2 text-sm text-red-600" role="alert" aria-live="polite">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={signUpForm.terms}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, terms: e.target.checked }))}
                    className="h-4 w-4 text-maroon focus:ring-maroon border-gray-300 rounded mt-1"
                    aria-invalid={!!errors.terms}
                    aria-describedby={errors.terms ? 'terms-error' : undefined}
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="/terms" className="text-maroon hover:text-gold transition-colors">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <p id="terms-error" className="text-sm text-red-600" role="alert" aria-live="polite">
                    {errors.terms}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-maroon to-gold hover:from-gold hover:to-maroon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account & Continue'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
Unit Test Suggestions:

1. Test panel toggle behavior:
   - expect(screen.getByText('Sign Up')).toBeInTheDocument();
   - fireEvent.click(screen.getByText('Sign Up'));
   - expect(screen.getByText('Join Our Sweet Family')).toBeInTheDocument();

2. Test form validation:
   - fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'invalid-email' } });
   - fireEvent.submit(screen.getByRole('form'));
   - expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

3. Test password strength calculation:
   - fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'weak' } });
   - expect(screen.getByText('weak')).toBeInTheDocument();
   - fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'StrongPass123!' } });
   - expect(screen.getByText('strong')).toBeInTheDocument();

4. Test accessibility:
   - expect(screen.getByLabelText('Email Address')).toHaveAttribute('aria-invalid', 'false');
   - expect(screen.getByRole('alert')).toBeInTheDocument();
*/
