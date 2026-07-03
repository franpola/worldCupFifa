import bracketData from '../data/bracket.json'
import Flag from './Flag.jsx'
import styles from './Bracket.module.css'

function MatchSlot({ match }) {
  const played = match.scoreHome !== null && match.scoreAway !== null
  const hasTeams = match.home && match.away

  const homeWin = played && match.scoreHome > match.scoreAway
  const awayWin = played && match.scoreAway > match.scoreHome

  return (
    <div className={styles.slot}>
      <div className={styles.slotDate}>
        <span className={styles.slotDateText}>{match.date} · {match.time}h</span>
        <span className={styles.slotVenue}>{match.venue}</span>
      </div>
      <div className={`${styles.slotTeam} ${homeWin ? styles.winner : ''}`}>
        {hasTeams && match.homecc && <Flag cc={match.homecc} size={14} />}
        <span className={styles.slotLabel}>{hasTeams ? match.home : match.label}</span>
        {played && <span className={styles.slotScore}>{match.scoreHome}</span>}
      </div>
      <div className={`${styles.slotTeam} ${awayWin ? styles.winner : ''}`}>
        {hasTeams && match.awaycc && <Flag cc={match.awaycc} size={14} />}
        <span className={styles.slotLabel}>{hasTeams ? match.away : match.label2}</span>
        {played && <span className={styles.slotScore}>{match.scoreAway}</span>}
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
        <p className={styles.sectionSub}>Horarios en hora de Madrid (CEST)</p>
      </div>
      <div className={styles.bracket}>
        {bracketData.rounds.map(round => (
          <RoundColumn key={round.id} round={round} />
        ))}
      </div>
    </div>
  )
}
