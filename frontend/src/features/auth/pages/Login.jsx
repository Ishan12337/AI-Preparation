
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.scss";
import Loading from "../../../components/Loading"

const Login = () => {
  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await handleLogin(form);

    if (success) {
      navigate("/"); // ✅ redirect to home
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="auth-page">

      {/* 🔥 Loader */}
      {loading && <Loading />}

      {/* glow background */}
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
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Enter Password"
            required
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;





