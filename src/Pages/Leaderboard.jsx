import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 Listen to USERS in real-time
    const unsubUsers = onSnapshot(collection(db, "users"), (userSnap) => {
      const usersMap = {};
      userSnap.forEach((u) => {
        usersMap[u.id] = u.data();
      });

      // 🔥 Listen to STREAKS in real-time
      const unsubStreaks = onSnapshot(
        collection(db, "streaks"),
        (streakSnap) => {
          const combined = streakSnap.docs.map((doc) => {
            const user = usersMap[doc.id] || {};

            return {
              uid: doc.id,
              streak: doc.data().currentStreak || 0,
              name: user.name || "Student",
              photoURL: user.photoURL || null,
            };
          });

          // Sort by streak DESC
          combined.sort((a, b) => b.streak - a.streak);

          setLeaders(combined);
          setLoading(false);
        }
      );

      // Cleanup streak listener
      return () => unsubStreaks();
    });

    // Cleanup user listener
    return () => unsubUsers();
  }, []);

  if (loading) {
    return (
      <div className="lb-loading">
        <p>Loading leaderboard... 🔄</p>
      </div>
    );
  }

  return (
    <div className="lb-page fade-in">
      <h2 className="lb-title">🏆 Streak Leaderboard</h2>

      <div className="lb-list">
        {leaders.map((u, index) => (
          <div
            key={u.uid}
            className={`lb-card ${index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : ""}`}
          >
            <span className="lb-rank">#{index + 1}</span>

            {u.photoURL ? (
              <img src={u.photoURL} alt={u.name} className="lb-avatar" />
            ) : (
              <div className="lb-avatar-fallback">
                {u.name[0]?.toUpperCase()}
              </div>
            )}

            <span className="lb-name">{u.name}</span>

            <span className="lb-streak">🔥 {u.streak}</span>
          </div>
        ))}
      </div>

      {/* 🎨 CSS */}
      <style>{`
        .lb-page {
          max-width: 560px;
          margin: auto;
          padding: 24px 16px;
        }

        .lb-title {
          text-align: center;
          color: #e5e7eb;
          margin-bottom: 22px;
          font-weight: 800;
        }

        .lb-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .lb-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #020617;
          border-radius: 16px;
          padding: 12px 16px;
          border: 1px solid rgba(255,255,255,0.08);
          transition: transform 0.15s ease;
        }

        .lb-card:hover {
          transform: translateY(-2px);
        }

        .lb-card.gold {
          border-color: #facc15;
          background: linear-gradient(135deg,#1e293b,#020617);
        }

        .lb-card.silver {
          border-color: #94a3b8;
        }

        .lb-card.bronze {
          border-color: #f97316;
        }

        .lb-rank {
          font-weight: 800;
          color: #94a3b8;
          width: 32px;
        }

        .lb-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .lb-avatar-fallback {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg,#38bdf8,#818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #020617;
        }

        .lb-name {
          flex: 1;
          color: #e5e7eb;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lb-streak {
          color: #38bdf8;
          font-weight: 800;
        }

        .lb-loading {
          text-align: center;
          padding: 40px;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;
