import { useState } from "react";
import { request } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const data = await request("/auth/login", "POST", form);
      localStorage.setItem("token", data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(typeof err === "string" ? err : err.message || "Unable to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-96 shadow-lg border border-white/10"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back 👋</h2>

        {location.state?.signupSuccess && (
          <div role="status" className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4 text-sm">
            {location.state.signupSuccess}
          </div>
        )}

        {error && (
          <div role="alert" className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <label className="block text-sm mb-2" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          placeholder="Enter your email"
          className="w-full p-3 mb-4 bg-gray-800/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="block text-sm mb-2" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          placeholder="Enter your password"
          className="w-full p-3 mb-5 bg-gray-800/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm mt-4 text-center text-gray-400">
          Don’t have an account?{" "}
          <button type="button" onClick={() => navigate("/signup")} className="text-blue-400 hover:underline">
            Signup
          </button>
        </p>
      </form>
    </div>
  );
}
