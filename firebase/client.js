import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDRK1HaqFRlIC_dPtd02IZqTXt-O9CZun4',
  authDomain: 'devter-69c2d.firebaseapp.com',
  projectId: 'devter-69c2d',
  storageBucket: 'devter-69c2d.appspot.com',
  messagingSenderId: '173380890389',
  appId: '1:173380890389:web:1c924891056fecb9ebc31c',
  measurementId: 'G-B11GY71PQH'
}

// Initialize Firebase
// Comprueba si existe una aplicación de firebase inicializada, si no es el caso, inicializa con la config
!firebase.apps.length && firebase.initializeApp(firebaseConfig)

// Obtiene los datos mapeando el objeto user y devuelve dichos datos estilizados
const mapUserFromFirebaseAuthToUser = (user) => {
  const { email, photoURL, displayName } = user
  return {
    avatar: photoURL,
    username: displayName,
    email
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

export const loginWithGitHub = () => {
  // Seleccionamos el provider de login con Firebase
  const githubProvider = new firebase.auth.GithubAuthProvider()
  // Llamamos a hacer login en Github via popup
  return firebase.auth().signInWithPopup(githubProvider)
}
