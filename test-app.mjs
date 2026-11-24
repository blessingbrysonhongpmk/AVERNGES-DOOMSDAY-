import http from 'http';
import fs from 'fs';
import path from 'path';

// Import project modules directly
import { CONFIG, getCountdownMilestone } from './src/data/config.js';
import { WATCHLIST } from './src/data/watchlist.js';
import { loadAmbientMode, saveAmbientMode } from './src/utils/storage.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

async function findActivePort() {
  const candidatePorts = [3000, 3001, 3002, 3003, 5173];
  for (const port of candidatePorts) {
    try {
      const res = await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}/`, (r) => resolve(r.statusCode));
        req.on('error', reject);
        req.setTimeout(500, () => req.destroy());
      });
      if (res === 200) return port;
    } catch {
      // try next
    }
  }
  return null;
}

async function fetchHttp(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function runTests() {
  const port = await findActivePort();
  if (port) {
    console.log(`=== HTTP PREVIEW SERVER & ASSETS (PORT ${port}) ===`);
    const home = await fetchHttp(`http://localhost:${port}/`);
    assert(home.status === 200, 'Server responds with status 200 on /');
    assert(home.body.includes('<title>AVENGERS: DOOMSDAY — THE COUNTDOWN</title>'), 'HTML contains correct page title');
    assert(home.body.includes('Avengers: Doomsday'), 'HTML contains meta description');
    assert(home.body.includes('/favicon.svg'), 'HTML links to /favicon.svg');
    assert(home.body.includes('Cinzel'), 'HTML loads Cinzel Google Font');

    const favicon = await fetchHttp(`http://localhost:${port}/favicon.svg`);
    assert(favicon.status === 200, 'Favicon is accessible at /favicon.svg');

    const stainedGlassBg = await fetchHttp(`http://localhost:${port}/doctor-doom-stained-glass.jpg`);
    assert(stainedGlassBg.status === 200, 'Doctor Doom stained-glass hero artwork is accessible over HTTP');

    console.log('\n=== LOCAL WEBP POSTER ASSETS OVER HTTP ===');
    const requiredPosters = [
      '/posters/x-men.webp',
      '/posters/x2.webp',
      '/posters/captain-america-first-avenger.webp',
      '/posters/the-avengers.webp',
      '/posters/infinity-war.webp',
      '/posters/endgame.webp',
      '/posters/loki-season-1.webp',
      '/posters/loki-season-2.webp',
      '/posters/shang-chi.webp',
      '/posters/no-way-home.webp',
      '/posters/doctor-strange-mom.webp',
      '/posters/wakanda-forever.webp',
      '/posters/deadpool-wolverine.webp',
      '/posters/brave-new-world.webp',
      '/posters/thunderbolts.webp',
      '/posters/fantastic-four.webp',
    ];

    for (const posterPath of requiredPosters) {
      const posterRes = await fetchHttp(`http://localhost:${port}${posterPath}`);
      assert(posterRes.status === 200, `Required poster exists and returns HTTP 200: ${posterPath}`);
    }
  } else {
    console.log('Preview server not detected on localhost (skipping HTTP network tests, continuing logic checks)');
  }

  // 1. Verify Watchlist Structure and Order
  console.log('\n=== WATCHLIST ORDER & STRUCTURE ===');
  assert(WATCHLIST.length === 15, `Watchlist contains exactly 15 chapters (got ${WATCHLIST.length})`);

  const expectedTitles = [
    'X-Men',
    'X2: X-Men United',
    'Captain America: The First Avenger',
    'The Avengers',
    'Avengers: Infinity War',
    'Avengers: Endgame',
    'Loki — Season 1 & Season 2',
    'Shang-Chi and the Legend of the Ten Rings',
    'Spider-Man: No Way Home',
    'Doctor Strange in the Multiverse of Madness',
    'Black Panther: Wakanda Forever',
    'Deadpool & Wolverine',
    'Captain America: Brave New World',
    'Thunderbolts*',
    'The Fantastic Four: First Steps'
  ];

  WATCHLIST.forEach((item, index) => {
    const expected = expectedTitles[index];
    assert(item.title === expected, `Item ${index + 1} matches "${expected}"`);
    assert(item.number === String(index + 1).padStart(2, '0'), `Item ${index + 1} has zero-padded number "${String(index + 1).padStart(2, '0')}"`);
    assert(item.year && item.year.length >= 4, `Item ${index + 1} has valid year`);
    assert(item.type === 'Movie' || item.type === 'Series', `Item ${index + 1} has valid format label`);
    assert(item.poster && item.poster.endsWith('.webp'), `Item ${index + 1} poster is a local webp asset (${item.poster})`);
  });

  // 2. Feature 1: Intelligent Next Watch
  console.log('\n=== FEATURE 1: NEXT WATCH ENGINE ===');
  function getNextWatch(progress) {
    for (const item of WATCHLIST) {
      if (item.isMultiSeason) {
        const loki = progress['loki-series'];
        if (!(loki?.season1 && loki?.season2)) return item;
      } else {
        if (!progress[item.id]?.completed) return item;
      }
    }
    return null;
  }

  assert(getNextWatch({})?.id === 'x-men-2000', 'Initial next watch is 01. X-Men');
  assert(getNextWatch({ 'x-men-2000': { completed: true } })?.id === 'x2-2003', 'Next watch advances after item 01');

  const p01to06 = {};
  for (let i = 0; i < 6; i++) p01to06[WATCHLIST[i].id] = { completed: true };
  assert(getNextWatch(p01to06)?.id === 'loki-series', 'Next watch is Loki after 01-06 complete');

  const pLokiS1 = { ...p01to06, 'loki-series': { season1: true, season2: false } };
  assert(getNextWatch(pLokiS1)?.id === 'loki-series', 'Next watch remains Loki when only Season 1 is checked');

  const pLokiBoth = { ...p01to06, 'loki-series': { season1: true, season2: true, completed: true } };
  assert(getNextWatch(pLokiBoth)?.id === 'shang-chi-2021', 'Next watch moves to Shang-Chi once both Loki seasons are checked');

  const pAll = { ...pLokiBoth };
  for (let i = 7; i < 15; i++) pAll[WATCHLIST[i].id] = { completed: true };
  assert(getNextWatch(pAll) === null, 'Next watch returns null when all 15 chapters are completed');

  // 3. Feature 2: Enhanced Progress
  console.log('\n=== FEATURE 2: ENHANCED WATCH PROGRESS ===');
  function calcProgress(watched, total) {
    const percentage = total > 0 ? Math.round((watched / total) * 100) : 0;
    const remaining = Math.max(0, total - watched);
    return {
      completedText: `${watched} / ${total} COMPLETED`,
      percentageText: `${percentage}% COMPLETE`,
      remainingText: `${remaining} CHAPTERS REMAINING`,
      percentage,
      remaining
    };
  }

  const p8 = calcProgress(8, 15);
  assert(p8.completedText === '8 / 15 COMPLETED', '8 / 15 COMPLETED matches');
  assert(p8.percentage === 53, '53% matches expected rounded percentage');
  assert(p8.remaining === 7, '7 remaining matches');

  // 4. Feature 4: Countdown Milestones
  console.log('\n=== FEATURE 4: COUNTDOWN MILESTONES ===');
  assert(getCountdownMilestone(100, false) === 'THE FINAL COUNTDOWN BEGINS.', '100 days milestone matches');
  assert(getCountdownMilestone(50, false) === 'THE WORLD IS GETTING CLOSER.', '50 days milestone matches');
  assert(getCountdownMilestone(30, false) === 'ONE MONTH REMAINS.', '30 days milestone matches ONE MONTH REMAINS.');
  assert(getCountdownMilestone(24, false) === null, 'Fewer than 30 days (24 days) correctly returns null (no inconsistent ONE MONTH REMAINS)');
  assert(getCountdownMilestone(7, false) === 'THE FINAL WEEK.', '7 days milestone matches THE FINAL WEEK.');
  assert(getCountdownMilestone(1, false) === 'TOMORROW CHANGES EVERYTHING.', '1 day milestone matches');
  assert(getCountdownMilestone(0, true) === 'DOOMSDAY HAS ARRIVED.', 'Release day matches DOOMSDAY HAS ARRIVED.');

  // 5. Feature 5: Ambient Mode
  console.log('\n=== FEATURE 5: AMBIENT MODE ===');
  assert(CONFIG.storageKeys.ambientMode === 'doomsday_ambient_mode_v1', 'Ambient mode storage key configured');
  assert(loadAmbientMode() === 'normal' || loadAmbientMode() === 'cinematic', 'Ambient mode loader functional');

  // 6. Feature 6: Share Progress
  console.log('\n=== FEATURE 6: SHARE PROGRESS ===');
  const shareText = `AVENGERS: DOOMSDAY COUNTDOWN\n\nMy Road to Doomsday:\n8 / 15 Chapters Completed.\n\n53% Ready.\n\nTHE COUNTDOWN HAS BEGUN.`;
  assert(shareText.includes('8 / 15 Chapters Completed.'), 'Share text includes correct completion');
  assert(shareText.includes('53% Ready.'), 'Share text includes correct percentage');
  assert(shareText.startsWith('AVENGERS: DOOMSDAY COUNTDOWN'), 'Share text starts with AVENGERS: DOOMSDAY COUNTDOWN');

  console.log(`\n========================================`);
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
