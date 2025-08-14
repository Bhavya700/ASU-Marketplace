// src/components/react/ProfileCheck.tsx
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '../../context/Auth';

// This component simply protects its children from being rendered by non-logged-in users.
export default function ProfileCheck({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
  }, [user, loading]);

  if (loading || !user) {
    return <div className="text-center p-12">Loading...</div>; // Or a spinner component
  }

  return <>{children}</>;
}