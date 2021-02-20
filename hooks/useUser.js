import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/client"
import { useRouter } from "next/router"

export const USER_STATES = {
  NOT_LOGGED: null,
  NOT_KNOWN: undefined,
}

export default function useUser() {
  // Inicializamos el estado para guardar los datos del usuario
  const [user, setUser] = useState(USER_STATES.NOT_KNOWN)
  const router = useRouter()

  // Cuando cargue el componente ejecutar la función para comprobar si estamos logueados
  // pasando como parametro el método setUser para actualizar los datos del usuario
  useEffect(() => {
    onAuthStateChanged(setUser)
  }, [])

  useEffect(() => {
    user === USER_STATES.NOT_LOGGED && router.push("/")
  }, [user])

  return user
}
