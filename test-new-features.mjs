import http from 'http';
import { INTELLIGENCE_DATA } from './src/data/intelligence.js';
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
  console.log('=== VERIFYING DOOMSDAY INTELLIGENCE DATA ===');
  assert(INTELLIGENCE_DATA.productionFacts.length === 6, 'Contains 6 verified production facts');
  assert(INTELLIGENCE_DATA.incursionBriefings.length === 3, 'Contains 3 canonical incursion briefings');
  assert(INTELLIGENCE_DATA.productionFacts.some(f => f.headline.includes('Russo')), 'Verified Russo Brothers directing');
  assert(INTELLIGENCE_DATA.productionFacts.some(f => f.headline.includes('Robert Downey Jr.')), 'Verified RDJ Doctor Doom casting');

  console.log('\n=== VERIFYING CHARACTER DATABASE ===');
  assert(CHARACTERS_DATA.length === 8, `Contains exactly 8 confirmed characters (got ${CHARACTERS_DATA.length})`);
  const names = CHARACTERS_DATA.map(c => c.name);
  assert(names.includes('Doctor Doom'), 'Includes Doctor Doom');
  assert(names.includes('Mister Fantastic'), 'Includes Mister Fantastic');
  assert(names.includes('Invisible Woman'), 'Includes Invisible Woman');
  assert(names.includes('Human Torch'), 'Includes Human Torch');
  assert(names.includes('The Thing'), 'Includes The Thing');
  assert(names.includes('God of Stories'), 'Includes Loki / God of Stories');
  assert(names.includes('Captain America'), 'Includes Captain America');
  assert(names.includes('The Winter Soldier'), 'Includes The Winter Soldier');

  CHARACTERS_DATA.forEach(c => {
    assert(c.capabilities && c.capabilities.length >= 3, `${c.name} has documented capabilities`);
    assert(c.confirmedSources, `${c.name} has verified official source attribution`);
  });

  console.log('\n=== VERIFYING TRAILER ARCHIVE ===');
  assert(TRAILERS_DATA.length === 4, `Contains exactly 4 official trailer items (got ${TRAILERS_DATA.length})`);
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
