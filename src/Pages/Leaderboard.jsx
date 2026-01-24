import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let usersMap = {};

    // 🔥 USERS LISTENER
    const unsubUsers = onSnapshot(collection(db, "users"), (userSnap) => {
      usersMap = {};
      userSnap.forEach((u) => {
        usersMap[u.id] = u.data();
      });
    });

    // 🔥 STREAK LISTENER
    const unsubStreaks = onSnapshot(collection(db, "streaks"), (streakSnap) => {
      const raw = streakSnap.docs.map((doc) => {
        const user = usersMap[doc.id] || {};
        return {
          uid: doc.id,
          streak: doc.data().currentStreak || 0,
          name: user.name || "Student",
          photoURL: user.photoURL || null,
        };
      });

      // Sort by streak DESC
      raw.sort((a, b) => b.streak - a.streak);

      // 🏆 ASSIGN RANKS (same streak = same rank)
      let rank = 0;
      let lastStreak = null;

      const ranked = raw.map((u, index) => {
        if (u.streak !== lastStreak) {
          rank = index + 1;
          lastStreak = u.streak;
        }
        return { ...u, rank };
      });

      setLeaders(ranked);

      // 🔥 FIND CURRENT USER RANK
      const me = auth.currentUser;
      if (me) {
        const mine = ranked.find((u) => u.uid === me.uid);
        setMyRank(mine || null);
      }

      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubStreaks();
    };
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
            className={`lb-card ${
              u.rank === 1
                ? "gold"
                : u.rank === 2
                ? "silver"
                : u.rank === 3
                ? "bronze"
                : ""
            }`}
          >
            <span className="lb-rank">#{u.rank}</span>

            {u.photoURL ? (
              <img src={u.photoURL} className="lb-avatar" alt={u.name} />
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

      {/* 🔥 YOUR RANK FIXED AT BOTTOM */}
      {myRank && (
        <div className="lb-me">
          <span>🎯 Your Rank</span>
          <strong>#{myRank.rank}</strong>
          <span>🔥 {myRank.streak}</span>
        </div>
      )}

      {/* 🎨 CSS */}
      <style>{`
        .lb-page {
          max-width: 560px;
          margin: auto;
          padding: 24px 16px 90px;
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
          width: 36px;
          font-weight: 800;
          color: #94a3b8;
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
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .lb-streak {
          color: #38bdf8;
          font-weight: 800;
        }

        .lb-me {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #020617;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 14px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          color: #38bdf8;
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
