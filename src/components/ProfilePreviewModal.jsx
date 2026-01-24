import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const ProfilePreviewModal = ({ userId, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "users", userId));
        if (snap.exists()) {
          setProfile(snap.data());
        }
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!userId) return null;

  return (
    <>
      <div className="ppm-overlay" onClick={onClose}>
        <div className="ppm-modal" onClick={(e) => e.stopPropagation()}>
          {loading ? (
            <p className="ppm-loading">Loading...</p>
          ) : profile ? (
            <>
              <img
                src={profile.photoURL}
                alt={profile.name}
                className="ppm-avatar"
              />

              <h3 className="ppm-name">{profile.name}</h3>

              <p className="ppm-profession">{profile.profession}</p>

              <span className="ppm-gender">{profile.gender}</span>

              <button className="ppm-close" onClick={onClose}>
                Close
              </button>
            </>
          ) : (
            <p className="ppm-loading">Profile not found</p>
          )}
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .ppm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2,6,23,0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease;
        }

        .ppm-modal {
          background: #020617;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          padding: 26px 22px;
          width: 280px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          animation: scaleIn 0.25s ease;
        }

        .ppm-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 14px;
          border: 2px solid rgba(255,255,255,0.15);
        }

        .ppm-name {
          margin: 6px 0 4px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #e5e7eb;
        }

        .ppm-profession {
          font-size: 0.9rem;
          color: #94a3b8;
        }

        .ppm-gender {
          display: inline-block;
          margin-top: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #38bdf8;
        }

        .ppm-close {
          margin-top: 18px;
          padding: 8px 18px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg,#38bdf8,#818cf8);
          font-weight: 700;
          cursor: pointer;
          color: #020617;
        }

        .ppm-loading {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }

        @keyframes scaleIn {
          from { transform: scale(0.95) }
          to { transform: scale(1) }
        }

        @media (max-width: 640px) {
          .ppm-modal {
            width: 90%;
          }
        }
      `}</style>
    </>
  );
};

export default ProfilePreviewModal;
