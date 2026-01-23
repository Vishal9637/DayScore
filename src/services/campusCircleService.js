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
} from "firebase/firestore";
import { db } from "../firebase";

/* Create Post */
export const createPost = async (user, content, anonymous) => {
  await addDoc(collection(db, "posts"), {
    userId: user.uid,
    userName: anonymous ? "Anonymous" : user.displayName,
    userAvatar: anonymous ? null : user.photoURL,
    content,
    anonymous,
    likes: 0,
    repliesCount: 0,
    createdAt: serverTimestamp(),
  });
};

/* Get All Posts */
export const listenToPosts = (setPosts) => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    setPosts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

/* Get Replies */
export const listenToReplies = (postId, setReplies) => {
  const q = query(
    collection(db, "replies"),
    where("postId", "==", postId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    setReplies(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

/* Add Reply */
export const addReply = async (postId, user, message) => {
  await addDoc(collection(db, "replies"), {
    postId,
    userId: user.uid,
    userName: user.displayName,
    userAvatar: user.photoURL,
    message,
    likes: 0,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "posts", postId), {
    repliesCount: increment(1),
  });
};
