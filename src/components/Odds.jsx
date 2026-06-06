import { useState } from 'react'
import oddsData from '../data/odds.json'
import fixturesData from '../data/fixtures.json'
import Flag from './Flag.jsx'
import styles from './Odds.module.css'

// Match odds to fixtures by team name (fuzzy)
function matchTeam(oddsName, fixtures) {
  const lower = oddsName.toLowerCase()
  return fixtures.find(f =>
    f.home.toLowerCase().includes(lower.split(' ')[0]) ||
    f.away.toLowerCase().includes(lower.split(' ')[0]) ||
    lower.includes(f.home.toLowerCase().split(' ')[0]) ||
    lower.includes(f.away.toLowerCase().split(' ')[0])
  )
}

function OddsValue({ value, isBest }) {
  if (!value) return <span className={styles.na}>—</span>
  return (
    <span className={`${styles.odd} ${isBest ? styles.best : ''}`}>
      {value.toFixed(2)}
    </span>
  )
}

function EventCard({ event }) {
  const [expanded, setExpanded] = useState(false)

  // Find matching fixture for flags
  const homeFixture = fixturesData.find(f =>
    event.homeTeam.toLowerCase().includes(f.home.toLowerCase().split(' ')[0]) ||
    f.home.toLowerCase().includes(event.homeTeam.toLowerCase().split(' ')[0])
  )
  const awayFixture = fixturesData.find(f =>
    event.awayTeam.toLowerCase().includes(f.away.toLowerCase().split(' ')[0]) ||
    f.away.toLowerCase().includes(event.awayTeam.toLowerCase().split(' ')[0])
  )

  const homecc = homeFixture?.homecc || awayFixture?.awaycc
  const awaycc = awayFixture?.awaycc || homeFixture?.homecc

  const date = new Date(event.commenceTime)
  const dateStr = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
  const timeStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' })

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader} onClick={() => setExpanded(!expanded)}>
        <div className={styles.matchInfo}>
          <span className={styles.dateTime}>{dateStr} · {timeStr}h</span>
          <div className={styles.teams}>
            <div className={styles.team}>
              {homecc && <Flag cc={homecc} size={20} />}
              <span>{event.homeTeam}</span>
            </div>
            <span className={styles.vs}>VS</span>
            <div className={styles.team}>
              {awaycc && <Flag cc={awaycc} size={20} />}
              <span>{event.awayTeam}</span>
            </div>
          </div>
        </div>

        {/* Best odds summary */}
        <div className={styles.bestOdds}>
          <div className={styles.oddCell}>
            <span className={styles.oddLabel}>1</span>
            <OddsValue value={event.best.home} isBest />
          </div>
          <div className={styles.oddCell}>
            <span className={styles.oddLabel}>X</span>
            <OddsValue value={event.best.draw} isBest />
          </div>
          <div className={styles.oddCell}>
            <span className={styles.oddLabel}>2</span>
            <OddsValue value={event.best.away} isBest />
          </div>
          <button className={`${styles.toggle} ${expanded ? styles.open : ''}`}>▾</button>
        </div>
      </div>

      {expanded && event.bookmakers.length > 0 && (
        <div className={styles.bookmakers}>
          <div className={styles.bmHeader}>
            <span>Casa de apuestas</span>
            <span>1</span>
            <span>X</span>
            <span>2</span>
          </div>
          {event.bookmakers.map(bm => (
            <div key={bm.name} className={styles.bmRow}>
              <span className={styles.bmName}>{bm.name}</span>
              <OddsValue value={bm.home} isBest={bm.home === event.best.home} />
              <OddsValue value={bm.draw} isBest={bm.draw === event.best.draw} />
              <OddsValue value={bm.away} isBest={bm.away === event.best.away} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Odds() {
  const { events, lastUpdated } = oddsData
  const date = new Date(lastUpdated)
  const updated = date.toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>CUOTAS</h2>
          <p className={styles.sectionSub}>Mejor cuota disponible · Actualizado {updated}</p>
        </div>
        <div className={styles.legend}>
          <span className={styles.bestSample}>2.45</span> = mejor cuota
        </div>
      </div>

      {events.length === 0 ? (
        <div className={styles.empty}>
          <p>Las cuotas estarán disponibles cuando se acerquen los partidos.</p>
          <p>Las casas de apuestas publican cuotas normalmente 1-2 días antes de cada partido.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
