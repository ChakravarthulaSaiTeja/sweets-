"use client";

import { Metadata } from 'next';
import AuthCard from '@/components/AuthCard';
import { signIn } from 'next-auth/react';

export default function AuthPage() {
  // Example integration with NextAuth
  const handleSignIn = async (credentials: { email: string; password: string; remember: boolean }) => {
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Invalid credentials');
      }

      // Redirect to account page or dashboard
      window.location.href = '/account';
    } catch (error) {
      throw error;
    }
  };

  const handleSignUp = async (payload: { name: string; email: string; mobile?: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Sign up failed');
      }

      // Optionally auto sign-in after successful registration
      await signIn('credentials', {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      // Redirect to account page
      window.location.href = '/account';
    } catch (error) {
      throw error;
    }
  };

  const handleSuccess = () => {
    // Additional success handling if needed
    console.log('Authentication successful');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-gold/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-maroon/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-saffron/5 rounded-full blur-3xl"></div>
        
        {/* Masala Theme Decorations */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-saffron/10 rounded-full blur-sm"></div>
        <div className="absolute top-40 right-32 w-12 h-12 bg-gold/15 rounded-full blur-sm"></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-maroon/8 rounded-full blur-sm"></div>
        <div className="absolute bottom-20 right-20 w-14 h-14 bg-saffron/12 rounded-full blur-sm"></div>
      </div>

      <div className="relative z-10 w-full">
        <AuthCard 
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
