import { useEffect, useState } from "react";
import CreatePost from "../../components/CampusCircle/CreatePost";
import PostCard from "../../components/CampusCircle/PostCard";
import { listenToPosts } from "../../services/campusCircleService";

const CampusCirclePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsub = listenToPosts(setPosts);
    return () => unsub();
  }, []);

  return (
    <>
      <div className="cc-wrapper">
        <div className="cc-header">
          <h2>🌍 Campus Circle</h2>
          <p>A safe space for students to share and support each other</p>
        </div>

        <CreatePost />

        <div className="cc-posts">
          {posts.length === 0 ? (
            <p className="cc-empty">
              No posts yet. Be the first to start the conversation 🤍
            </p>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>

      {/* CSS INSIDE SAME FILE */}
      <style>{`
        .cc-wrapper {
          max-width: 820px;
          margin: auto;
          padding: 18px;
        }

        .cc-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .cc-header h2 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #e5e7eb;
        }

        .cc-header p {
          margin-top: 6px;
          font-size: 0.9rem;
          color: #94a3b8;
        }

        .cc-posts {
          margin-top: 10px;
        }

        .cc-empty {
          text-align: center;
          font-size: 0.9rem;
          color: #94a3b8;
          margin-top: 30px;
        }

        /* 📱 Mobile */
        @media (max-width: 640px) {
          .cc-wrapper {
            padding: 14px;
          }

          .cc-header h2 {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </>
  );
};

export default CampusCirclePage;
