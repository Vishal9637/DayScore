import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  /* 🔐 Track auth state */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  /* 🔗 Feature navigation */
  const handleFeatureClick = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="home-bg fade-in">
      <div className="container">

        {/* HERO */}
        <div className="hero-card slide-up">
          <h1 className="hero-title">
            Welcome to <span>DayScore</span> 🌙
          </h1>
          <p className="hero-subtitle">
            Track your productivity, focus & balance your day intelligently.
          </p>

          {user && (
            <button
              className="primary-btn"
              onClick={() => navigate("/dashboard")}
            >
              📊 Check Your DayScore
            </button>
          )}
        </div>

        {/* FEATURES */}
        <div className="feature-grid">

          <div
            className="feature-card"
            onClick={() => handleFeatureClick("/planner")}
          >
            <span className="feature-icon">🎯</span>
            <p className="feature-title">Daily Focus Planner</p>
            <small className="feature-desc">
              Set top 3 tasks and avoid distractions
            </small>
          </div>

          <div
            className="feature-card"
            onClick={() => handleFeatureClick("/timer")}
          >
            <span className="feature-icon">⏰</span>
            <p className="feature-title">Smart Study Timer</p>
            <small className="feature-desc">
              Focus & break sessions with streak tracking
            </small>
          </div>

          <div
            className="feature-card"
            onClick={() => handleFeatureClick("/streak")}
          >
            <span className="feature-icon">🔥</span>
            <p className="feature-title">Consistency Streak</p>
            <small className="feature-desc">
              Build daily discipline & habits
            </small>
          </div>

        </div>

        {/* CTA FOR GUESTS */}
        {!user && (
          <div className="glass-card center slide-up">
            <p className="text-muted">
              Login to unlock your personalized DayScore 🚀
            </p>
            <button
              className="primary-btn"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
