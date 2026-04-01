import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.scss";
import Loading from "../../../components/Loading";

const Register = () => {
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await handleRegister(form);

    if (result === true) {
      navigate("/");
    } else if (result === "exists") {
      setError("Email already exists ⚠️");
    } else {
      setError("Registration failed ❌");
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
        <h2>Create Account 🚀</h2>
        <p className="sub-text">Start your interview journey</p>

        {/* 🔥 ERROR UI */}
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Username"
            required
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;