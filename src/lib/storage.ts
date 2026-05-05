import { ProductIdea } from "../types";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, deleteDoc, getDocs, collection, serverTimestamp, query, orderBy, Timestamp } from "firebase/firestore";
import { handleFirestoreError } from "../components/AuthProvider";
import { OperationType } from "./firebaseTypes";

export const STORAGE_KEY = "ecolens_history";

export async function loadHistory(): Promise<ProductIdea[]> {
  try {
    if (auth.currentUser) {
      const ideasRef = collection(db, 'users', auth.currentUser.uid, 'ideas');
      const q = query(ideasRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const ideas: ProductIdea[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.createdAt && typeof data.createdAt.toMillis === 'function') {
           data.createdAt = data.createdAt.toMillis();
        }
        ideas.push(data as ProductIdea);
      });
      return ideas;
    } else {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
  } catch (err) {
    if (auth.currentUser) {
      handleFirestoreError(err, OperationType.GET, `users/${auth.currentUser.uid}/ideas`);
    } else {
      console.error("Failed to load history", err);
    }
    return [];
  }
}

export function saveHistory(ideas: ProductIdea[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
  } catch (err) {
    console.error("Failed to save history", err);
  }
}

export async function addOrUpdateIdea(idea: ProductIdea) {
  if (auth.currentUser) {
    try {
      const ideaRef = doc(db, 'users', auth.currentUser.uid, 'ideas', idea.id);
      const existingDoc = await getDoc(ideaRef);
      
      const payload: any = {
        ...idea,
        userId: auth.currentUser.uid,
      };

      if (!existingDoc.exists()) {
         payload.createdAt = serverTimestamp();
      } else {
         payload.createdAt = existingDoc.data().createdAt; // keep original
      }

      await setDoc(ideaRef, payload, { merge: true });
    } catch(err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}/ideas/${idea.id}`);
    }
  } else {
    const history = await loadHistory();
    const index = history.findIndex(i => i.id === idea.id);
    if (index >= 0) {
      history[index] = idea;
    } else {
      history.unshift(idea);
    }
    saveHistory(history);
  }
}

export async function deleteIdea(id: string) {
  if (auth.currentUser) {
    try {
      const ideaRef = doc(db, 'users', auth.currentUser.uid, 'ideas', id);
      await deleteDoc(ideaRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${auth.currentUser.uid}/ideas/${id}`);
    }
    return await loadHistory();
  } else {
    const history = await loadHistory();
    const newHistory = history.filter(i => i.id !== id);
    saveHistory(newHistory);
    return newHistory;
  }
}

