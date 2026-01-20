import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { updateStreak } from "../services/streakService";

const StudyTimer = () => {
  // User-configurable (minutes)
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const [time, setTime] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("focus"); // focus | break

  const FOCUS_TIME = focusMinutes * 60;
  const BREAK_TIME = breakMinutes * 60;

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev === 0) {
          if (mode === "focus") {
            // focus completed → update streak
            if (auth.currentUser) {
              updateStreak(auth.currentUser.uid);
            }
            setMode("break");
            return BREAK_TIME;
          } else {
            setMode("focus");
            return FOCUS_TIME;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, mode, FOCUS_TIME, BREAK_TIME]);

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)}:${("0" + (sec % 60)).slice(-2)}`;

  const resetTimer = () => {
    setRunning(false);
    setMode("focus");
    setTime(FOCUS_TIME);
  };

  const applySettings = () => {
    setRunning(false);
    setMode("focus");
    setTime(FOCUS_TIME);
  };

  return (
    <div className="timer-page fade-in">
      <div className="timer-card slide-up">

        <h2 className="timer-title">
          {mode === "focus" ? "🎯 Focus Time" : "☕ Break Time"}
        </h2>

        {/* TIMER */}
        <div className="timer-circle">
          <span className="timer-text">{formatTime(time)}</span>
        </div>

        {/* CONTROLS */}
        <div className="timer-actions">
          {!running ? (
            <button
              className="timer-btn start"
              onClick={() => setRunning(true)}
            >
              Start
            </button>
          ) : (
            <button
              className="timer-btn pause"
              onClick={() => setRunning(false)}
            >
              Pause
            </button>
          )}

          <button className="timer-btn reset" onClick={resetTimer}>
            Reset
          </button>
        </div>

        {/* SETTINGS */}
        <div className="timer-settings">
          <div className="setting">
            <label>Focus (min)</label>
            <input
              type="number"
              min="5"
              max="120"
              value={focusMinutes}
              onChange={(e) => setFocusMinutes(Number(e.target.value))}
            />
          </div>

          <div className="setting">
            <label>Break (min)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
            />
          </div>

          <button className="apply-btn" onClick={applySettings}>
            Apply
          </button>
        </div>

        <p className="timer-note">
          {mode === "focus"
            ? "Stay focused — your streak is counting 🔥"
            : "Relax your mind for a moment ☁️"}
        </p>

      </div>
    </div>
  );
};

export default StudyTimer;
