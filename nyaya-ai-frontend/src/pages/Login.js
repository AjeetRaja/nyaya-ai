import React from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // TEMP login (backend next)
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Nyaya AI</h2>
        <p className="subtitle">Justice Through Intelligence</p>

        {/* ✅ Only ONE form */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            required
          />

          <input
            type="password"
            placeholder="Password"
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>
            Sign Up
            </span>
        </p>
      </div>
    </div>
  );
}

export default Login;