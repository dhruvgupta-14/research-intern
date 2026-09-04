import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/client";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(username, password);
      login(res.data.token);
      navigate("/");
    } catch (err) {
      // Only a 401 means the credentials were wrong. Anything else - the API
      // being down, or a CORS block because the browser origin is not in the
      // server's allow-list - must not be reported as a bad password.
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else if (err.response) {
        setError(`Server error (${err.response.status}). Check the API logs.`);
      } else {
        setError(
          "Cannot reach the API. Check that the backend is running and that " +
          "this origin is allowed by FRONTEND_ORIGIN."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8"
      style={{ background: "#EBF2FB" }}>

      <div className="w-full max-w-md bg-white rounded-2xl p-10"
        style={{ border: "0.5px solid #B5D4F4" }}>

        {/* Logo */}
        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
          style={{ background: "#378ADD" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
            viewBox="0 0 24 24" fill="none" stroke="#ffffff"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 5h7"/>
            <path d="M9 3v2c0 4.418 -2.239 8 -5 8"/>
            <path d="M5 9c0 2.144 2.952 3.908 6.7 4"/>
            <path d="M12 20l4 -9l4 9"/>
            <path d="M19.1 18h-6.2"/>
          </svg>
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full mb-5"
          style={{ background: "#E6F1FB", color: "#185FA5" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2"/>
            <path d="M12 3a3 3 0 0 1 3 3v5h-6v-5a3 3 0 0 1 3 -3z"/>
          </svg>
          Internal access only
        </span>

        {/* Heading */}
        <h1 className="text-xl font-medium mb-1" style={{ color: "#042C53" }}>
          Benchmark Dataset Dashboard
        </h1>
        <p className="text-sm mb-6" style={{ color: "#185FA5" }}>
          Indian context AI Benchmark 
        </p>

        <hr style={{ borderColor: "#B5D4F4", marginBottom: "1.5rem" }} />

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg mb-5"
            style={{ background: "#FCEBEB", border: "0.5px solid #F7C1C1", color: "#A32D2D" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1.5"
              style={{ color: "#185FA5" }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              className="w-full h-10 px-3 rounded-lg text-sm outline-none"
              style={{
                border: "1px solid #B5D4F4",
                background: "#F4F9FF",
                color: "#042C53",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#378ADD";
                e.target.style.boxShadow = "0 0 0 3px #E6F1FB";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#B5D4F4";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1.5"
              style={{ color: "#185FA5" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full h-10 px-3 pr-10 rounded-lg text-sm outline-none"
                style={{
                  border: "1px solid #B5D4F4",
                  background: "#F4F9FF",
                  color: "#042C53",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#378ADD";
                  e.target.style.boxShadow = "0 0 0 3px #E6F1FB";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#B5D4F4";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#378ADD", background: "none", border: "none", cursor: "pointer" }}>
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"/>
                    <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"/>
                    <path d="M3 3l18 18"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/>
                    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg text-sm font-medium text-white"
            style={{ background: loading ? "#85B7EB" : "#378ADD", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
            onMouseEnter={(e) => { if (!loading) e.target.style.background = "#185FA5"; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.background = "#378ADD"; }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <hr style={{ borderColor: "#B5D4F4", margin: "1.5rem 0 1rem" }} />
        <p className="text-center text-xs" style={{ color: "#185FA5" }}>
          No access? Contact your project admin
        </p>
      </div>
    </div>
  );
}

export default Login;