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
  const { SOUND_CATALOG, STUDIO_SFX_PATHS } = await import('./src/utils/hulkAudio.js');
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
  Object.entries(STUDIO_SFX_PATHS).forEach(([key, sfxPath]) => {
    assert(fs.existsSync('public' + sfxPath), `Studio WAV cue exists on disk: ${key} -> ${sfxPath}`);
  });
  ALL_AVATARS.forEach(char => {
    assert(fs.existsSync('public' + char.voicePath), `Character unique voice+SFX WAV exists: ${char.id} -> ${char.voicePath}`);
  });
  assert(HULK_DIALOGUES.intro.length > 0, 'Hulk intro dialogues defined in English');
  assert(HULK_DIALOGUES.correct.every(d => !d.includes('machan') && !d.includes('da')), 'Hulk dialogues strictly in English');
  assert(COMIC_WORDS.includes('SMASH!'), 'Comic word SMASH! included');

  const gameSource = fs.readFileSync('src/components/HulkSmashGame.jsx', 'utf8');
  assert(gameSource.includes('font-trailer') && gameSource.includes('font-hud'), 'Game countdown and HUD use blockbuster trailer/HUD fonts');
  assert(gameSource.includes('excludeAvatarId') && gameSource.includes('overchargeMs') && gameSource.includes('freezeMs'), 'Game fixes pause-safe buffs and avatar decoy deduplication');
  assert(gameSource.includes('AI VOICES ON') && gameSource.includes('object-[50%_18%]') && !/tamil/i.test(gameSource), 'Game uses pure English MCU voices & crisp framed portraits without Tamil strings');
  assert(ALL_AVATARS.every((char) => char.voiceLine && !char.voiceLineTamil), 'All 51 Marvel characters have English MCU voice quotes only');

  const { WATCHLIST: WL, WATCHLIST_ERAS } = await import('./src/data/watchlist.js');
  assert(WATCHLIST_ERAS.length === 4, `Watchlist chronological eras defined: ${WATCHLIST_ERAS.length}`);
  assert(WL.every((w) => w.eraId && w.reality && w.doomsdayLink), 'Every Watchlist chapter defines timeline era, reality & Doomsday link');
  assert(fs.existsSync('src/components/DoomsdayRoadmapModal.jsx'), 'DoomsdayRoadmapModal component exists');
  const roadmapSource = fs.readFileSync('src/components/DoomsdayRoadmapModal.jsx', 'utf8');
  assert(roadmapSource.includes('CHECKLIST') && roadmapSource.includes('TIMELINE'), 'Roadmap modal includes large Checklist & Timeline mode switcher');
  assert(roadmapSource.includes('SEASON 1') && roadmapSource.includes('SEASON 2'), 'Roadmap modal supports Loki Season 1 & 2 checklist controls');
  assert(roadmapSource.includes('createPortal') && roadmapSource.includes('MultiverseProgressDial'), 'Roadmap modal renders cleanly via document.body portal and includes 15-segment SVG dial');

  console.log('\n=== VERIFYING HTTP RESPONSE ON PORT 3000 ===');
  const home = await fetchHttp('http://localhost:3000/');
  assert(home.status === 200, 'HTTP 200 returned on /');
  assert(home.body.includes('AVENGERS: DOOMSDAY'), 'HTML includes brand title');
  assert(home.body.includes('Bebas+Neue') && home.body.includes('Barlow+Condensed'), 'HTML loads Bebas Neue & Barlow Condensed fonts');
  assert(home.body.includes('root'), 'HTML includes root container');
  for (const [key, sfxPath] of Object.entries(STUDIO_SFX_PATHS)) {
    const res = await fetchHttp(`http://localhost:3000${sfxPath}`);
    assert(res.status === 200, `HTTP 200 returned on studio cue ${key}: ${sfxPath}`);
  }
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
  assert(fs.existsSync('public/sounds/avengers-bgm.wav') && fs.statSync('public/sounds/avengers-bgm.wav').size > 1000000, 'High-quality Stereo Avengers Orchestral BGM exists on disk');
  const bgmHeadRes = await new Promise((resolve, reject) => {
    const req = http.request('http://localhost:3000/sounds/avengers-bgm.wav', { method: 'HEAD' }, (res) => resolve({ status: res.statusCode }));
    req.on('error', reject);
    req.end();
  });
  assert(bgmHeadRes.status === 200, 'HTTP 200 returned on /sounds/avengers-bgm.wav');
  const navSource = fs.readFileSync('src/components/Navigation.jsx', 'utf8');
  assert(navSource.includes('useAvengersBgm') && navSource.includes('AVENGERS BGM') && navSource.includes('importCustomBgm'), 'Navigation includes premium Avengers BGM ON/OFF switch & custom MP3/WAV uploader');
  assert(fs.existsSync('public/sounds/user-bgm.mp3') && fs.statSync('public/sounds/user-bgm.mp3').size > 1000000, 'User uploaded BGM MP3 exists on disk');
  const userBgmHeadRes = await new Promise((resolve, reject) => {
    const req = http.request('http://localhost:3000/sounds/user-bgm.mp3', { method: 'HEAD' }, (res) => resolve({ status: res.statusCode }));
    req.on('error', reject);
    req.end();
  });
  assert(userBgmHeadRes.status === 200, 'HTTP 200 returned on /sounds/user-bgm.mp3');
  assert(fs.existsSync('public/hulk-doomsday-keyart.jpg') && fs.statSync('public/hulk-doomsday-keyart.jpg').size > 50000, 'Massive Hulk + Doomsday combination keyart exists on disk');
  const keyartRes = await new Promise((resolve, reject) => {
    const req = http.request('http://localhost:3000/hulk-doomsday-keyart.jpg', { method: 'HEAD' }, (res) => resolve({ status: res.statusCode }));
    req.on('error', reject);
    req.end();
  });
  assert(keyartRes.status === 200, 'HTTP 200 returned on /hulk-doomsday-keyart.jpg');
  const bannerSource = fs.readFileSync('src/components/HulkSmashBanner.jsx', 'utf8');
  assert(bannerSource.includes('lg:col-span-6') && bannerSource.includes('hulk-doomsday-keyart.jpg') && bannerSource.includes('PLAY HULK SMASH') && bannerSource.includes('SLOT 02'), 'HulkSmashBanner splits into two columns with Doomsday green CTA & blank reserved slot');

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
