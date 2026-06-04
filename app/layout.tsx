import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/layout/AuthProvider';
import { CompareProvider } from '@/features/compare/CompareContext';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import FloatingCompareBar from '@/components/compare/FloatingCompareBar';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CampusCompass — Discover & Compare Top Colleges in India',
  description:
    'Evaluate and compare engineering, management, science, and commerce colleges in India side-by-side. Make data-driven decisions for your academic future.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50/30 text-gray-900 h-full flex flex-col`}>
        <AuthProvider>
          <CompareProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
            <FloatingCompareBar />
            <Toaster position="top-right" richColors />
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
