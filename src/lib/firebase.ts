
import { initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { derived, writable, type Readable } from "svelte/store";



const firebaseConfig = {
    apiKey: "AIzaSyB46y8E44ilM0uulwlqRjvJQnObB8VKVQQ",
    authDomain: "svelte-course-e7df2.firebaseapp.com",
    projectId: "svelte-course-e7df2",
    storageBucket: "svelte-course-e7df2.appspot.com",
    messagingSenderId: "368565144172",
    appId: "1:368565144172:web:ad1fe9a185af3396c02649",
    measurementId: "G-RXXHV7PDW8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

/**
 * @returns a store with the current firebase user
 */
function userStore() {
    let unsubscribe: () => void;
    const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
        unsubscribe = onAuthStateChanged(auth, (user) => {
            set(user)
        })

        return () => unsubscribe();
    })

    return {
        subscribe,
    }
}

export const user = userStore();



/**
 * @param  {string} path document path or reference
 * @param  {any} startWith optional default data
 * @returns a store with realtime updates on document data
 */
export function docStore<T>(
    path: string,
  ) {
    let unsubscribe: () => void;
  
    const docRef = doc(db, path);
  
    const { subscribe } = writable<T | null>(null, (set) => {
      unsubscribe = onSnapshot(docRef, (snapshot) => {
        set((snapshot.data() as T) ?? null);
      });
  
      return () => unsubscribe();
    });
  
    return {
      subscribe,
      ref: docRef,
      id: docRef.id,
    };
  }
  
  interface UserData {
    username: string;
    bio: string;
    photoURL: string;
    published: boolean;
    links: any[];
  }
  
  export const userData: Readable<UserData | null> = derived(user, ($user, set) => { 
    if ($user) {
      return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
      set(null); 
    }
  }); 