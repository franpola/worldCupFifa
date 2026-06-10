import { useState } from 'react'
import oddsData from '../data/odds.json'
import Flag from './Flag.jsx'
import styles from './Odds.module.css'

const TEAM_MAP = {
  'mexico': 'mx', 'south africa': 'za', 'south korea': 'kr', 'czechia': 'cz',
  'canada': 'ca', 'bosnia and herzegovina': 'ba', 'bosnia': 'ba', 'qatar': 'qa', 'switzerland': 'ch',
  'brazil': 'br', 'morocco': 'ma', 'haiti': 'ht', 'scotland': 'gb-sct',
  'united states': 'us', 'usa': 'us', 'paraguay': 'py', 'australia': 'au', 'turkey': 'tr',
  'germany': 'de', 'curacao': 'cw', 'ivory coast': 'ci', "cote d'ivoire": 'ci', 'ecuador': 'ec',
  'netherlands': 'nl', 'japan': 'jp', 'tunisia': 'tn', 'sweden': 'se',
  'belgium': 'be', 'egypt': 'eg', 'iran': 'ir', 'new zealand': 'nz',
  'spain': 'es', 'cape verde': 'cv', 'saudi arabia': 'sa', 'uruguay': 'uy',
  'france': 'fr', 'senegal': 'sn', 'norway': 'no', 'iraq': 'iq',
  'argentina': 'ar', 'algeria': 'dz', 'austria': 'at', 'jordan': 'jo',
  'portugal': 'pt', 'colombia': 'co', 'uzbekistan': 'uz',
  'dr congo': 'cd', 'democratic republic of congo': 'cd', 'congo dr': 'cd',
  'england': 'gb-eng', 'croatia': 'hr', 'ghana': 'gh', 'panama': 'pa',
  'czech republic': 'cz',
  'bosnia & herzegovina': 'ba',
  'curaçao': 'cw',
  'dr congo': 'cd',
  'ivory coast': 'ci',
  'turkey': 'tr',
}
const NAME_MAP = {
  'Mexico': 'México', 'South Africa': 'Sudáfrica', 'South Korea': 'Corea del Sur',
  'Czechia': 'Chequia', 'Canada': 'Canadá', 'Bosnia and Herzegovina': 'Bosnia',
  'Switzerland': 'Suiza', 'Brazil': 'Brasil', 'Morocco': 'Marruecos',
  'Haiti': 'Haití', 'Scotland': 'Escocia', 'United States': 'Estados Unidos',
  'USA': 'Estados Unidos', 'Paraguay': 'Paraguay', 'Australia': 'Australia',
  'Turkey': 'Turquía', 'Germany': 'Alemania', 'Curacao': 'Curazao',
  'Ivory Coast': 'Costa de Marfil', "Cote d'Ivoire": 'Costa de Marfil',
  'Ecuador': 'Ecuador', 'Netherlands': 'Países Bajos', 'Japan': 'Japón',
  'Tunisia': 'Túnez', 'Sweden': 'Suecia', 'Belgium': 'Bélgica',
  'Egypt': 'Egipto', 'Iran': 'Irán', 'New Zealand': 'Nueva Zelanda',
  'Spain': 'España', 'Cape Verde': 'Cabo Verde', 'Saudi Arabia': 'Arabia Saudí',
  'Uruguay': 'Uruguay', 'France': 'Francia', 'Senegal': 'Senegal',
  'Norway': 'Noruega', 'Iraq': 'Irak', 'Argentina': 'Argentina',
  'Algeria': 'Argelia', 'Austria': 'Austria', 'Jordan': 'Jordania',
  'Portugal': 'Portugal', 'Colombia': 'Colombia', 'Uzbekistan': 'Uzbekistán',
  'DR Congo': 'R.D. Congo', 'Democratic Republic of Congo': 'R.D. Congo',
  'England': 'Inglaterra', 'Croatia': 'Croacia', 'Ghana': 'Ghana', 'Panama': 'Panamá',
  'Czech Republic': 'Chequia',
  'Bosnia & Herzegovina': 'Bosnia',
  'Curaçao': 'Curazao',
  'DR Congo': 'R.D. Congo',
  'Ivory Coast': 'Costa de Marfil',
  'Turkey': 'Turquía',
  'South Korea': 'Corea del Sur',
  'South Africa': 'Sudáfrica',
  'Netherlands': 'Países Bajos',
  'USA': 'Estados Unidos',
  'Switzerland': 'Suiza',
}

function translate(name) {
  return NAME_MAP[name] || name
}
function getCC(teamName) {
  return TEAM_MAP[teamName.toLowerCase()] || ''
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

  const homecc = getCC(event.homeTeam)
  const awaycc = getCC(event.awayTeam)

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
              <span>{translate(event.homeTeam)}</span>
            </div>
            <span className={styles.vs}>VS</span>
            <div className={styles.team}>
              {awaycc && <Flag cc={awaycc} size={20} />}
              <span>{translate(event.awayTeam)}</span>
            </div>
          </div>
        </div>

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
