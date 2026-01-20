import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const [mood, setMood] = useState("");
  const [tip, setTip] = useState("");
  const navigate = useNavigate();

  /* 🔐 Track auth state */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  /* 💡 Daily Smart Tip */
  useEffect(() => {
    const tips = [
      "💧 Drink water every hour",
      "🛌 Avoid screens 30 minutes before sleep",
      "📚 Study in 45-minute focus blocks",
      "🚶 Take a 5-minute walk",
      "😌 Deep breathing helps reduce stress",
    ];
    const today = new Date().getDate();
    setTip(tips[today % tips.length]);
  }, []);

  /* 🙂 Save Mood */
  const saveMood = async (selectedMood) => {
    if (!user) {
      alert("Login required to save mood");
      return;
    }

    setMood(selectedMood);

    await addDoc(collection(db, "dailyMood"), {
      uid: user.uid,
      mood: selectedMood,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date(),
    });
  };

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
            Track your mood, productivity & balance your day intelligently.
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
              Pomodoro-based focus & break reminders
            </small>
          </div>

          <div
            className="feature-card"
            onClick={() => handleFeatureClick("/streak")}
          >
            <span className="feature-icon">🔥</span>
            <p className="feature-title">Consistency Streak</p>
            <small className="feature-desc">
              Maintain daily streaks & stay motivated
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
