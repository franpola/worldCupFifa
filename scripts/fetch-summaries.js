// scripts/fetch-summaries.js
// Searches FIFA's YouTube channel for match summaries and saves URLs to fixtures.json

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_PATH = path.join(__dirname, '../src/data/fixtures.json');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const FIFA_CHANNEL_ID = 'UCpcTrCXblq78GZrTUTLWeBw'; // FIFA official YouTube channel

async function searchSummary(home, away) {
  const query = `${home} vs ${away} FIFA World Cup 2026 highlights`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${FIFA_CHANNEL_ID}&q=${encodeURIComponent(query)}&type=video&order=date&maxResults=1&key=${YOUTUBE_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
  const data = await res.json();

  const item = data.items?.[0];
  if (!item) return null;

  return `https://www.youtube.com/watch?v=${item.id.videoId}`;
}

async function main() {
  if (!YOUTUBE_API_KEY) {
    console.error('❌ YOUTUBE_API_KEY not set');
    process.exit(1);
  }

  const fixtures = JSON.parse(fs.readFileSync(FIXTURES_PATH, 'utf-8'));
  let updated = 0;

  for (const fixture of fixtures) {
    // Only search for finished matches without a summary yet
    if (fixture.scoreHome === null || fixture.summaryUrl) continue;

    try {
      console.log(`🔍 Searching: ${fixture.home} vs ${fixture.away}...`);
      const url = await searchSummary(fixture.home, fixture.away);

      if (url) {
        fixture.summaryUrl = url;
        console.log(`  ✅ Found: ${url}`);
        updated++;
      } else {
        console.log(`  ⚠️  No video found yet`);
      }

      // Small delay to avoid hitting rate limits
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }
  }

  fs.writeFileSync(FIXTURES_PATH, JSON.stringify(fixtures, null, 2));
  console.log(`✅ Summaries updated: ${updated} links saved`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
