
import React, { useState, useEffect } from "react";
import "../style/interview.scss";
import { useParams } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";
import Loading from "../../../components/Loading";

const Interview = () => {
  const { id } = useParams();
  const { report, loading, getReportById } = useInterview();

  const [activeTab, setActiveTab] = useState("technical");
  const [openIndex, setOpenIndex] = useState(null);
  const [activeSkill, setActiveSkill] = useState(null);

  useEffect(() => {
    if (id) getReportById(id);
  }, [id]);

  if (loading) return <Loading />;

  if (!report || Object.keys(report).length === 0) {
    return <h2 style={{ color: "white" }}>No data found</h2>;
  }

  const renderQuestions = (questions) =>
    questions?.map((q, i) => (
      <div
        key={i}
        className={`question-card ${openIndex === i ? "open" : ""}`}
        onClick={() => setOpenIndex(openIndex === i ? null : i)}
      >
        <div className="question-header">
          <span className="q-tag">Q{i + 1}</span>
          <p>{q.question}</p>
          <span className="toggle">{openIndex === i ? "−" : "+"}</span>
        </div>

        <div className="question-body">
          <p><strong>💡 Intention:</strong> {q.intention}</p>
          <p><strong>✅ Answer:</strong> {q.answer}</p>
        </div>
      </div>
    ));

  return (
    <div className="interview">

      <div className="bg-glow glow1"></div>
      <div className="bg-glow glow2"></div>

      {/* SIDEBAR */}
      <aside className="interview-sidebar">
        <h3>Sections</h3>

        <button
          className={activeTab === "technical" ? "active" : ""}
          onClick={() => setActiveTab("technical")}
        >
          Technical
        </button>

        <button
          className={activeTab === "behavioral" ? "active" : ""}
          onClick={() => setActiveTab("behavioral")}
        >
          Behavioral
        </button>

        <button
          className={activeTab === "roadmap" ? "active" : ""}
          onClick={() => setActiveTab("roadmap")}
        >
          Roadmap
        </button>
      </aside>

      {/* MAIN */}
      <main className="interview-content">

        <h2 className="heading">
          {activeTab === "technical" && "🚀 Technical Questions"}
          {activeTab === "behavioral" && "🧠 Behavioral Questions"}
          {activeTab === "roadmap" && "📅 Preparation Plan"}
        </h2>

        <div className="cards">
          {activeTab === "technical" && renderQuestions(report.technicalQuestions)}
          {activeTab === "behavioral" && renderQuestions(report.behavioralQuestions)}

          {activeTab === "roadmap" &&
            report.preparationPlan?.map((day, i) => (
              <div key={i} className="question-card open">
                <h4>Day {day.day}</h4>
                <p>{day.focus}</p>
                <ul>
                  {day.tasks.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="interview-right">

        <div className="card score-card">
          <h4>Match Score</h4>
          <div className="progress-ring" style={{ "--score": report.matchScore }}>
            <div className="inner">{report.matchScore}%</div>
          </div>
        </div>

        <div className="card">
          <h4>Skill Gaps</h4>
          {report.skillGaps?.map((s, i) => (
            <div
              key={i}
              className={`skill ${s.severity}`}
              onClick={() => setActiveSkill(s)}
            >
              {s.skill}
            </div>
          ))}
        </div>

        {activeSkill && (
          <div className="card">
            <h4>{activeSkill.skill}</h4>
            <p>Needs improvement — focus on practice.</p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default Interview;






