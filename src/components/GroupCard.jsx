import { useState } from 'react'
import Flag from './Flag.jsx'
import fixturesData from '../data/fixtures.json'
import styles from './GroupCard.module.css'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

function TeamRow({ team, rank, selected, onSelect }) {
  const gd = team.gf - team.ga
  const qualified = rank <= 2
  const thirdPlace = rank === 3

  return (
    <tr
      className={`${styles.row} ${qualified ? styles.qualified : ''} ${thirdPlace ? styles.third : ''} ${selected ? styles.selectedRow : ''}`}
      onClick={() => onSelect(selected ? null : team.name)}
      style={{ cursor: 'pointer' }}
    >
      <td className={styles.rank}>
        <span className={`${styles.rankBadge} ${qualified ? styles.qualifiedBadge : ''}`}>{rank}</span>
      </td>
      <td className={styles.teamCell}>
        <Flag cc={team.cc} size={20} />
        <span className={styles.teamName}>{team.name}</span>
      </td>
      <td className={styles.stat}>{team.played}</td>
      <td className={styles.stat}>{team.won}</td>
      <td className={styles.stat}>{team.drawn}</td>
      <td className={styles.stat}>{team.lost}</td>
      <td className={styles.stat}>{team.gf}:{team.ga}</td>
      <td className={styles.stat}>
        <span className={`${styles.gd} ${gd > 0 ? styles.gdPos : gd < 0 ? styles.gdNeg : ''}`}>
          {gd > 0 ? '+' : ''}{gd}
        </span>
      </td>
      <td className={styles.pts}>{team.pts}</td>
    </tr>
  )
}

function MatchRow({ match, highlight }) {
  const played = match.scoreHome !== null && match.scoreAway !== null
  return (
    <div className={`${styles.matchRow} ${highlight ? styles.matchHighlight : ''}`}>
      <div className={styles.matchDate}>{formatDate(match.date)} · {match.time}h</div>
      <div className={styles.matchTeams}>
        <div className={styles.matchTeam}>
          <Flag cc={match.homecc} size={16} />
          <span className={played && match.scoreHome > match.scoreAway ? styles.matchWinner : ''}>{match.home}</span>
        </div>
        <div className={styles.matchScore}>
          {played
            ? <span className={styles.matchResult}>{match.scoreHome} – {match.scoreAway}</span>
            : <span className={styles.matchVs}>VS</span>
          }
        </div>
        <div className={`${styles.matchTeam} ${styles.matchTeamRight}`}>
          <span className={played && match.scoreAway > match.scoreHome ? styles.matchWinner : ''}>{match.away}</span>
          <Flag cc={match.awaycc} size={16} />
        </div>
      </div>
      {played && match.summaryUrl && (
        <a href={match.summaryUrl} target="_blank" rel="noopener noreferrer" className={styles.summaryBtn}>
          ▶ Resumen
        </a>
      )}
    </div>
  )
}

export default function GroupCard({ letter, group, style }) {
  const [selectedTeam, setSelectedTeam] = useState(null)

  const sorted = [...group.teams].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    const gdA = a.gf - a.ga, gdB = b.gf - b.ga
    if (gdB !== gdA) return gdB - gdA
    return b.gf - a.gf
  })

  const matches = fixturesData.filter(f => f.group === letter)

  return (
    <div className={styles.card} style={style}>
      <div className={styles.cardHeader}>
        <span className={styles.groupLabel}>GRUPO</span>
        <span className={styles.groupLetter}>{letter}</span>
        {selectedTeam && (
          <span className={styles.filterTag}>
            {selectedTeam}
            <button className={styles.clearFilter} onClick={() => setSelectedTeam(null)}>✕</button>
          </span>
        )}
      </div>

      <table className={styles.table}>
        <thead>
          <tr className={styles.thead}>
            <th>#</th>
            <th className={styles.teamHead}>Equipo</th>
            <th title="Partidos jugados">PJ</th>
            <th title="Victorias">G</th>
            <th title="Empates">E</th>
            <th title="Derrotas">P</th>
            <th title="Goles">GL</th>
            <th title="Diferencia">DG</th>
            <th title="Puntos">Pts</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((team, i) => (
            <TeamRow
              key={team.id}
              team={team}
              rank={i + 1}
              selected={selectedTeam === team.name}
              onSelect={setSelectedTeam}
            />
          ))}
        </tbody>
      </table>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: 'var(--accent)' }} /> Clasificado
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: 'var(--draw)' }} /> Posible 3º
        </span>
      </div>

      <div className={styles.matchesSection}>
        <div className={styles.matchesSectionTitle}>
          {selectedTeam ? `PARTIDOS DE ${selectedTeam.toUpperCase()}` : 'PARTIDOS'}
        </div>
        {matches
          .filter(m => !selectedTeam || m.home === selectedTeam || m.away === selectedTeam)
          .map(m => (
            <MatchRow
              key={m.id}
              match={m}
              highlight={selectedTeam && (m.home === selectedTeam || m.away === selectedTeam)}
            />
          ))}
      </div>
    </div>
  )
}
