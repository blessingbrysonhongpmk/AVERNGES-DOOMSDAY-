import http from 'http';
import fs from 'fs';
import { CHARACTERS_DATA } from './src/data/characters.js';

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

  console.log('\n=== VERIFYING HULK SMASH MAYHEM MINI-GAME ASSETS ===');
  const { SMASH_TARGETS, DECOYS, HERO_ASSISTS, ALL_AVATARS, HULK_DIALOGUES, HULK_PROFILE, COMIC_WORDS } = await import('./src/data/hulkGameData.js');
  const { SOUND_CATALOG } = await import('./src/utils/hulkAudio.js');
  assert(SMASH_TARGETS.length >= 6, `Smash targets defined: ${SMASH_TARGETS.length}`);
  assert(DECOYS.length >= 10, `Hero Allies (Decoys) defined: ${DECOYS.length}`);
  assert(ALL_AVATARS.length === 51, `All 51 Marvel Character Avatars imported: ${ALL_AVATARS.length}`);
  assert(HERO_ASSISTS.length === 3, `Hero Team-Up Assists defined: ${HERO_ASSISTS.length}`);
  assert(fs.existsSync('public' + HULK_PROFILE.poster), `Hulk profile poster exists: ${HULK_PROFILE.poster}`);
  SMASH_TARGETS.forEach(t => {
    assert(fs.existsSync('public' + t.poster), `Smash target poster exists: ${t.name} -> ${t.poster}`);
  });
  DECOYS.forEach(d => {
    assert(fs.existsSync('public' + d.poster), `Hero ally poster exists: ${d.name} -> ${d.poster}`);
  });
  HERO_ASSISTS.forEach(a => {
    assert(fs.existsSync('public' + a.poster), `Team-Up assist poster exists: ${a.heroName} -> ${a.poster}`);
  });
  assert(SOUND_CATALOG.length === 10, `Imported Hulk & Marvel SFX sound bank defined: ${SOUND_CATALOG.length}`);
  SOUND_CATALOG.forEach(sfx => {
    assert(fs.existsSync('public' + sfx.path), `WAV sound asset exists on disk: ${sfx.path}`);
  });
  ALL_AVATARS.forEach(char => {
    assert(fs.existsSync('public' + char.voicePath), `Character unique voice+SFX WAV exists: ${char.id} -> ${char.voicePath}`);
  });
  assert(HULK_DIALOGUES.intro.length > 0, 'Hulk intro dialogues defined in English');
  assert(HULK_DIALOGUES.correct.every(d => !d.includes('machan') && !d.includes('da')), 'Hulk dialogues strictly in English');
  assert(COMIC_WORDS.includes('SMASH!'), 'Comic word SMASH! included');

  console.log('\n=== VERIFYING HTTP RESPONSE ON PORT 3000 ===');
  const home = await fetchHttp('http://localhost:3000/');
  assert(home.status === 200, 'HTTP 200 returned on /');
  assert(home.body.includes('AVENGERS: DOOMSDAY'), 'HTML includes brand title');
  assert(home.body.includes('root'), 'HTML includes root container');
  const roarRes = await fetchHttp('http://localhost:3000/sounds/hulk-roar.wav');
  assert(roarRes.status === 200, 'HTTP 200 returned on /sounds/hulk-roar.wav');
  const repulsorRes = await fetchHttp('http://localhost:3000/sounds/ironman-repulsor.wav');
  assert(repulsorRes.status === 200, 'HTTP 200 returned on /sounds/ironman-repulsor.wav');
  const ironVoiceRes = await fetchHttp('http://localhost:3000/sounds/chars/iron-man.wav');
  assert(ironVoiceRes.status === 200, 'HTTP 200 returned on /sounds/chars/iron-man.wav');
  const thanosVoiceRes = await fetchHttp('http://localhost:3000/sounds/chars/thanos.wav');
  assert(thanosVoiceRes.status === 200, 'HTTP 200 returned on /sounds/chars/thanos.wav');
  const hulkVoiceRes = await fetchHttp('http://localhost:3000/sounds/chars/hulk.wav');
  assert(hulkVoiceRes.status === 200, 'HTTP 200 returned on /sounds/chars/hulk.wav');

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
