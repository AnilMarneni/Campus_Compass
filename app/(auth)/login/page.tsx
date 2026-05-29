'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Compass, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error || 'Invalid credentials');
        toast.error('Login failed', { description: res.error });
      } else {
        toast.success('Successfully logged in!');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-150 rounded-2xl shadow-sm p-8 space-y-6">
      {/* Brand Logo & Title */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2">
          <Compass className="h-8 w-8 text-indigo-650" />
          <span className="font-bold text-2xl tracking-tight text-gray-900">
            Campus<span className="text-indigo-600">Compass</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Log in to your account</h2>
        <p className="text-xs text-gray-400">
          Welcome back! Save and review colleges.
        </p>
      </div>

      {/* Errors display */}
      {error && (
        <div className="bg-red-50 border border-red-150 p-3 rounded-lg text-xs text-red-650 flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-655 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-indigo-500 rounded-lg text-sm bg-gray-50/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-655 uppercase tracking-wider">Password</label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-indigo-500 rounded-lg text-sm bg-gray-50/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 mt-2"
        >
          Log In
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-indigo-650 hover:text-indigo-850 transition-colors">
          Sign up here
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white border border-gray-150 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="h-6 w-32 bg-gray-200 animate-pulse mx-auto rounded" />
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
