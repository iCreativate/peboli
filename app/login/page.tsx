'use client';

import { Suspense } from 'react';
import { LoginForm } from './LoginForm';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1 relative overflow-hidden">
        <div className="relative container mx-auto px-4 lg:px-6 py-10 md:py-14">
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}

