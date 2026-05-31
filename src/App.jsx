import { useState } from 'react'
import groupsData from './data/groups.json'
import GroupCard from './components/GroupCard.jsx'
import Header from './components/Header.jsx'
import styles from './App.module.css'

export default function App() {
  const [activeGroup, setActiveGroup] = useState(null)
  const groups = Object.entries(groupsData.groups)

  return (
    <div className={styles.app}>
      <Header lastUpdated={groupsData.lastUpdated} />

      <nav className={styles.nav}>
        <button
          className={`${styles.navBtn} ${activeGroup === null ? styles.active : ''}`}
          onClick={() => setActiveGroup(null)}
        >
          Todos
        </button>
        {groups.map(([letter]) => (
          <button
            key={letter}
            className={`${styles.navBtn} ${activeGroup === letter ? styles.active : ''}`}
            onClick={() => setActiveGroup(letter === activeGroup ? null : letter)}
          >
            {letter}
          </button>
        ))}
      </nav>

      <main className={styles.grid}>
        {groups
          .filter(([letter]) => activeGroup === null || letter === activeGroup)
          .map(([letter, group], i) => (
            <GroupCard
              key={letter}
              letter={letter}
              group={group}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
      </main>

      <footer className={styles.footer}>
        <span>FIFA World Cup 2026 · USA · México · Canadá</span>
      </footer>
    </div>
  )
}
