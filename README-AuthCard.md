# AuthCard Component Integration Guide

## Quick Setup

### 1. Import and Use AuthCard

```tsx
// pages/auth.tsx or app/auth/page.tsx
import AuthCard from '@/components/AuthCard';
import { signIn } from 'next-auth/react';

export default function AuthPage() {
  const handleSignIn = async (credentials) => {
    await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });
  };

  const handleSignUp = async (payload) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-gold/10">
      <AuthCard 
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onSuccess={() => window.location.href = '/account'}
      />
    </div>
  );
}
```

### 2. NextAuth Configuration

```typescript
// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Your credential validation logic
        const user = await validateUser(credentials.email, credentials.password);
        return user ? { id: user.id, email: user.email, name: user.name } : null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth',
  },
};
```

### 3. Environment Variables

```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth (if implementing)
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret
```

### 4. API Route for Sign Up

```typescript
// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, mobile, password } = await request.json();
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
      },
    });
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { message: 'Sign up failed' },
      { status: 500 }
    );
  }
}
```

## Features

- ✅ **Sliding Animation**: Smooth left/right panel transitions
- ✅ **Form Persistence**: Input values preserved when switching panels
- ✅ **Accessibility**: Full keyboard navigation and screen reader support
- ✅ **Password Strength**: Visual indicator with color-coded strength levels
- ✅ **Social Login**: Google and Apple OAuth integration ready
- ✅ **Mobile Responsive**: Stacked layout on small screens
- ✅ **Reduced Motion**: Respects user's motion preferences
- ✅ **Form Validation**: Client-side validation with error messages
- ✅ **Loading States**: Spinner indicators during submission

## Customization

The component uses Tailwind CSS classes and can be customized by modifying the color tokens:

- `maroon` (#7B1E2D) - Primary brand color
- `gold` (#C79A2A) - Secondary accent color  
- `saffron` (#F39C12) - Call-to-action color
- `cream` (#FFF7EE) - Background color

## Testing

The component includes unit test suggestions in comments. Key areas to test:

1. Panel toggle functionality
2. Form validation behavior
3. Password strength calculation
4. Accessibility features
5. Social login integration
