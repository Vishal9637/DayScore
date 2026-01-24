import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

/* =========================
   HELPERS
========================= */
const getToday = () => new Date().toISOString().split("T")[0];

const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

const Streak = () => {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const today = getToday();
        const yesterday = getYesterday();

        /* =========================
           CHECK TODAY SCORE
        ========================= */
        const todaySnap = await getDoc(
          doc(db, "dailyData", `${user.uid}_${today}`)
        );

        const streakRef = doc(db, "streaks", user.uid);
        const streakSnap = await getDoc(streakRef);

        // ❌ Not checked today → do not increment
        if (!todaySnap.exists()) {
          if (streakSnap.exists()) {
            setStreak(streakSnap.data().currentStreak || 0);
          }
          setLoading(false);
          return;
        }

        let newStreak = 1;

        if (streakSnap.exists()) {
          const { currentStreak, lastActiveDate } = streakSnap.data();

          if (lastActiveDate === today) {
            setStreak(currentStreak);
            setLoading(false);
            return;
          }

          if (lastActiveDate === yesterday) {
            newStreak = currentStreak + 1;
          }
        }

        await setDoc(
          streakRef,
          {
            currentStreak: newStreak,
            lastActiveDate: today,
            updatedAt: new Date(),
          },
          { merge: true }
        );

        setStreak(newStreak);
      } catch (err) {
        console.error("Streak error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  /* =========================
     UI
  ========================= */
  if (loading) {
    return (
      <div className="streak-page">
        <div className="streak-card">
          <p>Calculating your streak... 🔄</p>
        </div>
      </div>
    );
  }

  return (
    <div className="streak-page fade-in">
      <div className="streak-card slide-up">
        <div className="streak-fire">🔥</div>

        <h2 className="streak-title">Consistency Streak</h2>

        <div className="streak-count">
          <span>{streak}</span>
          <small>Days</small>
        </div>

        <p className="streak-message">
          {streak === 0
            ? "Check your DayScore today to start your streak 🚀"
            : streak === 1
            ? "Great start! Come back tomorrow 🔁"
            : "Amazing! Keep your momentum going 💪"}
        </p>

        {/* 🏆 LEADERBOARD BUTTON */}
        <Link to="/leaderboard" className="leaderboard-btn">
          🏆 View Leaderboard
        </Link>
      </div>

      {/* 🎨 CSS */}
      <style>{`
        .streak-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, #020617, #020617);
          padding: 20px;
        }

        .streak-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 32px 28px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 30px 80px rgba(0,0,0,0.6);
          max-width: 360px;
          width: 100%;
        }

        .streak-fire {
          font-size: 3rem;
          margin-bottom: 10px;
        }

        .streak-title {
          color: #e5e7eb;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .streak-count {
          font-size: 3rem;
          font-weight: 800;
          color: #38bdf8;
        }

        .streak-count small {
          display: block;
          font-size: 0.9rem;
          color: #94a3b8;
        }

        .streak-message {
          margin-top: 14px;
          color: #cbd5f5;
          font-size: 0.95rem;
        }

        /* 🏆 BUTTON */
        .leaderboard-btn {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          border-radius: 999px;
          background: linear-gradient(135deg, #38bdf8, #818cf8);
          color: #020617;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .leaderboard-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(56,189,248,0.4);
        }
      `}</style>
    </div>
  );
};

export default Streak;
