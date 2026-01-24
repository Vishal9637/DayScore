import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const CampusCircleGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (!snap.exists()) {
          setAllowed(false);
        } else {
          const data = snap.data();
          const completed =
            data.name &&
            data.photoURL &&
            data.gender &&
            data.profession;

          setAllowed(Boolean(completed));
        }
      } catch (e) {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
        Checking access…
      </p>
    );
  }

  if (!allowed) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default CampusCircleGuard;
