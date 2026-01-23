import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  listenToReplies,
  addReply,
} from "../../services/campusCircleService";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const snap = await getDoc(doc(db, "posts", id));
      if (snap.exists()) setPost(snap.data());
    };

    fetchPost();
    const unsub = listenToReplies(id, setReplies);
    return () => unsub();
  }, [id]);

  const handleReply = async () => {
    const user = auth.currentUser;
    if (!user || !message.trim()) return;

    setLoading(true);
    await addReply(id, user, message);
    setMessage("");
    setLoading(false);
  };

  if (!post) return <p className="cc-loading">Loading...</p>;

  return (
    <>
      <div className="cc-page">

        {/* POST */}
        <div className="cc-post-card">
          <span className="cc-user">{post.userName}</span>
          <p className="cc-post-content">{post.content}</p>
        </div>

        {/* REPLY BOX */}
        <div className="cc-reply-box">
          <textarea
            placeholder="Share your experience or advice..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleReply} disabled={loading}>
            {loading ? "Posting..." : "Reply"}
          </button>
        </div>

        {/* REPLIES */}
        <div className="cc-replies">
          <h4>Replies</h4>

          {replies.length === 0 && (
            <p className="cc-empty">No replies yet. Be the first 🤍</p>
          )}

          {replies.map((r) => (
            <div key={r.id} className="cc-reply-card">
              <span className="cc-reply-user">{r.userName}</span>
              <p>{r.message}</p>
            </div>
          ))}
        </div>

      </div>

      {/* CSS INSIDE SAME FILE */}
      <style>{`
        .cc-page {
          max-width: 720px;
          margin: auto;
          padding: 16px;
        }

        .cc-post-card {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 18px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        }

        .cc-user {
          font-size: 0.85rem;
          font-weight: 600;
          color: #38bdf8;
        }

        .cc-post-content {
          margin-top: 8px;
          color: #e5e7eb;
          font-size: 1rem;
          line-height: 1.55;
        }

        .cc-reply-box {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .cc-reply-box textarea {
          width: 100%;
          min-height: 90px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(255,255,255,0.1);
          color: #f8fafc;
          font-size: 0.95rem;
          outline: none;
        }

        .cc-reply-box textarea:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 2px rgba(56,189,248,0.25);
        }

        .cc-reply-box button {
          margin-top: 12px;
          padding: 8px 18px;
          border-radius: 10px;
          background: linear-gradient(135deg, #38bdf8, #818cf8);
          border: none;
          font-weight: 600;
          color: #020617;
          cursor: pointer;
        }

        .cc-reply-box button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cc-replies h4 {
          margin-bottom: 10px;
          color: #e5e7eb;
          font-size: 1rem;
        }

        .cc-reply-card {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 12px;
        }

        .cc-reply-user {
          font-size: 0.8rem;
          font-weight: 600;
          color: #a5b4fc;
        }

        .cc-reply-card p {
          margin-top: 6px;
          font-size: 0.95rem;
          line-height: 1.45;
          color: #e5e7eb;
        }

        .cc-empty {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .cc-loading {
          text-align: center;
          padding: 30px;
          color: #94a3b8;
        }

        /* 📱 Mobile */
        @media (max-width: 640px) {
          .cc-page {
            padding: 12px;
          }

          .cc-post-content {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </>
  );
};

export default PostDetails;
