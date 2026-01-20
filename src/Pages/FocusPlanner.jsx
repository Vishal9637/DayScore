import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { updateStreak } from "../services/streakService";

const FocusPlanner = () => {
  const [tasks, setTasks] = useState([
    { text: "", completed: false },
    { text: "", completed: false },
    { text: "", completed: false },
  ]);
  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  /* 🔍 Fetch today's tasks */
  useEffect(() => {
    const fetchTasks = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "dailyTasks"),
        where("uid", "==", user.uid),
        where("date", "==", today)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const data = snapshot.docs[0];
        const rawTasks = data.data().tasks;

        // ✅ Normalize old (string) + new (object) tasks
        const normalizedTasks = rawTasks.map((task) =>
          typeof task === "string"
            ? { text: task, completed: false }
            : task
        );

        setTasks(normalizedTasks);
        setDocId(data.id);
      }

      setLoading(false);
    };

    fetchTasks();
  }, [today]); // ✅ ESLint fix

  /* ✏️ Handle input */
  const handleChange = (index, value) => {
    const updated = [...tasks];
    updated[index] = { ...updated[index], text: value };
    setTasks(updated);
  };

  /* 💾 Save tasks */
  const saveTasks = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Login required");

    const validTasks = tasks.filter((t) => t.text.trim() !== "");
    if (validTasks.length === 0) {
      return alert("Please enter at least one task");
    }

    const docRef = await addDoc(collection(db, "dailyTasks"), {
      uid: user.uid,
      tasks,
      date: today,
      createdAt: new Date(),
    });

    setDocId(docRef.id);
    await updateStreak(user.uid);
  };

  /* ✅ Mark task completed */
  const completeTask = async (index) => {
    const updated = [...tasks];
    updated[index] = { ...updated[index], completed: true };
    setTasks(updated);

    await updateDoc(doc(db, "dailyTasks", docId), {
      tasks: updated,
      updatedAt: new Date(),
    });
  };

  if (loading) {
    return <div className="planner-page">Loading...</div>;
  }

  return (
    <div className="planner-page fade-in">
      <div className="planner-card slide-up">
        <h2 className="planner-title">🎯 Daily Focus Planner</h2>
        <p className="planner-subtitle">Focus on what matters today</p>

        {/* INPUT MODE */}
        {!docId && (
          <>
            <div className="task-list">
              {tasks.map((task, i) => (
                <input
                  key={i}
                  value={task.text}
                  placeholder={`Task ${i + 1}`}
                  onChange={(e) => handleChange(i, e.target.value)}
                  className="task-input"
                />
              ))}
            </div>

            <button className="planner-btn" onClick={saveTasks}>
              Save Tasks
            </button>
          </>
        )}

        {/* VIEW MODE */}
        {docId && (
          <div className="saved-task-list">
            {tasks.map((task, i) => (
              <div
                key={i}
                className={`saved-task ${task.completed ? "done" : ""}`}
              >
                <span>{task.text}</span>

                {!task.completed && (
                  <button
                    className="complete-btn"
                    onClick={() => completeTask(i)}
                  >
                    Mark Completed
                  </button>
                )}

                {task.completed && (
                  <span className="done-text">✅ Done</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusPlanner;
