import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // default role
  const [isSignUp, setIsSignUp] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (isSignUp) {
      // Freelancers must use edu email
      if (role === "freelancer" && !email.endsWith(".edu")) {
        return alert("Freelancers must sign up with a valid edu email!");
      }

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);

      // Insert into profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ user_id: data.user.id, role, full_name: name, email }]);
      if (profileError) return alert(profileError.message);

      alert("Check your email for confirmation link!");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return alert(error.message);
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-3xl font-bold mb-4">GigCampus</h1>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="mb-2 border p-2 w-64"
      >
        <option value="client">Client</option>
        <option value="freelancer">Freelancer</option>
      </select>

      <input
        type="text"
        placeholder="John Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 w-64"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-64"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-64"
      />
      <button onClick={handleAuth} className="bg-blue-500 text-white p-2 w-64">
        {isSignUp ? "Sign Up" : "Login"}
      </button>

      <p className="mt-2">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
        <span
          className="text-blue-700 cursor-pointer ml-1"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Login" : "Sign Up"}
        </span>
      </p>
    </div>
  );
}
