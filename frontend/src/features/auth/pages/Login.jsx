
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.scss";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await handleLogin(form);

    if (success) {
      navigate("/");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="auth-page">

      {/* glow same as landing */}
      <div className="bg-glow glow1"></div>
      <div className="bg-glow glow2"></div>

      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p className="sub-text">Login to continue your journey</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Enter Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit">Login</button>
        </form>

        <p className="switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>

    </div>
  );
};

export default Login;





