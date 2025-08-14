// src/components/react/Profile.tsx
import { useEffect } from 'react';
import { useAuth } from '../../context/Auth';

export default function Profile() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!loading && !user) {
      window.location.href = '/login';
    }
  }, [user, loading]);

  // Show a loading message or nothing while checking auth state
  if (loading) {
    return <p>Loading profile...</p>;
  }

  // If there is a user, display their info
  if (user) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
        <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
            <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.full_name}
                className="w-20 h-20 rounded-full"
            />
            <div>
                <h2 className="text-xl font-semibold">{user.user_metadata.full_name}</h2>
                <p className="text-gray-400">{user.email}</p>
            </div>
        </div>
      </div>
    );
  }

  // This will be shown briefly before the redirect happens
  return <p>Redirecting to login...</p>;
}