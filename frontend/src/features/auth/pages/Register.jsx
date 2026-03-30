
import { useState } from "react";
import { useAuth } from "../hooks/useAuth"; 
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.scss";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await handleRegister(form);

    if (success) {
      navigate("/");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-page">

      {/* glow same as login */}
      <div className="bg-glow glow1"></div>
      <div className="bg-glow glow2"></div>

      <div className="auth-card">
        <h2>Create Account 🚀</h2>
        <p className="sub-text">Start your interview journey</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Username"
            required
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

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

          <button type="submit">Register</button>
        </form>

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

    </div>
  );
};

export default Register;






