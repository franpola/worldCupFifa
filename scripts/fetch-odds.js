// scripts/fetch-odds.js
// Fetches World Cup 2026 odds from The Odds API
// Runs every 12h via GitHub Actions during the tournament

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ODDS_PATH = path.join(__dirname, '../src/data/odds.json');

const API_KEY = process.env.ODDS_API_KEY;
const SPORT = 'soccer_fifa_world_cup';
const REGIONS = 'eu';
const MARKETS = 'h2h'; // 1X2
const BOOKMAKERS = 'bet365,unibet,williamhill,betfair,marathonbet';

async function fetchOdds() {
  const url = `https://api.the-odds-api.com/v4/sports/${SPORT}/odds/?apiKey=${API_KEY}&regions=${REGIONS}&markets=${MARKETS}&bookmakers=${BOOKMAKERS}&oddsFormat=decimal`;
  
  console.log('📡 Fetching odds from The Odds API...');
  const res = await fetch(url);
  
  const remaining = res.headers.get('x-requests-remaining');
  const used = res.headers.get('x-requests-used');
  console.log(`📊 API usage: ${used} used, ${remaining} remaining`);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function parseOdds(data) {
  return data.map(event => {
    const bookmakers = event.bookmakers.map(bm => {
      const market = bm.markets.find(m => m.key === 'h2h');
      if (!market) return null;

      const home = market.outcomes.find(o => o.name === event.home_team)?.price;
      const away = market.outcomes.find(o => o.name === event.away_team)?.price;
      const draw = market.outcomes.find(o => o.name === 'Draw')?.price;

      return {
        name: bm.title,
        home: home || null,
        draw: draw || null,
        away: away || null,
      };
    }).filter(Boolean);

    // Best odds across all bookmakers
    const bestHome = Math.max(...bookmakers.map(b => b.home || 0));
    const bestDraw = Math.max(...bookmakers.map(b => b.draw || 0));
    const bestAway = Math.max(...bookmakers.map(b => b.away || 0));

    return {
      id: event.id,
      homeTeam: event.home_team,
      awayTeam: event.away_team,
      commenceTime: event.commence_time,
      bookmakers,
      best: {
        home: bestHome || null,
        draw: bestDraw || null,
        away: bestAway || null,
      }
    };
  });
}

async function main() {
  if (!API_KEY) {
    console.error('❌ ODDS_API_KEY not set');
    process.exit(1);
  }

  try {
    const raw = await fetchOdds();
    const odds = parseOdds(raw);
    
    const output = {
      lastUpdated: new Date().toISOString(),
      events: odds,
    };

    fs.writeFileSync(ODDS_PATH, JSON.stringify(output, null, 2));
    console.log(`✅ Saved odds for ${odds.length} matches`);
  } catch (err) {
    console.error('❌ Error fetching odds:', err.message);
    // Write empty file to avoid breaking the app
    if (!fs.existsSync(ODDS_PATH)) {
      fs.writeFileSync(ODDS_PATH, JSON.stringify({ lastUpdated: new Date().toISOString(), events: [] }, null, 2));
    }
    process.exit(1);
  }
}

main();
