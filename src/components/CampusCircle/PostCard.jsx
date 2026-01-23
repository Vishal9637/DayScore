import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <>
      <Link to={`/campus-circle/post/${post.id}`} className="cc-post-link">
        <div className="cc-post-card">
          <div className="cc-post-header">
            <span className="cc-user">{post.userName}</span>
          </div>

          <p className="cc-post-content">{post.content}</p>

          <div className="cc-post-footer">
            <span>💬 {post.repliesCount}</span>
            <span>❤️ {post.likes}</span>
          </div>
        </div>
      </Link>

      {/* CSS IN SAME FILE */}
      <style>{`
        .cc-post-link {
          text-decoration: none;
          color: inherit;
        }

        .cc-post-card {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        }

        .cc-post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.35);
        }

        .cc-post-header {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
        }

        .cc-user {
          font-size: 0.9rem;
          font-weight: 600;
          color: #38bdf8;
        }

        .cc-post-content {
          font-size: 0.95rem;
          line-height: 1.45;
          color: #e5e7eb;
          margin: 6px 0 12px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cc-post-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #cbd5f5;
        }

        /* 📱 Mobile Friendly */
        @media (max-width: 640px) {
          .cc-post-card {
            padding: 14px;
          }

          .cc-post-content {
            font-size: 0.9rem;
          }

          .cc-post-footer {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default PostCard;
