import React from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";


function Signup() {
    const navigate = useNavigate();
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join Nyaya AI Platform</p>

        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />

          <button type="submit">Sign Up</button>
        </form>

        <p className="switch-text">
  Already have an account?{" "}
  <span onClick={() => navigate("/")}>Login</span>
</p>
      </div>
    </div>
  );
}

export default Signup;