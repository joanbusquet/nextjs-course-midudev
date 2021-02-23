import { firestore } from "firebase/admin"

export default (request, response) => {
  const { query } = request
  const { id } = query

  // Realizamos la query dentro de la colección de devits pasandole el id del devit en cuestión
  firestore
    .collection("devits")
    .doc(id)
    .get()
    .then((doc) => {
      // Obtenemos los datos del objecto que nos devuelve firestore llamando al metodo data()
      const data = doc.data()
      // Obtenemos el id
      const id = doc.id
      // Obtenemos la fecha de creacion para darle formato especifico
      const { createdAt } = data

      // Devolvemos la data
      response.json({
        ...data,
        id,
        createdAt: +createdAt.toDate(),
      })
    })
    .catch(() => {
      // Si no encuentra ningún devit, devolvemos un 404 y finalizamos
      response.status(404).end()
    })
}
