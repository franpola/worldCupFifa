import Flag from './Flag.jsx'
import styles from './GroupCard.module.css'

function TeamRow({ team, rank }) {
  const gd = team.gf - team.ga
  const qualified = rank <= 2
  const thirdPlace = rank === 3

  return (
    <tr className={`${styles.row} ${qualified ? styles.qualified : ''} ${thirdPlace ? styles.third : ''}`}>
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

export default function GroupCard({ letter, group, style }) {
  const sorted = [...group.teams].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    const gdA = a.gf - a.ga, gdB = b.gf - b.ga
    if (gdB !== gdA) return gdB - gdA
    return b.gf - a.gf
  })

  return (
    <div className={styles.card} style={style}>
      <div className={styles.cardHeader}>
        <span className={styles.groupLabel}>GRUPO</span>
        <span className={styles.groupLetter}>{letter}</span>
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
          {sorted.map((team, i) => <TeamRow key={team.id} team={team} rank={i + 1} />)}
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
    </div>
  )
}
