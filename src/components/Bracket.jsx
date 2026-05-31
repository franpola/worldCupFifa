import bracketData from '../data/bracket.json'
import styles from './Bracket.module.css'

function MatchSlot({ match }) {
  const played = match.scoreHome !== null && match.scoreAway !== null
  const hasTeams = match.home && match.away

  return (
    <div className={styles.slot}>
      <div className={styles.slotInner}>
        <div className={`${styles.teamSlot} ${!hasTeams ? styles.tbd : ''}`}>
          <span className={styles.slotFlag}>{match.homeFlag || ''}</span>
          <span className={styles.slotName}>{match.home || match.label?.split(' vs ')[0] || 'Por definir'}</span>
          {played && <span className={styles.slotScore}>{match.scoreHome}</span>}
        </div>
        <div className={`${styles.teamSlot} ${!hasTeams ? styles.tbd : ''}`}>
          <span className={styles.slotFlag}>{match.awayFlag || ''}</span>
          <span className={styles.slotName}>{match.away || match.label?.split(' vs ')[1] || 'Por definir'}</span>
          {played && <span className={styles.slotScore}>{match.scoreAway}</span>}
        </div>
      </div>
      <div className={styles.slotDate}>
        {new Date(match.date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
      </div>
    </div>
  )
}

function RoundColumn({ round }) {
  return (
    <div className={styles.round}>
      <div className={styles.roundTitle}>{round.name}</div>
      <div className={styles.matches}>
        {round.matches.map(m => (
          <MatchSlot key={m.id} match={m} />
        ))}
      </div>
    </div>
  )
}

export default function Bracket() {
  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>CUADRO DE ELIMINATORIAS</h2>
        <p className={styles.sectionSub}>Se actualiza cuando avancen los equipos</p>
      </div>

      <div className={styles.bracket}>
        {bracketData.rounds.map(round => (
          <RoundColumn key={round.id} round={round} />
        ))}
      </div>

      <div className={styles.note}>
        ⚽ Los cruces se irán completando a medida que finalice la fase de grupos
      </div>
    </div>
  )
}
