import Avatar from "components/Avatar"
import useTimeAgo from "hooks/useTimeAgo"

export default function Devit({ avatar, userName, content, createdAt, id }) {
  const timeago = useTimeAgo(createdAt)
  return (
    <>
      <article>
        <div>
          <Avatar src={avatar} alt={userName} />
        </div>
        <section>
          <header>
            <strong>{userName}</strong>
            <span> · </span>
            <date>{timeago}</date>
          </header>
          <p>{content}</p>
        </section>
      </article>
      <style jsx>{`
        article {
          display: flex;
          padding: 10px 15px;
          border-bottom: 1px solid #eee;
        }
        div {
          margin-right: 10px;
        }
        p {
          margin: 0;
          line-height: 1.3125;
        }
        date {
          color: #888;
          font-size: 14px;
        }
      `}</style>
    </>
  )
}
