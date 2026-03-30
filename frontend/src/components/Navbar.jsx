
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import "../styles/navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout } = useAuth();

  const isHome = location.pathname === "/";

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LEFT */}
        <div className="navbar-left" onClick={() => navigate("/")}>
          <h2 className="logo">AI Prep</h2>
          <div className="logo-glow"></div>
          {user && <span className="username">Hi, {user.username}</span>}
        </div>

        {/* CENTER */}
        {isHome && (
          <div className="navbar-center">
            <a href="#features">Features</a>
            <a href="#results">Results</a>
            <a href="#contact">Contact</a>
          </div>
        )}

        {/* RIGHT */}
        <div className="navbar-right">
          {!user ? (
            <>
              <button className="btn outline" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="btn primary" onClick={() => navigate("/register")}>
                Get Started
              </button>
            </>
          ) : (
            <>
              <button className="btn glass" onClick={() => navigate("/dashboard")}>
                Dashboard
              </button>
              <button className="btn danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;





