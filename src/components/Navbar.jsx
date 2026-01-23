import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const ref = doc(db, "users", currentUser.uid);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            setProfileImg(snap.data().photoURL || null);
          } else {
            setProfileImg(null);
          }
        } catch (err) {
          console.error("Profile fetch error:", err);
          setProfileImg(null);
        }
      } else {
        setProfileImg(null);
      }
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "text-sky-400"
      : "hover:text-sky-400";

  const Avatar = ({ size = "w-9 h-9" }) =>
    profileImg ? (
      <img
        src={profileImg}
        alt="Profile"
        className={`${size} rounded-full object-cover border border-white/20`}
      />
    ) : (
      <div
        title={user?.email}
        className={`${size} rounded-full bg-sky-500 flex items-center justify-center text-sm font-bold text-black`}
      >
        {user?.email?.[0]?.toUpperCase()}
      </div>
    );

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent"
          onClick={() => setMenuOpen(false)}
        >
          DayScore
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6">
          <Link className={isActive("/")} to="/">Home</Link>

          {!user && (
            <Link className={isActive("/login")} to="/login">
              Login
            </Link>
          )}

          {user && (
            <>
              <Link className={isActive("/dashboard")} to="/dashboard">
                Dashboard
              </Link>

              <Link className={isActive("/campus-circle")} to="/campus-circle">
                Campus Circle
              </Link>

              <Link className={isActive("/profile")} to="/profile">
                Profile
              </Link>

              {/* AVATAR */}
              <Avatar />

              {/* LOGOUT */}
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400
                           hover:bg-red-500 hover:text-white transition-all"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-gray-200 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-white/10 px-6 py-4 space-y-4">

          <Link
            to="/"
            className={`block ${isActive("/")}`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {!user && (
            <Link
              to="/login"
              className={`block ${isActive("/login")}`}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}

          {user && (
            <>
              <Link
                to="/dashboard"
                className={`block ${isActive("/dashboard")}`}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/campus-circle"
                className={`block ${isActive("/campus-circle")}`}
                onClick={() => setMenuOpen(false)}
              >
                Campus Circle
              </Link>

              <Link
                to="/profile"
                className={`block ${isActive("/profile")}`}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>

              {/* USER INFO */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <Avatar size="w-10 h-10" />
                <span className="text-sm text-gray-300 truncate">
                  {user.email}
                </span>
              </div>

              {/* LOGOUT */}
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 rounded-lg
                           bg-red-500/20 text-red-400
                           hover:bg-red-500 hover:text-white transition-all"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
