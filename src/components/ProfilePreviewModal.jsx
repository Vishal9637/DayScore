import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const ProfilePreviewModal = ({ userId, onClose }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", userId));
      if (snap.exists()) setProfile(snap.data());
    };

    fetchProfile();
  }, [userId]);

  if (!userId || !profile) return null;

  return (
    <>
      <div className="ppm-overlay" onClick={onClose}>
        <div className="ppm-card" onClick={(e) => e.stopPropagation()}>

          {/* AVATAR */}
          <div className="ppm-avatar-wrap">
            {profile.photoURL ? (
              <img src={profile.photoURL} className="ppm-avatar" alt="" />
            ) : (
              <div className="ppm-avatar-fallback">
                {profile.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {/* INFO */}
          <h3 className="ppm-name">{profile.name}</h3>
          <p className="ppm-role">{profile.profession}</p>

          <span className="ppm-gender-badge">{profile.gender}</span>

          {/* BUTTON */}
          <button className="ppm-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .ppm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2,6,23,0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .ppm-card {
          background: linear-gradient(180deg, #020617, #020617);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          width: 300px;
          padding: 28px 22px 22px;
          text-align: center;
          box-shadow: 0 30px 60px rgba(0,0,0,0.65);
          position: relative;
        }

        .ppm-avatar-wrap {
          display: flex;
          justify-content: center;
          margin-top: -60px;
          margin-bottom: 10px;
        }

        .ppm-avatar,
        .ppm-avatar-fallback {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.15);
          background: #020617;
          object-fit: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          font-weight: 800;
          color: #020617;
          background: linear-gradient(135deg,#38bdf8,#818cf8);
        }

        .ppm-avatar {
          background: none;
          color: unset;
        }

        .ppm-name {
          margin-top: 6px;
          font-size: 1.25rem;
          font-weight: 700;
          color: #e5e7eb;
        }

        .ppm-role {
          margin-top: 2px;
          font-size: 0.95rem;
          color: #94a3b8;
        }

        .ppm-gender-badge {
          display: inline-block;
          margin-top: 12px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(56,189,248,0.15);
          color: #38bdf8;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .ppm-close-btn {
          margin-top: 18px;
          width: 100%;
          padding: 10px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg,#38bdf8,#818cf8);
          font-weight: 700;
          font-size: 0.95rem;
          color: #020617;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .ppm-card {
            width: 90%;
          }
        }
      `}</style>
    </>
  );
};

export default ProfilePreviewModal;
