import { useState } from 'react'
import fixturesData from '../data/fixtures.json'
import styles from './Fixtures.module.css'

const GROUPS = ['Todos', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

function MatchCard({ match }) {
  const played = match.scoreHome !== null && match.scoreAway !== null
  const today = new Date().toISOString().split('T')[0]
  const isToday = match.date === today

  return (
    <div className={`${styles.match} ${isToday ? styles.today : ''}`}>
      <div className={styles.matchMeta}>
        <span className={styles.groupBadge}>Grupo {match.group}</span>
        <span className={styles.date}>{formatDate(match.date)} · {match.time}h</span>
      </div>
      <div className={styles.teams}>
        <div className={styles.team}>
          <span className={styles.flag}>{match.homeflag}</span>
          <span className={styles.teamName}>{match.home}</span>
        </div>
        <div className={styles.score}>
          {played
            ? <span className={styles.result}>{match.scoreHome} – {match.scoreAway}</span>
            : <span className={styles.vs}>VS</span>
          }
        </div>
        <div className={`${styles.team} ${styles.teamRight}`}>
          <span className={styles.teamName}>{match.away}</span>
          <span className={styles.flag}>{match.awayflag}</span>
        </div>
      </div>
      <div className={styles.venue}>📍 {match.venue}</div>
    </div>
  )
}

export default function Fixtures() {
  const [activeGroup, setActiveGroup] = useState('Todos')

  const filtered = fixturesData.filter(m =>
    activeGroup === 'Todos' || m.group === activeGroup
  )

  // Group by date
  const byDate = filtered.reduce((acc, m) => {
    if (!acc[m.date]) acc[m.date] = []
    acc[m.date].push(m)
    return acc
  }, {})

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>CALENDARIO</h2>
        <p className={styles.sectionSub}>Fase de grupos · {fixturesData.length} partidos</p>
      </div>

      <div className={styles.filters}>
        {GROUPS.map(g => (
          <button
            key={g}
            className={`${styles.filterBtn} ${activeGroup === g ? styles.active : ''}`}
            onClick={() => setActiveGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {Object.entries(byDate).map(([date, matches]) => (
          <div key={date} className={styles.dateGroup}>
            <div className={styles.dateLabel}>{formatDate(date)}</div>
            <div className={styles.matchList}>
              {matches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
