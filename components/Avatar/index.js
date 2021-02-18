import styles from "./styles.module.css"

export default function Avatar({ alt, src, text }) {
  return (
    <div className={styles.container}>
      <img className={styles.avatar} src={alt} src={src} title={alt} />
      {text && <strong>{text || alt}</strong>}
    </div>
  )
}
