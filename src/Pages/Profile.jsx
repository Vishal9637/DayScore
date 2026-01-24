import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const CLOUD_NAME = "dqggvkox0";
const UPLOAD_PRESET = "dayscore_unsigned";

const Profile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    profession: "",
    photoURL: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // 🔹 Fetch existing profile
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) {
        setForm((p) => ({ ...p, ...snap.data() }));
      }
    });
  }, []);

  // 🔹 Upload image to Cloudinary
  const uploadToCloudinary = async () => {
    if (!image) return form.photoURL;

    if (!image.type.startsWith("image/")) {
      throw new Error("IMAGE_NOT_SUPPORTED");
    }

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );

    const json = await res.json();
    if (!json.secure_url) throw new Error("UPLOAD_FAILED");

    return json.secure_url;
  };

  // 🔹 Save profile
  const saveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // ⛔ Required fields check (IMPORTANT)
    if (!form.name || !form.gender || !form.profession) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    setStatus("");

    try {
      const imageURL = await uploadToCloudinary();

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: form.name,
          age: form.age,
          gender: form.gender,
          profession: form.profession,
          photoURL: imageURL,
          email: user.email,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      setForm((p) => ({ ...p, photoURL: imageURL }));
      setStatus("Profile saved successfully ✔");

      // 🚀 AUTO REDIRECT AFTER PROFILE COMPLETE
      setTimeout(() => {
        navigate("/campus-circle");
      }, 800);
    } catch (err) {
      if (err.message === "IMAGE_NOT_SUPPORTED") {
        setError("Image format not supported.");
      } else {
        setError("Image upload failed.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="profile-page fade-in">
      <div className="profile-card slide-up">
        <h2 className="profile-title">Complete Your Profile</h2>

        {/* AVATAR */}
        <label className="ig-avatar">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : form.photoURL ||
                  `https://ui-avatars.com/api/?name=${form.name || "User"}`
            }
            alt="avatar"
          />
          <span>Change</span>
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        {/* FORM */}
        <div className="profile-form">
          <div>
            <label>Name *</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div>
            <label>Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />
          </div>

          <div>
            <label>Gender *</label>
            <select
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label>Profession *</label>
            <input
              value={form.profession}
              onChange={(e) =>
                setForm({ ...form, profession: e.target.value })
              }
            />
          </div>
        </div>

        <button
          className="profile-save-btn"
          onClick={saveProfile}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>

        {status && <p className="profile-success">{status}</p>}
        {error && <p className="profile-error">{error}</p>}
      </div>

      {/* 🎨 CSS (UNCHANGED, CLEAN) */}
      <style>{`
        .profile-page {
          min-height: 100vh;
          background: radial-gradient(circle at top, #020617, #020617);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .profile-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 2rem;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 30px 80px rgba(0,0,0,0.6);
        }

        .profile-title {
          text-align: center;
          font-size: 1.4rem;
          font-weight: 700;
          color: #f9fafb;
          margin-bottom: 1.4rem;
        }

        .ig-avatar {
          width: 88px;
          height: 88px;
          margin: 0 auto 1.8rem;
          position: relative;
          cursor: pointer;
        }

        .ig-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #38bdf8;
        }

        .ig-avatar span {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(0,0,0,0.45);
          color: #fff;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: 0.25s;
        }

        .ig-avatar:hover span {
          opacity: 1;
        }

        .profile-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.9rem;
        }

        .profile-form label {
          font-size: 0.7rem;
          color: #9ca3af;
        }

        .profile-form input,
        .profile-form select {
          width: 100%;
          padding: 0.55rem;
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          border: none;
          color: #fff;
          outline: none;
        }

        .profile-form div:nth-child(3),
        .profile-form div:nth-child(4) {
          grid-column: span 2;
        }

        .profile-save-btn {
          width: 100%;
          margin-top: 1.6rem;
          padding: 0.7rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #38bdf8, #8b5cf6);
          color: #020617;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }

        .profile-success {
          margin-top: 0.8rem;
          text-align: center;
          color: #22c55e;
          font-size: 0.8rem;
        }

        .profile-error {
          margin-top: 0.8rem;
          text-align: center;
          color: #ef4444;
          font-size: 0.8rem;
        }

        @media (max-width: 480px) {
          .profile-form {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
