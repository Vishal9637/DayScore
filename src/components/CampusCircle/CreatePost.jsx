import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { createPost } from "../../services/campusCircleService";
import { doc, getDoc } from "firebase/firestore";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "Student",
    photoURL: null,
  });

  // 🔥 Fetch current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setProfile({
          name: snap.data().name || "Student",
          photoURL: snap.data().photoURL || null,
        });
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    await createPost(user, content, anonymous);
    setContent("");
    setAnonymous(false);
    setLoading(false);
  };

  return (
    <>
      <div className="cc-card">

        {/* USER PREVIEW */}
        <div className="cc-user-preview">
          {anonymous ? (
            <div className="cc-avatar-fallback">A</div>
          ) : profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt={profile.name}
              className="cc-avatar"
            />
          ) : (
            <div className="cc-avatar-fallback">
              {profile.name[0]?.toUpperCase()}
            </div>
          )}

          <span className="cc-username">
            {anonymous ? "Anonymous" : profile.name}
          </span>
        </div>

        <textarea
          className="cc-textarea"
          placeholder="What’s on your mind? Share your problem or thoughts…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="cc-footer">
          <label className="cc-checkbox">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
            />
            <span>Post anonymously</span>
          </label>

          <button
            className="cc-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* CSS INSIDE SAME FILE */}
      <style>{`
        .cc-card {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 24px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        }

        .cc-user-preview {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .cc-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }

        .cc-avatar-fallback {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg,#38bdf8,#818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #020617;
        }

        .cc-username {
          font-weight: 600;
          font-size: 0.9rem;
          color: #38bdf8;
        }

        .cc-textarea {
          width: 100%;
          min-height: 110px;
          resize: vertical;
          padding: 14px;
          border-radius: 12px;
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          font-size: 0.95rem;
          outline: none;
        }

        .cc-textarea:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25);
        }

        .cc-footer {
          margin-top: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cc-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #cbd5f5;
        }

        .cc-btn {
          padding: 8px 18px;
          border-radius: 10px;
          background: linear-gradient(135deg,#38bdf8,#818cf8);
          border: none;
          font-weight: 600;
          color: #020617;
          cursor: pointer;
        }

        .cc-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* 📱 Mobile */
        @media (max-width: 640px) {
          .cc-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .cc-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default CreatePost;
