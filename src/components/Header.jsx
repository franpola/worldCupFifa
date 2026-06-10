import styles from './Header.module.css'

const HOSTS = [
  { cc: 'us', name: 'USA' },
  { cc: 'mx', name: 'México' },
  { cc: 'ca', name: 'Canadá' },
]

export default function Header({ lastUpdated }) {
  const date = new Date(lastUpdated)
  const formatted = date.toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <header className={styles.header}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.badgeWrap}>
            <div className={styles.badge}>
              <span className={styles.badgeYear}>2026</span>
              <span className={styles.badgeFifa}>FIFA</span>
            </div>
          </div>
          <div className={styles.titles}>
            <h1 className={styles.title}>
              <span className={styles.world}>WORLD</span>
              <span className={styles.cup}>CUP</span>
            </h1>
            <div className={styles.hosts}>
              {HOSTS.map(h => (
                <span key={h.cc} className={styles.host}>
                  <img
                    src={`https://flagicons.lipis.dev/flags/4x3/${h.cc}.svg`}
                    width={18} height={13}
                    alt={h.name}
                    style={{ borderRadius: 2 }}
                  />
                  {h.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>48</span>
              <span className={styles.statLabel}>Equipos</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>12</span>
              <span className={styles.statLabel}>Grupos</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>104</span>
              <span className={styles.statLabel}>Partidos</span>
            </div>
          </div>
          <div className={styles.updated}>
            <span className={styles.dot} />
            Act. {formatted}
          </div>
        </div>
      </div>
    </header>
  )
}
