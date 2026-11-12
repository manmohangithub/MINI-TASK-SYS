import { useState } from "react";
import { request } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Email and password are required");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      await request("/auth/signup", "POST", form);
      navigate("/", { state: { signupSuccess: "Account created. Please log in." } });
    } catch (err) {
      setError(typeof err === "string" ? err : err.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-96 shadow-lg border border-white/10"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        {error && (
          <div role="alert" className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <label className="block text-sm mb-2" htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          placeholder="Enter your email"
          className="w-full p-3 mb-4 bg-gray-800/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="block text-sm mb-2" htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={form.password}
          placeholder="At least 8 characters"
          className="w-full p-3 mb-5 bg-gray-800/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 p-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Signup"}
        </button>

        <p className="text-sm mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/")} className="text-blue-400 hover:underline">
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
