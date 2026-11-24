import http from 'http';
import fs from 'fs';
import { CHARACTERS_DATA } from './src/data/characters.js';
import { TRAILERS_DATA } from './src/data/trailers.js';

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

async function fetchHttp(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('=== VERIFYING CHARACTER DATABASE & MULTIVERSE CAST ===');
  assert(CHARACTERS_DATA.length === 51, `Contains all 51 confirmed Multiverse characters (got ${CHARACTERS_DATA.length})`);
  const names = CHARACTERS_DATA.map(c => c.name);
  assert(names.includes('Doctor Doom'), 'Includes Doctor Doom');
  assert(names.includes('Mister Fantastic'), 'Includes Mister Fantastic');
  assert(names.includes('Invisible Woman'), 'Includes Invisible Woman');
  assert(names.includes('Human Torch'), 'Includes Human Torch');
  assert(names.includes('The Thing'), 'Includes The Thing');
  assert(names.includes('Iron Man'), 'Includes Iron Man');
  assert(names.includes('Captain America'), 'Includes Captain America');
  assert(names.includes('Thor Odinson'), 'Includes Thor Odinson');
  assert(names.includes('Smart Hulk'), 'Includes Smart Hulk');
  assert(names.includes('Black Widow'), 'Includes Black Widow');
  assert(names.includes('Hawkeye'), 'Includes Hawkeye');
  assert(names.includes('Doctor Strange'), 'Includes Doctor Strange');
  assert(names.includes('Spider-Man'), 'Includes Spider-Man');
  assert(names.includes('Scarlet Witch'), 'Includes Scarlet Witch');
  assert(names.includes('Wolverine'), 'Includes Wolverine');
  assert(names.includes('Deadpool'), 'Includes Deadpool');
  assert(names.includes('Star-Lord'), 'Includes Star-Lord');
  assert(names.includes('Rocket Raccoon'), 'Includes Rocket Raccoon');
  assert(names.includes('Daredevil'), 'Includes Daredevil');
  assert(names.includes('The Punisher'), 'Includes The Punisher');
  assert(names.includes('Moon Knight'), 'Includes Moon Knight');
  assert(names.includes('The Sentry'), 'Includes The Sentry');
  assert(names.includes('Galactus'), 'Includes Galactus');
  assert(names.includes('Thanos'), 'Includes Thanos');

  CHARACTERS_DATA.forEach(c => {
    assert(c.capabilities && c.capabilities.length >= 3, `${c.name} has documented capabilities`);
    assert(c.confirmedSources, `${c.name} has verified official source attribution`);
    assert(fs.existsSync('public' + c.poster), `Poster exists on disk: ${c.poster}`);
  });

  console.log('\n=== VERIFYING TRAILER ARCHIVE (THOR & CAPTAIN SHIELD INCLUDED) ===');
  assert(TRAILERS_DATA.length >= 6, `Contains expanded video footage (got ${TRAILERS_DATA.length})`);
  assert(TRAILERS_DATA.some(t => t.title.includes('Thor')), 'Includes Thor video footage');
  assert(TRAILERS_DATA.some(t => t.title.includes('Shield')), 'Includes Captain America Shield video footage');
  TRAILERS_DATA.forEach(t => {
    assert(t.youtubeId && t.youtubeId.length > 5, `${t.title} has valid YouTube embed ID`);
    assert(t.verifiedBadge === 'OFFICIAL MARVEL STUDIOS', `${t.title} has official verification badge`);
  });

  console.log('\n=== VERIFYING HTTP RESPONSE ON PORT 3000 ===');
  const home = await fetchHttp('http://localhost:3000/');
  assert(home.status === 200, 'HTTP 200 returned on /');
  assert(home.body.includes('AVENGERS: DOOMSDAY'), 'HTML includes brand title');
  assert(home.body.includes('root'), 'HTML includes root container');

  console.log(`\n========================================`);
  console.log(`NEW FEATURES TESTS PASSED: ${passed}`);
  console.log(`NEW FEATURES TESTS FAILED: ${failed}`);
  console.log(`========================================`);
  if (failed > 0) process.exit(1);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
