import { useEffect, useState } from "react"
import Link from "next/link"
import Head from "next/head"

import AppLayout from "components/AppLayout"

import Devit from "components/Devit"
import useUser from "hooks/useUser"
import { fetchLatestDevits } from "firebase/client"

import Create from "components/Icons/Create"
import Home from "components/Icons/Home"
import Search from "components/Icons/Search"
import { colors } from "styles/theme"

export default function HomePage() {
  const [timeline, setTimeline] = useState([])
  const user = useUser() // Temporal

  useEffect(() => {
    user && fetchLatestDevits().then(setTimeline)
  }, [user])

  return (
    <>
      <AppLayout>
        <Head>
          <title>Inicio / Devter</title>
        </Head>
        <header>
          <h2>Inicio</h2>
        </header>
        <section>
          {timeline.map(
            ({ id, img, createdAt, userName, avatar, content, userId }) => {
              return (
                <Devit
                  avatar={avatar}
                  content={content}
                  createdAt={createdAt}
                  id={id}
                  img={img}
                  key={id}
                  userId={userId}
                  userName={userName}
                />
              )
            }
          )}
        </section>
        <nav>
          <Link href="/">
            <a>
              <Home width={32} height={32} stroke="#09f" />
            </a>
          </Link>
          <Link href="/compose/tweet">
            <a>
              <Search width={32} height={32} stroke="#09f" />
            </a>
          </Link>
          <Link href="/compose/tweet">
            <a>
              <Create width={32} height={32} stroke="#09f" />
            </a>
          </Link>
        </nav>
      </AppLayout>
      <style jsx>
        {`
          header {
            border-bottom: 1px solid #eee;
            background: #ffffffaa;
            backdrop-filter: blur(5px);
            position: sticky;
            display: flex;
            align-items: center;
            height: 49px;
            top: 0;
            width: 100%;
          }

          h2 {
            font-weight: 800;
            font-size: 21px;
            padding-left: 15px;
          }
          section {
            flex: 1;
          }
          nav {
            position: sticky;
            bottom: 0;
            border-top: 1px solid #eee;
            height: 49px;
            width: 100%;
            background: #fff;
            display: flex;
          }

          nav a {
            align-items: center;
            display: flex;
            flex: 1 1 auto;
            height: 100%;
            justify-content: center;
          }

          nav a:hover {
            background: radial-gradient(#0099ff22 15%, transparent 16%);
            background-size: 180px 180px;
            background-position: center;
          }

          nav a:hover > :global(svg) {
            stroke: ${colors.primary};
          }
        `}
      </style>
    </>
  )
}
