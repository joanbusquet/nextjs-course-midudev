// Obtiene el objeto props que viene del getInitialProps

import Devit from "components/Devit"
import { firestore } from "firebase/admin"
import { useRouter } from "next/router"

// Se pasa un string al DOM y javascript lo toma y rehidrata la aplicación con los datos string del DOM
export default function DevitPage(props) {
  const router = useRouter()

  // Propiedad del router comprovando si la aplicación está en modo fallback para esperar a generar estáticamente la página
  if (router.isFallback) return "<h1>Generando página estática...</h1>"

  return (
    <>
      <Devit {...props} />
    </>
  )
}

// GET STATIC PROPS
// 1a función: getStaticPaths --> Sirve para decirle a la aplicación cuales son los paths que tiene que generar con contenido estático
// Devolver objeto con:
// Paths: lista de URL
// Fallback:
export async function getStaticPaths() {
  return {
    // Array con todas las URL que generar página estática
    paths: [{ params: { id: "e5rP3ny7Qe3RYtytrPg7" } }],
    // Fallback = true significa que si la página solicitada no hace match con ningun path, va a intentar renderizar la página en el cliente generando una página estática bajo demanda. Si se accede otra vez a la misma url ya servirá la página estática. (Generación de páginas estáticas al vuelo)
    fallback: true,
  }
}

// 2a función: getStaticProps
export async function getStaticProps(context) {
  // En vez de recibir query como getInitialProps, recibe params del context
  const { params } = context
  // El id es el parámtero que hemos creado en el nombre del archivo de esta página (el parámetro a recojer)
  const { id } = params

  // No se puede llamar a la API interna de Next, pero podemos hacer fetch a Firebase, por ejemplo o a otros proveedores externos
  // Realizamos la query dentro de la colección de devits pasandole el id del devit en cuestión
  return firestore
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
      const props = {
        ...data,
        id,
        createdAt: +createdAt.toDate(),
      }
      return { props }
    })
    .catch(() => {
      // Si no encuentra ningún devit, devolvemos un 404 y finalizamos
      return { props: {} }
    })
}

// GET SERVERSIDE PROPS
// Se ejecuta en el SERVIDOR cuando se accede directamente a la URL
// Se ejecuta en el CLIENTE cuando pasamos de una página a otra (SPA). Obviamente se hace así ya que no se va a renderizar la pagina de nuevo y ejecutar el servidor
// Pasamos el parámetro context: params, query, req, res, err
// Docs: https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
/* export async function getServerSideProps(context) {
  // En vez de recibir query como getInitialProps, recibe params del context
  const { params, res } = context
  // El id es el parámtero que hemos creado en el nombre del archivo de esta página (el parámetro a recojer)
  const { id } = params

  // Devolvemos el fetch de la api que hemos realizado conectada a Firestore para devolver los datos del devit con el id que le pasamos por parámetro
  const apiResponse = await fetch(`http://localhost:3000/api/devits/${id}`)
  // Si la respuesta del API es OK, devolvemos el objecto json que nos devuelve la API
  if (apiResponse.ok) {
    const props = await apiResponse.json()
    // Tenemos que devolver objeto con key llamada props
    return { props }
  }
  if (res) {
    // solo lo tenemos en el servidor
    // res.writeHead(404).end() <-- redireccion a 404
    res.writeHead(301, { Location: "/home" }).end() // <-- redireccion 301 hacia la homepage
  }
} */

// GETINITIAL PROPS
// Se ejecuta en el SERVIDOR cuando se accede directamente a la URL
// Se ejecuta en el CLIENTE cuando pasamos de una página a otra (SPA). Obviamente se hace así ya que no se va a renderizar la pagina de nuevo y ejecutar el servidor
// Pasamos el parámetro context: pathname, query, req, res, err
// Docs: https://nextjs.org/docs/api-reference/data-fetching/getInitialProps
/* DevitPage.getInitialProps = (context) => {
  const { query, res } = context
  // El id es el parámtero que hemos creado en el nombre del archivo de esta página (el parámetro a recojer)
  const { id } = query

  // Devolvemos el fetch de la api que hemos realizado conectada a Firestore para devolver los datos del devit con el id que le pasamos por parámetro
  return fetch(`http://localhost:3000/api/devits/${id}`).then((apiResponse) => {
    // Si la respuesta del API es OK, devolvemos el objecto json que nos devuelve la API
    if (apiResponse.ok) return apiResponse.json()
    if (res) {
      // solo lo tenemos en el servidor
      // res.writeHead(404).end() <-- redireccion a 404
      res.writeHead(301, { Location: "/home" }).end() // <-- redireccion 301 hacia la homepage
    }
  })
} */
