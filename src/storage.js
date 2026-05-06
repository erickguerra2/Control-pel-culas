import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'

const LOCAL_KEY = 'peliculas_data'
let localListeners = []

function getLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
  } catch {
    return []
  }
}

function setLocal(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
  localListeners.forEach(fn => fn([...data]))
}

function makeLocalId() {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

const firebaseEnabled =
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'tu-proyecto'

export { firebaseEnabled }

let dbPromise = null
async function getDb() {
  if (!dbPromise) {
    dbPromise = import('./firebase.js').then(m => m.db)
  }
  return dbPromise
}

export function subscribeMovies(callback) {
  if (firebaseEnabled) {
    let unsubscribe = () => {}
    getDb().then(db => {
      unsubscribe = onSnapshot(collection(db, 'movies'), snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        data.sort((a, b) => {
          const at = a.createdAt?.seconds ?? a.createdAt ?? 0
          const bt = b.createdAt?.seconds ?? b.createdAt ?? 0
          return bt - at
        })
        callback(data)
      })
    })
    return () => unsubscribe()
  } else {
    callback(getLocal())
    localListeners.push(callback)
    return () => {
      localListeners = localListeners.filter(fn => fn !== callback)
    }
  }
}

export async function addMovie(data) {
  if (firebaseEnabled) {
    const db = await getDb()
    await addDoc(collection(db, 'movies'), { ...data, createdAt: serverTimestamp() })
  } else {
    const movies = getLocal()
    movies.unshift({ ...data, id: makeLocalId(), createdAt: Date.now() })
    setLocal(movies)
  }
}

export async function updateMovie(id, data) {
  if (firebaseEnabled) {
    const db = await getDb()
    await updateDoc(doc(db, 'movies', id), data)
  } else {
    const movies = getLocal().map(m => m.id === id ? { ...m, ...data } : m)
    setLocal(movies)
  }
}

export async function deleteMovie(id) {
  if (firebaseEnabled) {
    const db = await getDb()
    await deleteDoc(doc(db, 'movies', id))
  } else {
    setLocal(getLocal().filter(m => m.id !== id))
  }
}

export async function markWatched(id) {
  if (firebaseEnabled) {
    const db = await getDb()
    await updateDoc(doc(db, 'movies', id), { status: 'vista', watchedAt: serverTimestamp() })
  } else {
    const movies = getLocal().map(m =>
      m.id === id ? { ...m, status: 'vista', watchedAt: Date.now() } : m
    )
    setLocal(movies)
  }
}
