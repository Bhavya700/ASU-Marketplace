// src/components/react/HeaderButtons.tsx
import { useAuth } from '../../context/Auth';
import { supabase } from '../../supabase/client';

export default function HeaderButtons() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect to home page after logout
    window.location.href = '/';
  };

  if (loading) return <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>;

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-3">
            <a href="/new-listing" className="bg-asu-maroon text-white font-bold py-2 px-4 rounded hover:bg-opacity-90">
                + New Listing
            </a>
            <div className="relative group">
                 <button className="flex items-center gap-2">
                    <span className="bg-asu-maroon text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">
                        {user.user_metadata.full_name.charAt(0)}
                    </span>
                    <span className="hidden md:block">{user.user_metadata.full_name}</span>
                 </button>
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10 hidden group-hover:block">
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-asu-light-grey">Profile</a>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-asu-light-grey">
                        Logout
                    </button>
                 </div>
            </div>
        </div>
      ) : (
        <a href="/login" className="font-bold text-asu-maroon hover:underline">
            Login / Sign Up
        </a>
      )}
    </div>
  );
}