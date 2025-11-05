"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Phone, Sparkles, Cookie, Candy, Star, Heart, Lock } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [floatingElements, setFloatingElements] = useState<Array<{id: number; x: number; y: number; delay: number}>>([]);

  // Generate floating elements for animation only on client side
  useEffect(() => {
    setFloatingElements(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: emailOrPhone,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EE] via-white to-[#D4AF37]/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#8B1A1A]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F39C12]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating Sweet Icons */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute text-[#D4AF37]/20 animate-bounce"
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
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-glow">
              <Heart className="h-12 w-12 text-white animate-float" />
            </div>
          </div>

          {/* Header */}
          <h1 className="text-5xl font-heading font-bold bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] bg-clip-text text-transparent mb-3 animate-fade-in">
            Welcome Back
          </h1>
          <p className="text-[#8B1A1A] text-xl font-medium mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
            Sign in to your account to continue your sweet journey
          </p>

          {/* Star Rating Display */}
          <div className="flex items-center justify-center mb-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-[#D4AF37] fill-current animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
              ))}
            </div>
            <span className="ml-3 text-[#8B1A1A] font-medium">4.9/5 from 10,000+ customers</span>
          </div>
        </div>

        <form className="mt-8 space-y-6 animate-fade-in" style={{animationDelay: '0.6s'}} onSubmit={handleSubmit}>
          {/* Auth Method Toggle */}
          <div className="flex bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-2 shadow-inner">
            <button
              type="button"
              onClick={() => setAuthMethod("email")}
              className={`flex-1 flex items-center justify-center py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                authMethod === "email"
                  ? "bg-white text-[#8B1A1A] shadow-lg scale-105"
                  : "text-[#8B1A1A] hover:text-[#8B1A1A] hover:scale-102"
              }`}
            >
              <Mail className="h-5 w-5 mr-3" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod("phone")}
              className={`flex-1 flex items-center justify-center py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                authMethod === "phone"
                  ? "bg-white text-[#8B1A1A] shadow-lg scale-105"
                  : "text-[#8B1A1A] hover:text-[#8B1A1A] hover:scale-102"
              }`}
            >
              <Phone className="h-5 w-5 mr-3" />
              Phone
            </button>
          </div>

          {/* Email/Phone Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {authMethod === "email" ? (
                <Mail className="h-5 w-5 text-[#D4AF37] group-focus-within:text-[#8B1A1A] transition-colors duration-300" />
              ) : (
                <Phone className="h-5 w-5 text-[#D4AF37] group-focus-within:text-[#8B1A1A] transition-colors duration-300" />
              )}
            </div>
            <input
              id="emailOrPhone"
              name="emailOrPhone"
              type={authMethod === "email" ? "email" : "tel"}
              autoComplete={authMethod === "email" ? "email" : "tel"}
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="block w-full pl-14 pr-6 py-5 border-2 border-[#fff9e6]  text-[#8B1A1A] rounded-2xl focus:ring-4 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all duration-300 bg-white/70 backdrop-blur-sm text-lg font-medium shadow-inner hover:shadow-lg group-focus-within:shadow-xl"
              placeholder={authMethod === "email" ? "Enter your email" : "Enter your phone number"}
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#D4AF37] group-focus-within:text-[#8B1A1A] transition-colors duration-300" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-14 pr-6 py-5 border-2 border-[#fff9e6]  text-[#8B1A1A] rounded-2xl focus:ring-4 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all duration-300 bg-white/70 backdrop-blur-sm text-lg font-medium shadow-inner hover:shadow-lg group-focus-within:shadow-xl"
              placeholder="Enter your password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-5 px-6 border border-transparent  text-[#8B1A1A] rounded-2xl shadow-2xl text-lg font-bold text-white bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#8B1A1A] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[#8B1A1A]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.05] active:scale-[0.95] hover:shadow-3xl"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-3 border-white mr-4"></div>
                <span className="text-lg">Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Sparkles className="h-6 w-6 mr-3 animate-pulse" />
                <span className="text-lg">Sign In</span>
              </div>
            )}
          </button>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-[#8B1A1A]">
                Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-semibold text-[#8B1A1A] hover:text-[#D4AF37] transition-colors duration-300 hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="text-[#8B1A1A] hover:text-[#8B1A1A] transition-colors duration-300 text-sm font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
