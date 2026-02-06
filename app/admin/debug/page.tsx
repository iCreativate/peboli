'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth';

export default function AdminDebugPage() {
  const { user } = useAuthStore();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/debug/session')
      .then(res => res.json())
      .then(data => {
        setSessionData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching session:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Debug Page</h1>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">Client Store (Zustand)</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Server Session (NextAuth)</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(sessionData, null, 2)}
            </pre>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This page helps debug session issues. Check if the role is set correctly in both the client store and server session.
          </p>
        </div>
      </div>
    </div>
  );
}

