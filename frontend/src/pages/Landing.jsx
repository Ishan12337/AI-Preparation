

import Navbar from "../components/Navbar";
import "../styles/landing.scss";

const Landing = () => {
  return (
    <div className="landing">

      <Navbar />

      {/* GLOW */}
      <div className="bg-glow glow1"></div>
      <div className="bg-glow glow2"></div>

      <div className="landing-container">

        {/* HERO */}
        <section id="hero" className="hero">
          <h1>Crack Interviews with AI 🚀</h1>
          <p>
            Smart resume analysis, ATS scoring, and AI-powered interview prep — all in one place.
          </p>

          <div className="hero-buttons">
            <button className="btn primary">Get Started</button>
            <button className="btn outline">Explore</button>
          </div>

          <div className="hero-stats">
            <div><strong>1200+</strong><span>Students</span></div>
            <div><strong>85%</strong><span>Success</span></div>
            <div><strong>300+</strong><span>Companies</span></div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="features">
          <h2>Features</h2>

          <div className="features-grid">
            <div className="feature-card">
              <h3>📄 Resume Analysis</h3>
              <p>Improve your resume with AI suggestions</p>
            </div>

            <div className="feature-card">
              <h3>🤖 AI Questions</h3>
              <p>Get real interview questions instantly</p>
            </div>

            <div className="feature-card">
              <h3>📊 ATS Score</h3>
              <p>Optimize for top company systems</p>
            </div>

            <div className="feature-card">
              <h3>🎯 Match Score</h3>
              <p>Know your job fit instantly</p>
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <section id="results" className="results">
          <h2>Results</h2>

          <div className="results-box">
            <div className="result">
              <h3>1200+</h3>
              <p>Students Placed</p>
            </div>

            <div className="result">
              <h3>85%</h3>
              <p>Success Rate</p>
            </div>

            <div className="result">
              <h3>300+</h3>
              <p>Companies</p>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact">
          <h2>Contact</h2>
          <p>support@aiprep.com</p>
          <p>+91 98765 43210</p>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <p>© 2026 AI Prep</p>
        </footer>

      </div>
    </div>
  );
};

export default Landing;




