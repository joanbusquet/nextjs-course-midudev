import useUser from "hooks/useUser"
import { useState } from "react"
import { useRouter } from "next/router"

import AppLayout from "components/AppLayout"
import Button from "components/Button"

import { addDevit } from "firebase/client"
import Head from "next/head"

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
  // Función para guardar el cambiar texto devit
  const handleChange = (event) => {
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
    })
      .then(() => {
        router.push("/home")
      })
      .catch((err) => {
        console.log(err)
        setStatus(COMPOSE_STATES.ERROR)
      })
  }

  //Functions para drag and drop de imagen a textarea
  //Cuando arrastramos algo encima
  const handleDragEnter = () => {
    setDrag(DRAG_IMAGE_STATES.DRAG_OVER)
  }

  //Cuando estamos arrastrando y salimos (efecto border radius)
  const handleDragLeave = () => {
    setDrag(DRAG_IMAGE_STATES.NONE)
  }

  //Cuando dejamos encima
  const handleOnDrop = () => {
    setDrag(DRAG_IMAGE_STATES.NONE)
  }

  // Si el mensaje esta vacío o el estado del composer_states es loading, deshabilitamos botón
  const isButtonDisabled = !message.length || status === COMPOSE_STATES.LOADING

  return (
    <>
      <AppLayout>
        <Head>
          <title>Crear un Devit / Devter</title>
        </Head>
        <form onSubmit={handleSubmit}>
          <textarea
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleOnDrop}
            placeholder="¿Qué está pasando?"
            onChange={handleChange}
          ></textarea>
          <div>
            <Button disabled={isButtonDisabled}>Devitear</Button>
          </div>
        </form>
      </AppLayout>
      <style jsx>
        {`
          div {
            padding: 15px;
          }
          form {
            padding: 10px;
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
        `}
      </style>
    </>
  )
}
