import { useState } from "react";
import { auth } from "../../firebase";
import { createPost } from "../../services/campusCircleService";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

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
        <h3 className="cc-title">🌍 Share with Campus Circle</h3>

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

        .cc-title {
          margin-bottom: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #e5e7eb;
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
          transition: border 0.2s, box-shadow 0.2s;
        }

        .cc-textarea::placeholder {
          color: #94a3b8;
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
          cursor: pointer;
        }

        .cc-checkbox input {
          accent-color: #38bdf8;
          cursor: pointer;
        }

        .cc-btn {
          padding: 8px 18px;
          border-radius: 10px;
          background: linear-gradient(135deg, #38bdf8, #818cf8);
          border: none;
          font-weight: 600;
          color: #020617;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .cc-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(56, 189, 248, 0.4);
        }

        .cc-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* 📱 Mobile Responsive */
        @media (max-width: 640px) {
          .cc-card {
            padding: 14px;
          }

          .cc-title {
            font-size: 1rem;
          }

          .cc-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .cc-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};

export default CreatePost;
