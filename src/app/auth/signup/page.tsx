"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Sparkles, Cookie, Candy, Star, Heart, User, Lock } from "lucide-react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [isLoading, setIsLoading] = useState(false);

  // Generate floating elements for animation
  const floatingElements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading for demo
    setTimeout(() => {
      setIsLoading(false);
      alert("This is a demo version. Registration is not functional.");
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
            {element.id % 4 === 0 ? (
              <Cookie className="h-6 w-6" />
            ) : element.id % 4 === 1 ? (
              <Candy className="h-6 w-6" />
            ) : element.id % 4 === 2 ? (
              <Star className="h-6 w-6" />
            ) : (
              <Heart className="h-6 w-6" />
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
            Join Our Sweet Family
          </h1>
          <p className="text-[#8B1A1A] text-xl font-medium mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
            Create your account and start your delicious journey with us
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
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#D4AF37] group-focus-within:text-[#8B1A1A] transition-colors duration-300" />
              </div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="block w-full pl-14 pr-6 py-4 border-2 border-[#fff9e6]  text-[#8B1A1A] rounded-xl focus:ring-4 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium text-[#8B1A1A] shadow-inner hover:shadow-lg group-focus-within:shadow-xl"
                placeholder="First Name"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#D4AF37] group-focus-within:text-[#8B1A1A] transition-colors duration-300" />
              </div>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="block w-full pl-14 pr-6 py-4 border-2 border-[#fff9e6]  text-[#8B1A1A] rounded-xl focus:ring-4 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium text-[#8B1A1A] shadow-inner hover:shadow-lg group-focus-within:shadow-xl"
                placeholder="Last Name"
              />
            </div>
          </div>

          {/* Auth Method Toggle */}
          <div className="flex bg-gradient-to-r from-[#FFF7EE] to-[#fff9e6] rounded-2xl p-2 shadow-inner">
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
              id={authMethod === "email" ? "email" : "phone"}
              name={authMethod === "email" ? "email" : "phone"}
              type={authMethod === "email" ? "email" : "tel"}
              autoComplete={authMethod === "email" ? "email" : "tel"}
              required
              value={authMethod === "email" ? formData.email : formData.phone}
              onChange={handleInputChange}
              className="block w-full pl-14 pr-6 py-4 border-2 border-[#fff9e6]  text-[#8B1A1A] rounded-xl focus:ring-4 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-inner hover:shadow-lg group-focus-within:shadow-xl"
              placeholder={authMethod === "email" ? "Enter your email" : "Enter your phone number"}
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#D4AF37] group-focus-within:text-[#8B1A1A] transition-colors duration-300" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full pl-14 pr-6 py-4 border-2 border-[#fff9e6]  text-[#8B1A1A] rounded-xl focus:ring-4 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-inner hover:shadow-lg group-focus-within:shadow-xl"
                placeholder="Enter your details"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#D4AF37] group-focus-within:text-[#8B1A1A] transition-colors duration-300" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="block w-full pl-14 pr-6 py-4 border-2 border-[#fff9e6]  text-[#8B1A1A] rounded-xl focus:ring-4 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-inner hover:shadow-lg group-focus-within:shadow-xl"
                placeholder="Enter your details"
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              required
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="h-5 w-5 text-[#8B1A1A] focus:ring-[#8B1A1A] border-[#fff9e6]  text-[#8B1A1A] rounded transition-all duration-300"
            />
            <label htmlFor="agreeToTerms" className="ml-3 text-sm text-[#8B1A1A]">
              I agree to the{" "}
              <Link href="/terms" className="text-[#8B1A1A] hover:text-[#D4AF37] transition-colors duration-300 hover:underline">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#8B1A1A] hover:text-[#D4AF37] transition-colors duration-300 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.agreeToTerms}
            className="w-full flex justify-center py-5 px-6 border border-transparent  text-[#8B1A1A] rounded-2xl shadow-2xl text-lg font-bold text-white bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#8B1A1A] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[#8B1A1A]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.05] active:scale-[0.95] hover:shadow-3xl"
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

          {/* Demo Notice */}
          <div className="bg-[#ffedd5] border border-[#fed7aa]  text-[#8B1A1A] rounded-xl p-4 text-center">
            <p className="text-[#D4AF37] text-sm font-medium">
              🎭 Demo Version - Registration is not functional
            </p>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-[#8B1A1A]">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-semibold text-[#8B1A1A] hover:text-[#D4AF37] transition-colors duration-300 hover:underline"
              >
                Sign in here
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

