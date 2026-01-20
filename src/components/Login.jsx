import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ❌ BLOCK IF NOT VERIFIED
      if (!userCred.user.emailVerified) {
        setError("Please verify your email before logging in.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-slate-800/90 backdrop-blur-xl p-7 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm">

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-1 text-center text-white">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-center text-slate-400 mb-6">
          Login to continue to DayScore
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg mb-3 bg-slate-700/70
                     text-white outline-none focus:ring-2
                     focus:ring-sky-400 transition"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div className="relative mb-4">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-slate-700/70
                       text-white outline-none focus:ring-2
                       focus:ring-sky-400 transition"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 text-sm text-slate-300 hover:text-white"
          >
            {showPass ? "Hide" : "Show"}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* BUTTON */}
        <button
          className={`w-full py-2.5 rounded-lg font-semibold transition-all ${
            loading
              ? "bg-slate-600 cursor-not-allowed text-white"
              : "bg-gradient-to-r from-sky-400 to-violet-400 text-black hover:opacity-90"
          }`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="text-sm text-center mt-5 text-slate-300">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-sky-400 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
