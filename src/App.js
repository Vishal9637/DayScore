import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";

import Dashboard from "./Pages/Dashboard.jsx";
import Profile from "./Pages/Profile.jsx";

import FocusPlanner from "./Pages/FocusPlanner.jsx";
import StudyTimer from "./Pages/StudyTimer.jsx";
import Streak from "./Pages/Streak.jsx";

import CampusCirclePage from "./Pages/CampusCircle/index.jsx";
import PostDetails from "./Pages/CampusCircle/PostDetails.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/planner"
          element={
            <ProtectedRoute>
              <FocusPlanner />
            </ProtectedRoute>
          }
        />

        <Route
          path="/timer"
          element={
            <ProtectedRoute>
              <StudyTimer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/streak"
          element={
            <ProtectedRoute>
              <Streak />
            </ProtectedRoute>
          }
        />

        {/* 🌍 Campus Circle (Protected) */}
        <Route
          path="/campus-circle"
          element={
            <ProtectedRoute>
              <CampusCirclePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/campus-circle/post/:id"
          element={
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          }
        />

        {/* ❓ Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
