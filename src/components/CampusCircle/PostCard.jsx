import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <>
      <Link to={`/campus-circle/post/${post.id}`} className="cc-post-link">
        <div className="cc-post-card">

          <div className="cc-post-header">
            {post.userAvatar ? (
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

            <span className="cc-user">{post.userName}</span>
          </div>

          <p className="cc-post-content">{post.content}</p>

          <div className="cc-post-footer">
            <span>💬 {post.repliesCount}</span>
            <span>❤️ {post.likes}</span>
          </div>
        </div>
      </Link>

      <style>{`
        .cc-post-link { text-decoration: none; color: inherit; }

        .cc-post-card {
          background: rgba(15,23,42,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        }

        .cc-post-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
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

        .cc-user {
          font-weight: 600;
          color: #38bdf8;
        }
      `}</style>
    </>
  );
};

export default PostCard;
