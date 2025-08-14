// src/components/react/HeaderButtons.tsx
import { useAuth } from '../../context/Auth';
import { supabase } from '../../supabase/client';

export default function HeaderButtons() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Don't render anything until we know the auth status
  if (loading) return null;

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <a href="/profile" className="hover:text-yellow-400">Profile</a>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <a href="/login" className="hover:text-yellow-400">Login</a>
      )}
    </div>
  );
}