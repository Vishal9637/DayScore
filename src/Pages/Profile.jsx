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

  /* =========================
     FETCH PROFILE
  ========================= */
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) {
        setForm((p) => ({ ...p, ...snap.data() }));
      }
    });
  }, []);

  /* =========================
     IMAGE UPLOAD
  ========================= */
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

  /* =========================
     SAVE PROFILE
  ========================= */
  const saveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

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

      setStatus("Profile saved ✔");

      setTimeout(() => {
        navigate("/campus-circle");
      }, 700);
    } catch {
      setError("Image upload failed.");
    }

    setLoading(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
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
          {/* NAME */}
          <div className="full">
            <label>Name *</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* AGE */}
          <div className="full">
            <label>Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />
          </div>

          {/* GENDER */}
          <div className="full">
            <label>Gender *</label>
            <select
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* PROFESSION */}
          <div className="full">
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

      {/* ================= CSS ================= */}
      <style>{`
        .profile-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, #020617, #020617);
          padding: 16px;
        }

        .profile-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .profile-title {
          text-align: center;
          color: #f9fafb;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .ig-avatar {
          width: 88px;
          height: 88px;
          margin: 0 auto 20px;
          position: relative;
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
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          color: white;
          font-size: 0.75rem;
        }

        .ig-avatar:hover span {
          opacity: 1;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .profile-form label {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .profile-form input,
        .profile-form select {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: none;
          background: rgba(255,255,255,0.9);
          color: #020617;
        }

        .profile-save-btn {
          margin-top: 18px;
          width: 100%;
          padding: 12px;
          border-radius: 999px;
          background: linear-gradient(135deg,#38bdf8,#8b5cf6);
          border: none;
          font-weight: 700;
          cursor: pointer;
        }

        .profile-success {
          margin-top: 10px;
          text-align: center;
          color: #22c55e;
          font-size: 0.85rem;
        }

        .profile-error {
          margin-top: 10px;
          text-align: center;
          color: #ef4444;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};

export default Profile;
