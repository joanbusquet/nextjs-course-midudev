const admin = require("firebase-admin")

const serviceAccount = require("./firebase-keys.json")

// Probamos si se puede inicializar

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://devter-69c2d.firebaseio.com",
  })
} catch (e) {}

export const firestore = admin.firestore()
