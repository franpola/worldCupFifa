import styles from './Header.module.css'

export default function Header({ lastUpdated }) {
  const date = new Date(lastUpdated)
  const formatted = date.toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.trophy}>⚽</div>
          <div>
            <h1 className={styles.title}>WORLD CUP 2026</h1>
            <p className={styles.sub}>Fase de Grupos · 48 Equipos · 12 Grupos</p>
          </div>
        </div>
        <div className={styles.updated}>
          <span className={styles.dot} />
          Actualizado {formatted}
        </div>
      </div>
    </header>
  )
}
