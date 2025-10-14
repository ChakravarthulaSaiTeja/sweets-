"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      case "Default":
        return "An error occurred during authentication.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-gold/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-saffron/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-maroon hover:text-gold transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>
          
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-full shadow-lg">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-2">
              Authentication Error
            </h1>
            <p className="text-gray-600 text-lg">
              Something went wrong during the sign-in process
            </p>
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              {getErrorMessage(error)}
            </div>

            <div className="space-y-4">
              <Link
                href="/auth/signin"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-maroon to-gold hover:from-gold hover:to-maroon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Try Again
              </Link>

              <Link
                href="/auth/signup"
                className="w-full flex justify-center py-4 px-4 border border-maroon rounded-xl shadow-lg text-sm font-medium text-maroon bg-white hover:bg-maroon hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <Link
              href="/contact"
              className="font-medium text-maroon hover:text-gold transition-colors duration-300 hover:underline"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-gold/10 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon"></div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthErrorContent />
    </Suspense>
  );
}
