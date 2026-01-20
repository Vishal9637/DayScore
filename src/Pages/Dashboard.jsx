import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import DayScoreCard from "../components/DayScoreCard";
import DailyForm from "../components/DailyForm";
import WeeklyChart from "../components/WeeklyChart";
import DailyFeedback from "../components/DailyFeedback";
import { analyzeDay } from "../utils/dayScoreAI";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [dayScore, setDayScore] = useState(0);
  const [feedback, setFeedback] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        return;
      }

      setUser(u);

      try {
        const snap = await getDoc(
          doc(db, "dailyData", `${u.uid}_${today}`)
        );

        if (snap.exists()) {
          setDayScore(snap.data().dayScore);
          setFeedback(snap.data().feedback || []);
        }
      } catch (err) {
        console.error("Firestore error:", err.message);
      }
    });

    return () => unsub();
  }, [today]);

  const saveDailyData = async (data) => {
    if (!user) return;

    const { score, feedback } = analyzeDay(data);

    setDayScore(score);
    setFeedback(feedback);

    await setDoc(
      doc(db, "dailyData", `${user.uid}_${today}`),
      {
        uid: user.uid,
        date: today,
        ...data,
        dayScore: score,
        feedback,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  };

  return (
    <>
      <div className="page space-y-6 mt-8 lg:mt-12 dashboard-mobile">

        {/* TOP SECTION */}
        <div className="grid lg:grid-cols-3 gap-6 dashboard-top">
          <DayScoreCard score={dayScore} />

          <div className="lg:col-span-2">
            <DailyFeedback feedback={feedback} />
          </div>
        </div>

        {/* MAIN SECTION */}
        <div className="grid lg:grid-cols-2 gap-6 dashboard-main">
          <div className="glass-card">
            <h3 className="section-title mb-4">Daily Check-in</h3>
            <DailyForm onSave={saveDailyData} />
          </div>

          {user && (
            <div className="glass-card">
              <h3 className="section-title mb-4">Weekly Trends</h3>
              <WeeklyChart uid={user.uid} />
            </div>
          )}
        </div>
      </div>

      {/* 📱 MOBILE-ONLY CSS */}
      <style>{`
        @media (max-width: 768px) {

          .dashboard-mobile {
            padding: 0 0.75rem;
            margin-top: 1.5rem;
          }

          /* Stack everything cleanly */
          .dashboard-top,
          .dashboard-main {
            grid-template-columns: 1fr !important;
          }

          /* Reduce card padding slightly */
          .glass-card {
            padding: 1.2rem !important;
            border-radius: 18px;
          }

          /* Section titles */
          .section-title {
            font-size: 1rem;
          }

          /* DayScore card spacing */
          .dashboard-top > * {
            margin-bottom: 0.5rem;
          }

          /* Weekly chart better fit */
          canvas {
            max-height: 240px !important;
          }
        }

        @media (max-width: 480px) {

          .dashboard-mobile {
            padding: 0 0.5rem;
          }

          .glass-card {
            padding: 1rem !important;
          }

          .section-title {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </>
  );
};

export default Dashboard;
