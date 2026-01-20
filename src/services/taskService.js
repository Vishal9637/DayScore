import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Save daily focus tasks (Top 3)
 */
export const saveDailyTasks = async (uid, tasks) => {
  const today = new Date().toISOString().split("T")[0];

  return await addDoc(collection(db, "dailyTasks"), {
    uid,
    tasks,
    date: today,
    createdAt: new Date(),
  });
};

/**
 * Get today's tasks for logged-in user
 */
export const getTodayTasks = async (uid) => {
  const today = new Date().toISOString().split("T")[0];

  const q = query(
    collection(db, "dailyTasks"),
    where("uid", "==", uid),
    where("date", "==", today)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
};

/**
 * Update existing tasks
 */
export const updateDailyTasks = async (docId, updatedTasks) => {
  const ref = doc(db, "dailyTasks", docId);

  await updateDoc(ref, {
    tasks: updatedTasks,
    updatedAt: new Date(),
  });
};

/**
 * Check if tasks already exist for today
 */
export const hasTasksForToday = async (uid) => {
  const today = new Date().toISOString().split("T")[0];

  const q = query(
    collection(db, "dailyTasks"),
    where("uid", "==", uid),
    where("date", "==", today)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
};
