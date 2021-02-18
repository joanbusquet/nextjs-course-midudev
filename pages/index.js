import { useEffect, useState } from "react"
import Head from "next/head"
import { colors } from "styles/theme"

import AppLayout from "components/AppLayout"
import Button from "components/Button"
import GitHub from "components/Icons/github"

import { loginWithGitHub, onAuthStateChanged } from "firebase/client"
import Avatar from "components/Avatar"

export default function Home() {
  // Inicializamos el estado para guardar los datos del usuario
  const [user, setUser] = useState(undefined)

  // Cuando cargue el componente ejecutar la función para comprobar si estamos logueados
  // pasando como parametro el método setUser para actualizar los datos del usuario
  useEffect(() => {
    onAuthStateChanged(setUser)
  }, [])

  // Función para llamar al login cuando hacemos clic al botón de login con Github
  const handleClick = () => {
    // Llamamos al método loginWithGitHub y si es OK, guardamos los datos del usuario al estado user
    loginWithGitHub()
      .then((user) => {
        setUser(user)
      })
      .catch((err) => console.log(err))
  }
  return (
    <>
      <Head>
        <title>devter 🐦</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <section>
          <img src="/logo.png" alt="logo" />
          <h1>Devter</h1>
          <h2>Talk about development with developers</h2>
          <div>
            {/* Si el usuario es null (no ha hecho login) */}
            {user === null && (
              <Button onClick={handleClick}>
                <GitHub fill={"white"} width={24} height={24} />
                Login with GitHub
              </Button>
            )}
            {/* Si el usuario existe (está logueado) y existe avatar, mostrar datos */}
            {user && user.avatar && (
              <div>
                <Avatar
                  src={user.avatar}
                  alt={user.username}
                  text={user.username}
                />
              </div>
            )}
          </div>
        </section>
      </AppLayout>

      <style jsx>{`
        img {
          width: 120px;
        }
        div {
          margin-top: 16px;
        }
        section {
          display: grid;
          place-content: center;
          place-items: center;
          height: 100%;
        }
        h1 {
          color: ${colors.primary};
          font-weight: 800;
          font-size: 32px;
          margin-bottom: 16px;
        }

        h2 {
          color: ${colors.secondary};
          font-size: 21px;
          margin: 0;
        }
      `}</style>
    </>
  )
}
