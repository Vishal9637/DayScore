import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Streak = () => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "streaks", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setStreak(snap.data().currentStreak);
      }
    };

    fetchStreak();
  }, []);

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
          Keep going! Small daily actions build strong discipline 💪
        </p>

      </div>
    </div>
  );
};

export default Streak;
