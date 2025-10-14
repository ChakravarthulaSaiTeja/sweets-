"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, ArrowLeft, Sparkles, Heart, User, CheckCircle, Star, Cookie, Candy } from "lucide-react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    emailOrPhone: "",
    authMethod: "email" as "email" | "phone",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const router = useRouter();

  // Generate floating sweet icons
  useEffect(() => {
    const elements = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setFloatingElements(elements);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call for user registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll simulate a successful signup
      setSuccess(true);
      
      // After showing success, redirect to sign in
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
      
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF7EE] via-white to-[#C79A2A]/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Enhanced Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#C79A2A]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Floating Success Icons */}
          {floatingElements.map((element) => (
            <div
              key={element.id}
              className="absolute text-green-500/20 animate-bounce"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                animationDelay: `${element.delay}s`,
                animationDuration: '2s'
              }}
            >
              <CheckCircle className="h-8 w-8" />
            </div>
          ))}
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-heading font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-6 animate-fade-in">
              Welcome to Kotaiah&apos;s!
            </h1>
            <p className="text-gray-600 text-xl font-medium mb-8">
              Your account has been created successfully. You&apos;ll receive a magic link shortly.
            </p>
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/30 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-3 border-[#7B1E2D] mr-3"></div>
                <p className="text-lg font-semibold text-gray-700">
                  Redirecting to sign in page...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EE] via-white to-[#C79A2A]/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#7B1E2D]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#C79A2A]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F39C12]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating Sweet Icons */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute text-[#C79A2A]/20 animate-bounce"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: '3s'
            }}
          >
            {element.id % 3 === 0 ? (
              <Cookie className="h-6 w-6" />
            ) : element.id % 3 === 1 ? (
              <Candy className="h-6 w-6" />
            ) : (
              <Star className="h-6 w-6" />
            )}
          </div>
        ))}
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-[#7B1E2D] hover:text-[#C79A2A] transition-all duration-300 mb-8 group transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>
          
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse">
                <Heart className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-heading font-bold bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] bg-clip-text text-transparent mb-3 animate-fade-in">
              Join Our Sweet Family
            </h1>
            <p className="text-gray-600 text-xl font-medium">
              Create your Kotaiah&apos;s Sweets account
            </p>
            <div className="flex justify-center mt-4 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-[#C79A2A] fill-current animate-pulse" style={{animationDelay: `${i * 0.2}s`}} />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Sign Up Form */}
        <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/30 transform hover:scale-[1.02] transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                {error}
              </div>
            )}

            {/* Enhanced Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="h-6 w-6 text-[#C79A2A] group-focus-within:text-[#7B1E2D] transition-colors duration-300" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="block w-full pl-14 pr-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#7B1E2D]/20 focus:border-[#7B1E2D] transition-all duration-300 bg-white/70 backdrop-blur-sm text-lg font-medium shadow-inner hover:shadow-lg"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Enhanced Auth Method Toggle */}
            <div className="flex bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-2 shadow-inner">
              <button
                type="button"
                onClick={() => handleInputChange("authMethod", "email")}
                className={`flex-1 flex items-center justify-center py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                  formData.authMethod === "email"
                    ? "bg-white text-[#7B1E2D] shadow-lg scale-105"
                    : "text-gray-600 hover:text-[#7B1E2D] hover:scale-102"
                }`}
              >
                <Mail className="h-5 w-5 mr-3" />
                Email
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("authMethod", "phone")}
                className={`flex-1 flex items-center justify-center py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                  formData.authMethod === "phone"
                    ? "bg-white text-[#7B1E2D] shadow-lg scale-105"
                    : "text-gray-600 hover:text-[#7B1E2D] hover:scale-102"
                }`}
              >
                <Phone className="h-5 w-5 mr-3" />
                Phone
              </button>
            </div>

            {/* Enhanced Email/Phone Field */}
            <div>
              <label htmlFor="emailOrPhone" className="block text-sm font-semibold text-gray-700 mb-3">
                {formData.authMethod === "email" ? "Email Address" : "Phone Number"}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  {formData.authMethod === "email" ? (
                    <Mail className="h-6 w-6 text-[#C79A2A] group-focus-within:text-[#7B1E2D] transition-colors duration-300" />
                  ) : (
                    <Phone className="h-6 w-6 text-[#C79A2A] group-focus-within:text-[#7B1E2D] transition-colors duration-300" />
                  )}
                </div>
                <input
                  id="emailOrPhone"
                  name="emailOrPhone"
                  type={formData.authMethod === "email" ? "email" : "tel"}
                  autoComplete={formData.authMethod === "email" ? "email" : "tel"}
                  required
                  value={formData.emailOrPhone}
                  onChange={(e) => handleInputChange("emailOrPhone", e.target.value)}
                  className="block w-full pl-14 pr-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#7B1E2D]/20 focus:border-[#7B1E2D] transition-all duration-300 bg-white/70 backdrop-blur-sm text-lg font-medium shadow-inner hover:shadow-lg"
                  placeholder={formData.authMethod === "email" ? "Enter your email" : "Enter your phone number"}
                />
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-5 px-6 border border-transparent rounded-2xl shadow-2xl text-lg font-bold text-white bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] hover:from-[#C79A2A] hover:to-[#7B1E2D] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[#7B1E2D]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.05] active:scale-[0.95] hover:shadow-3xl"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-3 border-white mr-4"></div>
                  <span className="text-lg">Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Sparkles className="h-6 w-6 mr-3 animate-pulse" />
                  <span className="text-lg">Create Account</span>
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Sign Up */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full inline-flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-maroon transition-all duration-300 transform hover:scale-[1.02]"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full inline-flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-maroon transition-all duration-300 transform hover:scale-[1.02]"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </button>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-maroon hover:text-gold transition-colors duration-300 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}