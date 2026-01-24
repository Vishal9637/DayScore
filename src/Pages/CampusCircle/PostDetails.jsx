import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { listenToReplies, addReply } from "../../services/campusCircleService";

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

    try {
      setLoading(true);
      await addReply(id, user, message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  if (!post) return <p className="cc-loading">Loading...</p>;

  return (
    <>
      <div className="pd-wrapper">

        {/* POST */}
        <div className="pd-post">
          <div className="pd-user">
            {post.userAvatar ? (
              <img src={post.userAvatar} className="pd-avatar" alt="" />
            ) : (
              <div className="pd-avatar-fallback">
                {post.userName?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="pd-name">{post.userName}</span>
          </div>

          <p className="pd-content">{post.content}</p>
        </div>

        {/* REPLY BOX */}
        <div className="pd-reply-box">
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
        <div className="pd-replies">
          <h4>Replies</h4>

          {replies.length === 0 && (
            <p className="pd-empty">
              No replies yet. Be the first 🤍
            </p>
          )}

          {replies.map((r) => (
            <div key={r.id} className="pd-reply-card">
              <div className="pd-user">
                {r.userAvatar ? (
                  <img src={r.userAvatar} className="pd-avatar sm" alt="" />
                ) : (
                  <div className="pd-avatar-fallback sm">
                    {r.userName?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="pd-name">{r.userName}</span>
              </div>

              <p className="pd-reply-text">{r.message}</p>
            </div>
          ))}
        </div>

      </div>

      {/* CSS */}
      <style>{`
        .pd-wrapper {
          max-width: 720px;
          margin: auto;
          padding: 24px 16px;
        }

        /* POST CARD */
        .pd-post {
          background: #020617;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 14px 32px rgba(0,0,0,0.35);
        }

        .pd-user {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .pd-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
        }

        .pd-avatar.sm {
          width: 34px;
          height: 34px;
        }

        .pd-avatar-fallback {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg,#38bdf8,#818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #020617;
        }

        .pd-avatar-fallback.sm {
          width: 34px;
          height: 34px;
          font-size: 0.85rem;
        }

        .pd-name {
          font-weight: 600;
          color: #38bdf8;
        }

        .pd-content {
          font-size: 1.05rem;
          line-height: 1.6;
          color: #e5e7eb;
          margin-top: 6px;
        }

        /* REPLY BOX */
        .pd-reply-box {
          background: rgba(15,23,42,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 16px;
          margin-bottom: 28px;
        }

        .pd-reply-box textarea {
          width: 100%;
          min-height: 90px;
          background: rgba(30,41,59,0.95);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 12px;
          color: #f8fafc;
          font-size: 0.95rem;
          outline: none;
        }

        .pd-reply-box textarea::placeholder {
          color: #94a3b8;
        }

        .pd-reply-box textarea:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 2px rgba(56,189,248,0.25);
        }

        .pd-reply-box button {
          margin-top: 12px;
          width: 100%;
          padding: 10px;
          border-radius: 14px;
          background: linear-gradient(135deg,#38bdf8,#818cf8);
          border: none;
          font-weight: 700;
          cursor: pointer;
          color: #020617;
        }

        .pd-replies h4 {
          margin-bottom: 14px;
          color: #e5e7eb;
        }

        /* REPLY CARD */
        .pd-reply-card {
          background: rgba(15,23,42,0.75);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 14px;
          margin-bottom: 12px;
          margin-left: 28px; /* nesting */
        }

        .pd-reply-text {
          margin-top: 6px;
          color: #e5e7eb;
          line-height: 1.5;
        }

        .pd-empty {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .cc-loading {
          text-align: center;
          padding: 40px;
          color: #94a3b8;
        }

        @media (max-width: 640px) {
          .pd-wrapper {
            padding: 16px 12px;
          }

          .pd-reply-card {
            margin-left: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default PostDetails;
