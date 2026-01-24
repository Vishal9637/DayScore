import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const ProfileCompleteRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        const data = snap.data();

        const completed =
          data.name &&
          data.photoURL &&
          data.gender &&
          data.profession;

        setIsComplete(!!completed);
      }

      setLoading(false);
    };

    checkProfile();
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
        Checking profile...
      </p>
    );
  }

  if (!isComplete) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProfileCompleteRoute;
