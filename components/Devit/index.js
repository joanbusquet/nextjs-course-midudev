import Avatar from "components/Avatar"
import useTimeAgo from "hooks/useTimeAgo"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Devit({
  avatar,
  userName,
  content,
  createdAt,
  img,
  id,
}) {
  const timeago = useTimeAgo(createdAt)
  const router = useRouter()

  // Al hacer click al tweet en cuestión
  const handleArticleClick = (e) => {
    e.preventDefault()
    // Usamos router de next para redireccionar hacia la página
    router.push(`/status/${id}`)
  }
  return (
    <>
      <article onClick={handleArticleClick}>
        <div>
          <Avatar src={avatar} alt={userName} />
        </div>
        <section>
          <header>
            <strong>{userName}</strong>
            <span> · </span>
            <Link href={`/status/${id}`}>
              <a>
                <time>{timeago}</time>
              </a>
            </Link>
          </header>
          <p>{content}</p>
          {img && <img src={img} />}
        </section>
      </article>
      <style jsx>{`
        article {
          display: flex;
          padding: 10px 15px;
          border-bottom: 1px solid #eee;
        }
        article:hover {
          background: #f5f8fa;
          cursor: pointer;
        }
        div {
          margin-right: 10px;
        }
        p {
          margin: 0;
          line-height: 1.3125;
        }
        time {
          color: #888;
          font-size: 14px;
        }
        img {
          width: 100%;
          height: auto;
          border-radius: 10px;
          margin-top: 10px;
        }
        a {
          color: #555;
          font-size: 14px;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}
