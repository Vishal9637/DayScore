import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import {
  togglePostLike,
  listenToPostLikeState,
} from "../../services/campusCircleService";

const PostCard = ({ post }) => {
  const user = auth.currentUser;
  const [liked, setLiked] = useState(false);

  // 🔁 listen like state
  useEffect(() => {
    if (!user) return;
    return listenToPostLikeState(post.id, user.uid, setLiked);
  }, [post.id, user]);

  // ❤️ like handler
  const handleLike = async (e) => {
    e.preventDefault(); // stop Link navigation
    if (!user) return;
    await togglePostLike(post.id, user.uid);
  };

  return (
    <>
      <Link to={`/campus-circle/post/${post.id}`} className="cc-post-link">
        <div className="cc-post-card">

          {/* HEADER */}
          <div className="cc-post-header">

            {/* AVATAR */}
            {post.anonymous ? (
              <div className="cc-anon-avatar">?</div>
            ) : post.userAvatar ? (
              <img
                src={post.userAvatar}
                alt={post.userName}
                className="cc-avatar"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div className="cc-avatar-fallback">
                {post.userName?.[0]?.toUpperCase()}
              </div>
            )}

            {/* NAME */}
            <span className="cc-user">
              {post.anonymous ? "Anonymous" : post.userName}
            </span>
          </div>

          {/* CONTENT */}
          <p className="cc-post-content">{post.content}</p>

          {/* FOOTER */}
          <div className="cc-post-footer">
            <span>💬 {post.repliesCount}</span>

            <button
              className={`cc-like ${liked ? "liked" : ""}`}
              onClick={handleLike}
            >
              ❤️ {post.likes}
            </button>
          </div>

        </div>
      </Link>

      {/* CSS */}
      <style>{`
        .cc-post-link {
          text-decoration: none;
          color: inherit;
        }

        .cc-post-card {
          background: rgba(15,23,42,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.25);
          transition: transform 0.15s ease;
        }

        .cc-post-card:hover {
          transform: translateY(-2px);
        }

        .cc-post-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .cc-avatar,
        .cc-avatar-fallback,
        .cc-anon-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cc-avatar {
          object-fit: cover;
        }

        .cc-avatar-fallback {
          background: linear-gradient(135deg,#38bdf8,#818cf8);
          color: #020617;
          font-weight: 700;
        }

        .cc-anon-avatar {
          background: #1e293b;
          color: #94a3b8;
          font-weight: 700;
        }

        .cc-user {
          font-weight: 600;
          font-size: 0.9rem;
          color: #38bdf8;
        }

        .cc-post-content {
          font-size: 0.95rem;
          color: #e5e7eb;
          margin: 6px 0 12px;
          line-height: 1.5;
        }

        .cc-post-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #cbd5f5;
        }

        .cc-like {
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          font-weight: 600;
        }

        .cc-like.liked {
          color: #ef4444;
        }

        /* 📱 Mobile */
        @media (max-width: 640px) {
          .cc-post-card {
            padding: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default PostCard;
