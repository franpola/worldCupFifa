// scripts/fetch-results.js
// Fetches World Cup 2026 results from ESPN's unofficial API
// Runs daily via GitHub Actions

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../src/data/groups.json');

const ESPN_BASE = 'https://site.api.espn.com/apis/v2/sports/soccer/fifa.world';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchStandings() {
  try {
    console.log('📡 Fetching standings from ESPN...');
    const data = await fetchJSON(`${ESPN_BASE}/standings`);
    return data;
  } catch (err) {
    console.error('❌ Error fetching standings:', err.message);
    return null;
  }
}

async function fetchScoreboard() {
  try {
    console.log('📡 Fetching scoreboard from ESPN...');
    const data = await fetchJSON(`${ESPN_BASE}/scoreboard`);
    return data;
  } catch (err) {
    console.error('❌ Error fetching scoreboard:', err.message);
    return null;
  }
}

function parseStandings(espnData, localGroups) {
  if (!espnData?.children) {
    console.log('⚠️  No standings data available yet, keeping local data');
    return localGroups;
  }

  const updated = { ...localGroups };

  for (const group of espnData.children) {
    const groupLetter = group.abbreviation?.replace('Group ', '').trim();
    if (!groupLetter || !updated.groups[groupLetter]) continue;

    const standings = group.standings?.entries || [];

    updated.groups[groupLetter].teams = standings.map(entry => {
      const team = entry.team;
      const stats = {};
      for (const stat of entry.stats || []) {
        stats[stat.name] = stat.value;
      }

      return {
        id: team.abbreviation?.toLowerCase() || team.id,
        name: team.displayName,
        flag: updated.groups[groupLetter].teams.find(t => t.id === team.abbreviation?.toLowerCase())?.flag || '🏳️',
        played: stats.gamesPlayed || 0,
        won: stats.wins || 0,
        drawn: stats.ties || 0,
        lost: stats.losses || 0,
        gf: stats.pointsFor || 0,
        ga: stats.pointsAgainst || 0,
        pts: stats.points || 0,
      };
    });
  }

  return updated;
}

async function main() {
  // Load current local data
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const localData = JSON.parse(raw);

  // Fetch from ESPN
  const standingsData = await fetchStandings();

  // Merge
  const updatedGroups = parseStandings(standingsData, localData);
  updatedGroups.lastUpdated = new Date().toISOString();

  // Write back
  fs.writeFileSync(DATA_PATH, JSON.stringify(updatedGroups, null, 2));
  console.log(`✅ Data updated at ${updatedGroups.lastUpdated}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
