import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDRK1HaqFRlIC_dPtd02IZqTXt-O9CZun4",
  authDomain: "devter-69c2d.firebaseapp.com",
  projectId: "devter-69c2d",
  storageBucket: "devter-69c2d.appspot.com",
  messagingSenderId: "173380890389",
  appId: "1:173380890389:web:1c924891056fecb9ebc31c",
  measurementId: "G-B11GY71PQH",
}

// Initialize Firebase
// Comprueba si existe una aplicación de firebase inicializada, si no es el caso, inicializa con la config
!firebase.apps.length && firebase.initializeApp(firebaseConfig)

// Inicializar el firestore
const db = firebase.firestore()

// Obtiene los datos mapeando el objeto user y devuelve dichos datos estilizados
const mapUserFromFirebaseAuthToUser = (user) => {
  const { email, photoURL, displayName, uid } = user
  return {
    avatar: photoURL,
    userName: displayName,
    email,
    uid,
  }
}

// Estado de Firebase cuando cambia de estado
// Cuando el estado cambia, llama a la función que recibe por parametro (para guardar el state, por ejemplo)
export const onAuthStateChanged = (onChange) => {
  // Comprueba si ha cambiado el estado de Firebase
  return firebase.auth().onAuthStateChanged((user) => {
    // Guarda en la constante normalizedUser los datos tratados en la función que hemos creado para tratar los datos de user
    const normalizedUser = user ? mapUserFromFirebaseAuthToUser(user) : null
    // Ejecuta la función que le hemos pasado por parametro (cambiar estado setUser) con los datos del usuario
    onChange(normalizedUser)
  })
}

// Función de login con GitHub
export const loginWithGitHub = () => {
  // Seleccionamos el provider de login con Firebase
  const githubProvider = new firebase.auth.GithubAuthProvider()
  // Llamamos a hacer login en Github via popup
  return firebase.auth().signInWithPopup(githubProvider)
}

// Función que añade un devit a la colección de devits de Firebase
export const addDevit = ({ avatar, content, userId, userName, img }) => {
  return db.collection("devits").add({
    avatar,
    content,
    userId,
    userName,
    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
    likesCount: 0,
    sharedCount: 0,
    img,
  })
}

// Función de obtener todos los devits ordenados por fecha descendiente (feed de devter)
export const fetchLatestDevits = () => {
  return db
    .collection("devits")
    .orderBy("createdAt", "desc")
    .get()
    .then(({ docs }) => {
      return docs.map((doc) => {
        // Extrae todos los campos de ese documento
        const data = doc.data()
        // Obtenemos el ID
        const id = doc.id
        // Obtenemos la fecha de creación
        const { createdAt } = data
        // Convertir a fecha de javascript con unary operator (+)
        return { ...data, id, createdAt: +createdAt.toDate() }
      })
    })
}

export const uploadImage = (file) => {
  // Creamos una referencia pasandole lo que queremos subir en el storage
  const ref = firebase.storage().ref(`images/${file.name}`)

  // Lo que se pasa, en este caso un file, ponerlo en la referencia (como un upload)
  const task = ref.put(file)

  return task
}
