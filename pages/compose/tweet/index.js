import useUser from "hooks/useUser"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import Button from "components/Button"

import { addDevit, uploadImage } from "firebase/client"
import Head from "next/head"
import Avatar from "components/Avatar"

const COMPOSE_STATES = {
  USER_NOT_KNOWN: 0,
  LOADING: 2,
  SUCCESS: 3,
  ERROR: -1,
}

// Drag and drop images
const DRAG_IMAGE_STATES = {
  ERROR: -1,
  NONE: 0,
  DRAG_OVER: 1,
  UPLOADING: 2,
  COMPLETE: 3,
}

export default function ComposeTweet() {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState(COMPOSE_STATES.USER_NOT_KNOWN)

  // Estados drag and drop
  const [drag, setDrag] = useState(DRAG_IMAGE_STATES.NONE)
  const [task, setTask] = useState(null) // Tarea de firebase de subir imagen
  const [imgURL, setImgURL] = useState(null) // Para ver una vez subido

  const user = useUser()
  const router = useRouter()

  // Creamos un useEffect que cuando se ejecute la tarea de uploadFile
  useEffect(() => {
    // Si existe una tarea (para prevenir el null)
    if (task) {
      // Creamos las funciones del proceso de upload del archivo
      // En proceso
      const onProgress = () => {}
      // Cuando hay un error
      const onError = () => {}
      // Cuando se completa la subida
      const onComplete = () => {
        // Obenemos la URL de firebase del archivo que se acaba de subir para mostrar en el render
        task.snapshot.ref.getDownloadURL().then((imgUrl) => {
          // Guardamos la URL en el state para poder mostrar en el formulario
          setImgURL(imgUrl)
        })
      }

      // Supervisamos el proceso de carga del archivo ejecutando las 3 funciones secuencialmente (orden definido por documentación de Firebase): https://firebase.google.com/docs/storage/web/upload-files
      task.on("state_changed", onProgress, onError, onComplete)
    }
  }, [task])

  // Función para guardar el cambiar texto devit
  const handleChange = (event) => {
    // Obtenemos event.target.value del textarea del formulario
    const { value } = event.target
    setMessage(value)
  }

  // Función para procesar el devit hacia firebase
  const handleSubmit = (event) => {
    // Importante: Siempre poner ya que sino se vuelve loco
    event.preventDefault()
    // Guarda el estado cambiando
    setStatus(COMPOSE_STATES.LOADING)

    // Llamamos a la función de addDevit en el client de firebase para crear un nuevo devit
    addDevit({
      avatar: user.avatar,
      content: message,
      userId: user.uid,
      userName: user.userName,
      img: imgURL,
    })
      .then(() => {
        router.push("/home")
      })
      .catch((err) => {
        console.log(err)
        setStatus(COMPOSE_STATES.ERROR)
      })
  }

  // Functions para drag and drop de imagen a textarea
  // Cuando arrastramos algo encima
  const handleDragEnter = (e) => {
    // Prevenimos el comportamiento por defecto del navegador
    e.preventDefault()

    // Cambiamos el estado de Drag a DRAG_OVER para cambiar css mostrando el border dashed de color azul
    setDrag(DRAG_IMAGE_STATES.DRAG_OVER)
  }

  // Cuando estamos arrastrando y salimos (efecto border radius)
  const handleDragLeave = (e) => {
    // Prevenimos el comportamiento por defecto del navegador
    e.preventDefault()

    // Cambiamos el estado de Drag a NONE
    setDrag(DRAG_IMAGE_STATES.NONE)
  }

  // Cuando dejamos encima el archivo, hacer upload
  const handleOnDrop = (e) => {
    // Prevenimos el comportamiento por defecto del navegador
    e.preventDefault()

    // Cambiamos el estado de Drag a NONE
    setDrag(DRAG_IMAGE_STATES.NONE)

    // Console log del archivo en questión. OJO: Si hacemos console.log(e.dataTransfer) no nos muestra nada por problemas en asincronia de la consola del navegador
    console.log(e.dataTransfer.files[0])

    // Subir imagen con uploadImage de firebase (importado)
    const file = e.dataTransfer.files[0]

    // Creamos la tarea de upload
    const task = uploadImage(file)

    // Guardamos la tarea de upload file en el estado (para hacerlo en el useEffect)
    setTask(task)
  }

  // Si el mensaje esta vacío o el estado del composer_states es loading, deshabilitamos botón
  const isButtonDisabled = !message.length || status === COMPOSE_STATES.LOADING

  return (
    <>
      <Head>
        <title>Crear un Devit / Devter</title>
      </Head>
      <section className="form-container">
        {user && (
          <section className="avatar-container">
            <Avatar src={user.avatar} />
          </section>
        )}
        <form onSubmit={handleSubmit}>
          <textarea
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleOnDrop}
            placeholder="¿Qué está pasando?"
            onChange={handleChange}
          ></textarea>
          {imgURL && (
            <section className="remove-img">
              <button onClick={() => setImgURL(null)}>x</button>
              <img src={imgURL} />
            </section>
          )}
          <div>
            <Button disabled={isButtonDisabled}>Devitear</Button>
          </div>
        </form>
      </section>
      <style jsx>
        {`
          div {
            padding: 15px;
          }
          .avatar-container {
            padding-top: 20px;
            padding-left: 10px;
          }
          .form-container {
            display: flex;
            align-items: flex-start;
          }
          .remove-img {
            position: relative;
          }
          button {
            background: rgba(0, 0, 0, 0.3);
            color: white;
            width: 32px;
            height: 32px;
            font-size: 24px;
            border-radius: 999px;
            border: 0;
            top: 15px;
            right: 15px;
            position: absolute;
            cursor: pointer;
          }
          form {
            padding: 10px;
            width: 100%;
          }
          textarea {
            border: ${drag === DRAG_IMAGE_STATES.DRAG_OVER
              ? "3px dashed #09f"
              : "3px solid transparent"};
            border-radius: 10px;
            font-size: 21px;
            padding: 15px;
            outline: 0;
            resize: none;
            width: 100%;

            min-height: 200px;
          }

          img {
            width: 100%;
            height: auto;
            border-radius: 10px;
          }
        `}
      </style>
    </>
  )
}
