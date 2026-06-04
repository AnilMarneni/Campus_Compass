'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useCompare } from '@/features/compare/CompareContext';
import { Compass, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { compareColleges } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <Compass className="h-6 w-6 text-indigo-600 transition-transform group-hover:rotate-45" />
              <span className="font-bold text-xl tracking-tight text-gray-900">
                Campus<span className="text-indigo-600">Compass</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              href="/colleges"
              className={`text-sm font-medium transition-colors ${
                isActive('/colleges') ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Explore Colleges
            </Link>
            
            <Link
              href="/predictor"
              className={`text-sm font-medium transition-colors ${
                isActive('/predictor') ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              College Predictor
            </Link>

            <Link
              href="/compare"
              className={`flex items-center text-sm font-medium transition-colors relative ${
                isActive('/compare') ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Compare
              {compareColleges.length > 0 && (
                <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
                  {compareColleges.length}
                </span>
              )}
            </Link>

            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Saved List
                </Link>
                <div className="h-4 w-px bg-gray-200" />
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="h-8 w-8 rounded-full border border-indigo-100 object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600 font-semibold text-sm">
                        {session.user?.name ? session.user.name[0]?.toUpperCase() : 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {session.user?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-50 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="h-4 w-px bg-gray-200" />
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-lg shadow-sm transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link
              href="/colleges"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                isActive('/colleges') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Explore Colleges
            </Link>
            <Link
              href="/predictor"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                isActive('/predictor') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              College Predictor
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium ${
                isActive('/compare') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Compare ({compareColleges.length})
            </Link>

            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                    isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Saved List
                </Link>
                <div className="border-t border-gray-100 my-2 pt-2" />
                <div className="flex items-center px-3 py-3">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-10 w-10 rounded-full object-cover mr-3 border border-indigo-100"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center mr-3 border border-indigo-100 text-indigo-600 font-semibold text-lg">
                      {session.user?.name ? session.user.name[0]?.toUpperCase() : 'U'}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{session.user?.name}</p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center px-3 py-2.5 text-left text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-100 my-2 pt-2" />
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block mx-3 my-2 text-center px-4 py-2.5 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
