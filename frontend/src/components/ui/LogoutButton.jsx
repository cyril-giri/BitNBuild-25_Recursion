import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";


export default function LogoutButton() {
  const navigate = useNavigate();
  const { setUser, setRole, setProfile } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error.message);
      return;
    }

    // Clear context
    setUser(null);
    setRole(null);
    setProfile(null);

    // Redirect to login or landing page
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
      Logout
    </button>
  );
}
