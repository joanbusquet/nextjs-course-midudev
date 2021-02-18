import Avatar from "components/Avatar"

export default function Devit({ avatar, username, message, id }) {
  return (
    <>
      <article>
        <div>
          <Avatar src={avatar} alt={username} />
        </div>
        <section>
          <strong>{username}</strong>
          <p>{message}</p>
        </section>
      </article>
      <style jsx>{`
        article {
          display: flex;
          padding: 10px 15px;
          border-bottom: 2px solid #eaf7ff;
        }
        div {
          margin-right: 10px;
        }
        p {
          margin: 0;
          line-height: 1.3125;
        }
      `}</style>
    </>
  )
}
