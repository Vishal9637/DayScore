import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Streak = () => {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, "streaks", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setStreak(snap.data().currentStreak || 0);
        } else {
          setStreak(0);
        }
      } catch (error) {
        console.error("Error fetching streak:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="streak-page fade-in">
        <div className="streak-card slide-up">
          <p>Loading your streak... 🔄</p>
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
            ? "Start today! Your streak begins now 🚀"
            : "Keep going! Small daily actions build strong discipline 💪"}
        </p>

      </div>
    </div>
  );
};

export default Streak;
