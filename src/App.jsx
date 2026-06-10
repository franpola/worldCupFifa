import { useState } from 'react'
import groupsData from './data/groups.json'
import GroupCard from './components/GroupCard.jsx'
import Header from './components/Header.jsx'
import Fixtures from './components/Fixtures.jsx'
import Bracket from './components/Bracket.jsx'
import Odds from './components/Odds.jsx'
import styles from './App.module.css'

const TABS = [
  { id: 'groups',   label: 'Grupos' },
  { id: 'fixtures', label: 'Calendario' },
  { id: 'bracket',  label: 'Eliminatorias' },
  { id: 'odds',     label: 'Cuotas' },
]

export default function App() {
  const [tab, setTab] = useState('groups')
  const [activeGroup, setActiveGroup] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const groups = Object.entries(groupsData.groups)

  function selectTab(id) {
    setTab(id)
    setMenuOpen(false)
  }

  const currentLabel = TABS.find(t => t.id === tab)?.label

  return (
    <div className={styles.app}>
      <Header lastUpdated={groupsData.lastUpdated} />

      {/* Desktop tabs */}
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.activeTab : ''}`}
            onClick={() => selectTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Mobile hamburger */}
      <div className={styles.mobileNav}>
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <span className={styles.currentTab}>{currentLabel}</span>
          <span className={`${styles.hamburgerIcon} ${menuOpen ? styles.open : ''}`}>
            <span /><span /><span />
          </span>
        </button>
        {menuOpen && (
          <div className={styles.mobileMenu}>
            {TABS.map(t => (
              <button
                key={t.id}
                className={`${styles.mobileMenuItem} ${tab === t.id ? styles.mobileMenuActive : ''}`}
                onClick={() => selectTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab === 'groups' && (
        <>
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
        </>
      )}

      {tab === 'fixtures' && <Fixtures />}
      {tab === 'bracket' && <Bracket />}
      {tab === 'odds' && <Odds />}

      <footer className={styles.footer}>
        <span>FIFA World Cup 2026 · USA · México · Canadá</span>
      </footer>
    </div>
  )
}
