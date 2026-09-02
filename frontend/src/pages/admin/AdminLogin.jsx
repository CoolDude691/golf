import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Lock, User } from "lucide-react";
import { login, apiError } from "../../api";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem("admin_token", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ecfbf4] flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <MapPin className="w-7 h-7 text-emerald-500" />
          <span className="text-2xl font-extrabold tracking-tight text-gray-900">
            MiniGolf USA
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage the directory</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  data-testid="login-username-input"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  data-testid="login-password-input"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600" data-testid="login-error">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit-button"
              className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 active:scale-[0.99] disabled:opacity-60 transition-[background-color,transform]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Demo credentials: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
