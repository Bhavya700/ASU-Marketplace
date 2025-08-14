// src/components/react/Login.tsx
import { supabase } from '../../supabase/client';

export default function Login() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign In with Google
    </button>
  );
}