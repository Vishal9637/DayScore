import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

/* ============================
   FETCH USER PROFILE FROM FIRESTORE
============================ */
const getUserProfile = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    return {
      name: data.name || "Student",
      photoURL: data.photoURL || null,
    };
  }

  return {
    name: "Student",
    photoURL: null,
  };
};

/* ============================
   CREATE POST
============================ */
export const createPost = async (user, content, anonymous) => {
  if (!user || !content.trim()) return;

  const profile = await getUserProfile(user.uid);

  await addDoc(collection(db, "posts"), {
    userId: user.uid,
    userName: anonymous ? "Anonymous" : profile.name,
    userAvatar: anonymous ? null : profile.photoURL,
    content,
    anonymous,
    likes: 0,
    repliesCount: 0,
    createdAt: serverTimestamp(),
  });
};

/* ============================
   LISTEN TO POSTS
============================ */
export const listenToPosts = (setPosts) => {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    setPosts(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  });
};

/* ============================
   LISTEN TO REPLIES
============================ */
export const listenToReplies = (postId, setReplies) => {
  if (!postId) return;

  const q = query(
    collection(db, "replies"),
    where("postId", "==", postId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    setReplies(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  });
};

/* ============================
   ADD REPLY
============================ */
export const addReply = async (postId, user, message) => {
  if (!user || !postId || !message.trim()) return;

  const profile = await getUserProfile(user.uid);

  // 1️⃣ Add reply
  await addDoc(collection(db, "replies"), {
    postId,
    userId: user.uid,
    userName: profile.name,
    userAvatar: profile.photoURL,
    message,
    likes: 0,
    createdAt: serverTimestamp(),
  });

  // 2️⃣ Increment reply count
  await updateDoc(doc(db, "posts", postId), {
    repliesCount: increment(1),
  });
};
