
import React, { useState, useRef } from "react";
import "../style/dashboard.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { generateReport, reports = [] } = useInterview();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [loading, setLoading] = useState(false);

  const resumeInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") return alert("Only PDF allowed.");
    if (file.size > 5 * 1024 * 1024) return alert("Max 5MB allowed.");

    setResumeName(file.name);
  };

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0];

    if (!resumeFile) return alert("Upload resume first.");
    if (!jobDescription.trim() || !selfDescription.trim())
      return alert("Fill all fields.");

    try {
      setLoading(true);

      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      const report = data.interviewReport;

      if (!report?._id) throw new Error("Invalid response");

      navigate(`/interview/${report._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      <div className="glow g1"></div>
      <div className="glow g2"></div>

      <div className="layout">

        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">
          <h3>Recent Reports</h3>

          {reports.length > 0 ? (
            reports.map((r) => (
              <div
                key={r._id}
                className="report-item"
                onClick={() => navigate(`/interview/${r._id}`)}
              >
                <p>{r.title || "Untitled Report"}</p>
                <span>
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
            ))
          ) : (
            <p className="empty">No reports yet</p>
          )}
        </aside>

        {/* CENTER */}
        <main className="dashboard-main">

          <div className="hero-card">
            <h1>🚀 AI Interview Generator</h1>
            <p>Create high-quality interview reports instantly</p>

            <textarea
              placeholder="Paste Job Description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <textarea
              placeholder="Tell about yourself..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
            />

            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />

            {resumeName && <p className="file">{resumeName}</p>}

            <button onClick={handleGenerateReport}>
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>

        </main>

        {/* RIGHT PANEL */}
        <aside className="dashboard-right">

          <div className="info-card">
            <h4>💡 Tips</h4>
            <p>Use detailed job description for better results.</p>
          </div>

          <div className="info-card">
            <h4>⚡ Pro Tip</h4>
            <p>Add projects in self description to boost match score.</p>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default Dashboard;

