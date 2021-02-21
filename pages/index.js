import { useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"

import useUser, { USER_STATES } from "hooks/useUser"

import { colors } from "styles/theme"

import Button from "components/Button"
import GitHub from "components/Icons/github"

import { loginWithGitHub } from "firebase/client"

export default function Home() {
  const user = useUser()
  const router = useRouter()

  // Si el usuario está logueado, redireccionar a /home
  useEffect(() => {
    user && router.replace("/home")
  }, [user])

  // Función para llamar al login cuando hacemos clic al botón de login con Github
  const handleClick = () => {
    // Llamamos al método loginWithGitHub y si es OK, guardamos los datos del usuario al estado user
    loginWithGitHub().catch((err) => console.log(err))
  }
  return (
    <>
      <Head>
        <title>devter 🐦</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section>
        <img src="/logo.png" alt="logo" />
        <h1>Devter</h1>
        <h2>Talk about development with developers</h2>
        <div>
          {/* Si el usuario es null (no ha hecho login) */}
          {user === USER_STATES.NOT_LOGGED && (
            <Button onClick={handleClick}>
              <GitHub fill={"white"} width={24} height={24} />
              Login with GitHub
            </Button>
          )}
          {/* Si el usuario existe (está logueado) y existe avatar, mostrar datos */}
          {user === USER_STATES.NOT_KNOWN && <span>Loading...</span>}
        </div>
      </section>

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
