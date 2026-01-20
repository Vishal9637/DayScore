import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const updateStreak = async (uid) => {
  const today = new Date().toISOString().split("T")[0];
  const ref = doc(db, "streaks", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      currentStreak: 1,
      lastActiveDate: today,
    });
    return;
  }

  const { currentStreak, lastActiveDate } = snap.data();

  if (lastActiveDate === today) return;

  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];

  if (lastActiveDate === yesterday) {
    await updateDoc(ref, {
      currentStreak: currentStreak + 1,
      lastActiveDate: today,
    });
  } else {
    await updateDoc(ref, {
      currentStreak: 1,
      lastActiveDate: today,
    });
  }
};
