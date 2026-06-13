import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GROUPS_PATH = path.join(__dirname, '../src/data/groups.json');
const FIXTURES_PATH = path.join(__dirname, '../src/data/fixtures.json');

const ESPN_BASE = 'https://site.api.espn.com/apis/v2/sports/soccer/fifa.world';
const ESPN_SCORES = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

// ── Standings ──────────────────────────────────────────────
async function updateStandings() {
  console.log('📡 Fetching standings...');
  const data = await fetchJSON(`${ESPN_BASE}/standings`).catch(e => {
    console.error('❌ Standings error:', e.message); return null;
  });
  if (!data?.children) { console.log('⚠️  No standings yet'); return; }

  const raw = fs.readFileSync(GROUPS_PATH, 'utf-8');
  const local = JSON.parse(raw);

  for (const group of data.children) {
    const letter = group.abbreviation?.replace('Group ', '').trim();
    if (!letter || !local.groups[letter]) continue;
    const localTeams = local.groups[letter].teams;
    const entries = group.standings?.entries || [];

    local.groups[letter].teams = entries.map(entry => {
      const team = entry.team;
      const stats = {};
      for (const s of entry.stats || []) stats[s.name] = s.value;

      const localTeam = localTeams.find(t =>
        t.id === team.abbreviation?.toLowerCase() ||
        t.name.toLowerCase().includes(team.displayName.toLowerCase().split(' ')[0].toLowerCase())
      );

      return {
        id: localTeam?.id || team.abbreviation?.toLowerCase() || team.id,
        name: localTeam?.name || team.displayName,
        cc: localTeam?.cc || '',
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

  local.lastUpdated = new Date().toISOString();
  fs.writeFileSync(GROUPS_PATH, JSON.stringify(local, null, 2));
  console.log('✅ Standings updated');
}

// ── Fixtures / Scores ──────────────────────────────────────
async function updateFixtures() {
  console.log('📡 Fetching scores...');

  // ESPN scoreboard only shows recent/live games, so we fetch multiple dates
  const fixtures = JSON.parse(fs.readFileSync(FIXTURES_PATH, 'utf-8'));

  // Get all unique dates from fixtures
  const dates = [...new Set(fixtures.map(f => f.date))];

  let updated = 0;

  for (const date of dates) {
    const dateStr = date.replace(/-/g, ''); // YYYYMMDD
    const data = await fetchJSON(`${ESPN_SCORES}?dates=${dateStr}`).catch(() => null);
    if (!data?.events) continue;

    for (const event of data.events) {
      const comp = event.competitions?.[0];
      if (!comp) continue;

      const status = comp.status?.type?.name;
      const isFinished = status === 'STATUS_FINAL' || status === 'STATUS_FULL_TIME';
      if (!isFinished) continue;

      const home = comp.competitors?.find(c => c.homeAway === 'home');
      const away = comp.competitors?.find(c => c.homeAway === 'away');
      if (!home || !away) continue;

      const homeName = home.team?.displayName?.toLowerCase();
      const awayName = away.team?.displayName?.toLowerCase();
      const homeScore = parseInt(home.score);
      const awayScore = parseInt(away.score);

      // Find matching fixture by date and team names
      const fixture = fixtures.find(f => {
        if (f.date !== date) return false;
        const fHome = f.home.toLowerCase();
        const fAway = f.away.toLowerCase();
        return (
          (homeName?.includes(fHome.split(' ')[0]) || fHome.includes(homeName?.split(' ')[0])) &&
          (awayName?.includes(fAway.split(' ')[0]) || fAway.includes(awayName?.split(' ')[0]))
        );
      });

      if (fixture && !isNaN(homeScore) && !isNaN(awayScore)) {
        fixture.scoreHome = homeScore;
        fixture.scoreAway = awayScore;
        updated++;
      }
    }
  }

  fs.writeFileSync(FIXTURES_PATH, JSON.stringify(fixtures, null, 2));
  console.log(`✅ Fixtures updated: ${updated} results saved`);
}

async function main() {
  await updateStandings();
  await updateFixtures();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
