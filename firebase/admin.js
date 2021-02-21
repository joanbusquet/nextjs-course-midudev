const admin = require("firebase-admin")

const serviceAccount = require("./firebase-keys.json")

// Probamos si se puede inicializar
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
} catch (
  e // Si ya está inicializado mostrar errror
) {
  console.log(e)
}

export const firestore = admin.firestore()
