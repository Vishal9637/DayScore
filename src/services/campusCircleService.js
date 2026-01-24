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
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

/* ============================
   FETCH USER PROFILE
============================ */
const getUserProfile = async (uid) => {
  if (!uid) {
    return { name: "Anonymous", photoURL: null };
  }

  const snap = await getDoc(doc(db, "users", uid));

  if (snap.exists()) {
    const data = snap.data();
    return {
      name: data.name || "Student",
      photoURL: data.photoURL || null,
    };
  }

  return { name: "Student", photoURL: null };
};

/* ============================
   CREATE POST
============================ */
export const createPost = async (user, content, anonymous) => {
  if (!user || !content.trim()) return;

  const profile = anonymous
    ? { name: "Anonymous", photoURL: null }
    : await getUserProfile(user.uid);

  await addDoc(collection(db, "posts"), {
    userId: anonymous ? null : user.uid,
    userName: profile.name,
    userAvatar: profile.photoURL,
    anonymous,
    content: content.trim(),
    likes: 0,
    repliesCount: 0,
    createdAt: serverTimestamp(),
  });
};

/* ============================
   LISTEN TO POSTS
============================ */
export const listenToPosts = (setPosts) => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

/* ============================
   LISTEN TO REPLIES
============================ */
export const listenToReplies = (postId, setReplies) => {
  if (!postId) return () => {};

  const q = query(
    collection(db, "replies"),
    where("postId", "==", postId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    setReplies(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

/* ============================
   ADD REPLY
============================ */
export const addReply = async (postId, user, message) => {
  if (!user || !message.trim()) return;

  const profile = await getUserProfile(user.uid);

  await addDoc(collection(db, "replies"), {
    postId,
    userId: user.uid,
    userName: profile.name,
    userAvatar: profile.photoURL,
    message: message.trim(),
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "posts", postId), {
    repliesCount: increment(1),
  });
};

/* ============================
   TOGGLE POST LIKE ✅
============================ */
export const togglePostLike = async (postId, userId) => {
  const likeRef = doc(db, "likes", `${postId}_${userId}`);
  const postRef = doc(db, "posts", postId);

  const snap = await getDoc(likeRef);

  if (snap.exists()) {
    await deleteDoc(likeRef);
    await updateDoc(postRef, { likes: increment(-1) });
  } else {
    await setDoc(likeRef, {
      postId,
      userId,
      createdAt: serverTimestamp(),
    });
    await updateDoc(postRef, { likes: increment(1) });
  }
};

/* ============================
   LISTEN TO LIKE STATE ✅
============================ */
export const listenToPostLikeState = (postId, userId, setLiked) => {
  if (!postId || !userId) return () => {};

  const likeRef = doc(db, "likes", `${postId}_${userId}`);

  return onSnapshot(likeRef, (snap) => {
    setLiked(snap.exists());
  });
};
