const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const radarCanvas = document.getElementById("radarCanvas");
const radar = radarCanvas.getContext("2d");

const ui = {
  cockpit: document.querySelector(".cockpit"),
  stageOneVideo: document.getElementById("stageOneVideo"),
  coverVideo: document.getElementById("coverVideo"),
  cover: document.getElementById("coverOverlay"),
  showIntro: document.getElementById("showIntro"),
  lifeFill: document.getElementById("lifeFill"),
  lifeText: document.getElementById("lifeText"),
  focusFill: document.getElementById("focusFill"),
  focusText: document.getElementById("focusText"),
  surviveTime: document.getElementById("surviveTime"),
  homeTime: document.getElementById("homeTime"),
  timeProgress: document.getElementById("timeProgress"),
  phaseText: document.getElementById("phaseText"),
  energyIcon: document.getElementById("energyIcon"),
  energyFill: document.getElementById("energyFill"),
  energyText: document.getElementById("energyText"),
  aiLevelText: document.getElementById("aiLevelText"),
  disturbance: document.getElementById("disturbance"),
  popupCountdown: document.getElementById("popupCountdown"),
  popupArt: document.getElementById("popupArt"),
  popupTitle: document.getElementById("popupTitle"),
  popupLine: document.getElementById("popupLine"),
  aiHint: document.getElementById("aiHint"),
  intro: document.getElementById("introOverlay"),
  reward: document.getElementById("rewardOverlay"),
  rewardKicker: document.getElementById("rewardKicker"),
  rewardTitle: document.getElementById("rewardTitle"),
  rewardText: document.getElementById("rewardText"),
  rewardName: document.getElementById("rewardName"),
  nextStageName: document.getElementById("nextStageName"),
  gameOver: document.getElementById("gameOverOverlay"),
  resultKicker: document.getElementById("resultKicker"),
  resultTitle: document.getElementById("resultTitle"),
  resultText: document.getElementById("resultText"),
  resultTime: document.getElementById("resultTime"),
  resultGhosts: document.getElementById("resultGhosts"),
  resultAvoided: document.getElementById("resultAvoided"),
  resultClosed: document.getElementById("resultClosed"),
  returnHome: document.getElementById("returnHome"),
  cooldowns: {
    radar: document.getElementById("radarCooldown"),
    night: document.getElementById("nightCooldown"),
    horn: document.getElementById("hornCooldown"),
    silence: document.getElementById("silenceCooldown"),
  },
};

const ROAD_VANISH_Y_RATIO = 0.5;
const LAYOUT_COORDINATE_WIDTH = 1280;
const LAYOUT_COORDINATE_HEIGHT = 720;
let manualLayout = null;

const GAME_ASSETS = {
  backgrounds: {
    dusk: "../04-程序素材库/assets/backgrounds/stage-01-dusk-road-empty.png",
    oldtown: "../04-程序素材库/assets/backgrounds/stage-02-rain-city-empty.png",
    midnight: "../04-程序素材库/assets/backgrounds/stage-03-last-road-empty.png",
  },
  foreground: {
    cockpit: "../04-程序素材库/assets/foreground/cockpit-frame-only-v4.png",
    hood: "../04-程序素材库/assets/foreground/car-hood-real-v7-crop.png",
    headlights: "../04-程序素材库/assets/foreground/headlight-beams-rain-v1-clean.png",
  },
  videos: {
    dusk: "../04-程序素材库/assets/videos/stage-01-driving-loop.mp4",
  },
  sprites: {
    "real-delivery": "../04-程序素材库/assets/sprites/processed/character-real-delivery-rider-front/clean.png",
    "real-scooter-adult": "../04-程序素材库/assets/sprites/processed/character-real-scooter-adult-front/clean.png",
    "real-mother-child": "../04-程序素材库/assets/sprites/processed/character-real-mother-child-scooter-front/clean.png",
    "real-worker": "../04-程序素材库/assets/sprites/processed/character-real-worker-front/clean.png",
    "real-grandma": "../04-程序素材库/assets/sprites/processed/character-real-grandma-front/clean.png",
    "real-crouching-adult": "../04-程序素材库/assets/sprites/processed/character-real-crouching-adult-front/clean.png",
    "real-student-cyclist": "../04-程序素材库/assets/sprites/processed/character-real-student-cyclist-front/clean.png",
    "ghost-paper": "../04-程序素材库/assets/sprites/processed/enemy-ghost-paper-doll/clean.png",
    "ghost-zombie": "../04-程序素材库/assets/sprites/processed/enemy-ghost-zombie/clean.png",
    "ghost-mist": "../04-程序素材库/assets/sprites/processed/enemy-ghost-mist/clean.png",
    "ghost-lantern": "../04-程序素材库/assets/sprites/processed/enemy-ghost-red-lantern/clean.png",
    "ghost-bride": "../04-程序素材库/assets/sprites/processed/enemy-ghost-bride-shadow/clean.png",
    "data-pack": "../04-程序素材库/assets/sprites/processed/pickup-ai-data-pack/clean.png",
  },
  calls: {
    boss: "../04-程序素材库/assets/ui/call-cards/cutouts/call-boss-overtime-cutout.png",
    client: "../04-程序素材库/assets/ui/call-cards/cutouts/call-client-revision-cutout.png",
    longHair: "../04-程序素材库/assets/ui/call-cards/cutouts/call-long-hair-ghost-cutout.png",
    paperBride: "../04-程序素材库/assets/ui/call-cards/cutouts/call-paper-bride-cutout.png",
    unknownBackseat: "../04-程序素材库/assets/ui/call-cards/cutouts/call-unknown-backseat-cutout.png",
    homeLandline: "../04-程序素材库/assets/ui/call-cards/cutouts/call-home-landline-cutout.png",
    hauntedNavigation: "../04-程序素材库/assets/ui/call-cards/cutouts/call-haunted-navigation-cutout.png",
    carVoice: "../04-程序素材库/assets/ui/call-cards/cutouts/call-car-voice-cutout.png",
  },
};

const imageAssets = new Map();
let assetsLoaded = false;

const realTypes = [
  {
    name: "外卖小哥",
    label: "低头看手机",
    cue: "手机光",
    color: "#ffd36a",
    speed: 0.84,
    drift: 0.32,
    damage: 20,
    shape: "rider",
    assetKey: "real-delivery",
  },
  {
    name: "电动车宝妈",
    label: "后座带小孩",
    cue: "尾灯",
    color: "#ffbc7b",
    speed: 0.7,
    drift: 0.16,
    damage: 28,
    shape: "scooter",
    assetKey: "real-mother-child",
  },
  {
    name: "工地老哥",
    label: "反光背心",
    cue: "反光",
    color: "#d7ff87",
    speed: 0.54,
    drift: 0.12,
    damage: 24,
    shape: "worker",
    assetKey: "real-worker",
  },
  {
    name: "蹲身捡物成人",
    label: "蹲在车道",
    cue: "雨衣反光",
    color: "#fff2a6",
    speed: 0.6,
    drift: 0.08,
    damage: 32,
    shape: "crouch",
    assetKey: "real-crouching-adult",
  },
  {
    name: "老奶奶",
    label: "慢速横穿",
    cue: "伞面反光",
    color: "#f7d5bd",
    speed: 0.48,
    drift: 0.1,
    damage: 26,
    shape: "elder",
    assetKey: "real-grandma",
  },
  {
    name: "正面骑车学生",
    label: "书包反光",
    cue: "车轮水花",
    color: "#b8d9ff",
    speed: 0.78,
    drift: 0.2,
    damage: 24,
    shape: "student",
    assetKey: "real-student-cyclist",
  },
];

const ghostTypes = [
  { name: "纸人", color: "#c6f7ff", speed: 0.82, hp: 1, shape: "paper", assetKey: "ghost-paper" },
  { name: "僵尸", color: "#9dd9bf", speed: 0.7, hp: 2, shape: "zombie", assetKey: "ghost-zombie" },
  { name: "黑雾", color: "#6f78ff", speed: 0.92, hp: 1, shape: "mist", assetKey: "ghost-mist" },
  { name: "红灯笼", color: "#ff526c", speed: 0.76, hp: 1, shape: "lantern", assetKey: "ghost-lantern" },
  { name: "纸嫁衣影", color: "#ff7b90", speed: 0.62, hp: 3, shape: "bride", assetKey: "ghost-bride" },
];

const carFront = {
  nearZ: 0.16,
  passedZ: 0,
  halfWidth: 0.18,
  topYRatio: 0.66,
  topHalfRatio: 0.135,
  bottomHalfRatio: 0.21,
  activeDepthRatio: 0.6,
};

const steering = {
  acceleration: 13.5,
  damping: 0.32,
  maxVelocity: 4.6,
};

const disturbanceCalls = [
  {
    title: "老板来电",
    line: "项目突然有问题，你现在掉头回来一趟。",
    missHint: "老板来电没关，脑子开始想加班",
    artKey: "boss",
  },
  {
    title: "甲方来电",
    line: "我就改最后一版，真的最后一版。",
    missHint: "甲方来电没关，专注被拖走了",
    artKey: "client",
  },
  {
    title: "长发女鬼来电",
    line: "电视黑屏了，你能过来陪我看一会儿吗？",
    missHint: "长发女鬼来电没关，后背开始发凉",
    artKey: "longHair",
  },
  {
    title: "纸嫁衣新娘来电",
    line: "新郎还没到，你是不是走错路了？",
    missHint: "纸嫁衣新娘来电没关，眼前开始发红",
    artKey: "paperBride",
  },
  {
    title: "未知号码",
    line: "你车后座上那个人，是你朋友吗？",
    missHint: "未知号码没关，专注值下降",
    artKey: "unknownBackseat",
  },
  {
    title: "家里座机",
    line: "别开门。现在门口那个不是我。",
    missHint: "家里座机没关，回家的路变得不对劲",
    artKey: "homeLandline",
  },
  {
    title: "导航重算",
    line: "已为你切换至更近路线：坟场小路。",
    missHint: "导航重算没关，路线开始乱跳",
    artKey: "hauntedNavigation",
  },
  {
    title: "车机语音",
    line: "检测到后排乘客未系安全带。",
    missHint: "车机语音没关，座舱里好像多了个人",
    artKey: "carVoice",
  },
];

const phases = [
  {
    id: "dusk",
    title: "第1关 天还没黑",
    shortTitle: "天还没黑",
    description: "傍晚公路，现实危险为主。先活下来，别撞到人。",
    duration: 50,
    rewardName: "救命喇叭",
    rewardLine: "救命喇叭装上了。前面有人冲出来时，至少还能喊一声。",
    rewardEffect: "W 智能鸣笛范围变大，现实目标避让更稳。",
    realNames: ["外卖小哥", "工地老哥", "老奶奶"],
    ghostNames: ["纸人"],
    realInterval: [2.35, 3.25],
    ghostInterval: [7.8, 10.5],
    dataInterval: [2.6, 3.4],
    popupInterval: [24, 32],
    maxReal: 2,
    maxGhost: 1,
    maxData: 2,
    speed: 0.86,
  },
  {
    id: "oldtown",
    title: "第2关 雨越下越大",
    shortTitle: "雨越下越大",
    description: "雨夜城区，路越来越糊，现实危险和怪谈混在一起。",
    duration: 50,
    rewardName: "强光大灯",
    rewardLine: "强光大灯亮起来了。雨再大，也得看清回家的路。",
    rewardEffect: "E 夜视摄像头持续更久，车灯范围更远。",
    realNames: ["外卖小哥", "电动车宝妈", "工地老哥", "蹲身捡物成人", "老奶奶", "正面骑车学生"],
    ghostNames: ["纸人", "僵尸", "黑雾", "红灯笼"],
    realInterval: [1.7, 2.35],
    ghostInterval: [3.2, 4.5],
    dataInterval: [3.6, 4.8],
    popupInterval: [16, 22],
    maxReal: 3,
    maxGhost: 3,
    maxData: 2,
    speed: 1.02,
  },
  {
    id: "midnight",
    title: "第3关 离家只剩一段路",
    shortTitle: "离家只剩一段路",
    description: "最后一公里，鬼怪像地狱一样压上来。稳住，回家。",
    duration: 50,
    rewardName: "平安钥匙",
    rewardLine: "钥匙在手里，门就在眼前。你到家了。",
    rewardEffect: "最终奖励：安全到家。",
    realNames: ["外卖小哥", "电动车宝妈", "工地老哥", "蹲身捡物成人", "老奶奶", "正面骑车学生"],
    ghostNames: ["纸人", "僵尸", "黑雾", "红灯笼", "纸嫁衣影"],
    realInterval: [1.18, 1.72],
    ghostInterval: [1.15, 1.75],
    dataInterval: [4.2, 5.6],
    popupInterval: [10, 15],
    maxReal: 4,
    maxGhost: 5,
    maxData: 1,
    speed: 1.22,
  },
];

const skillCosts = {
  radar: 30,
  horn: 38,
  night: 20,
  silence: 18,
};

const validSkills = new Set(Object.keys(skillCosts));

const state = {
  running: false,
  ended: false,
  keys: new Set(),
  time: 0,
  levelTime: 0,
  levelIndex: 0,
  lastFrame: 0,
  rafId: null,
  awaitingReward: false,
  life: 100,
  focus: 100,
  energy: 0,
  aiLevel: 1,
  dataCollected: 0,
  carX: 0,
  carVX: 0,
  shake: 0,
  brakeFlash: 0,
  ghostFlash: 0,
  spawnTimer: 0,
  ghostTimer: 0,
  dataTimer: 0,
  popupTimer: 10,
  currentPhaseId: "dusk",
  upgrades: {
    horn: false,
    headlight: false,
  },
  popupActive: false,
  currentCall: disturbanceCalls[0],
  popupLeft: 0,
  nightVision: 0,
  radarPulse: 0,
  energyAbsorb: 0,
  stats: {
    ghosts: 0,
    avoided: 0,
    closed: 0,
  },
  cooldown: {
    radar: 0,
    horn: 0,
    night: 0,
    silence: 0,
  },
  objects: [],
  floaters: [],
  impactEffects: [],
  hitSprites: [],
};

function collectAssetPaths() {
  return [
    ...Object.values(GAME_ASSETS.backgrounds),
    ...Object.values(GAME_ASSETS.foreground),
    ...Object.values(GAME_ASSETS.sprites),
    ...Object.values(GAME_ASSETS.calls),
  ];
}

function preloadGameAssets() {
  const loaders = collectAssetPaths().map((src) => {
    if (imageAssets.has(src)) return Promise.resolve(imageAssets.get(src));
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = src;
      imageAssets.set(src, image);
    });
  });

  return Promise.all(loaders).then(() => {
    assetsLoaded = true;
  });
}

function getLoadedImage(src) {
  const image = imageAssets.get(src);
  if (!image || !image.complete || image.naturalWidth === 0) return null;
  return image;
}

function getSpriteImage(assetKey) {
  if (!assetKey) return null;
  return getLoadedImage(GAME_ASSETS.sprites[assetKey]);
}

const assetPreload = preloadGameAssets();

function syncStageVideo() {
  const video = ui.stageOneVideo;
  if (!video) return;
  const shouldPlay = state.running && !state.awaitingReward && getPhase().id === "dusk";
  if (shouldPlay) {
    video.play().catch(() => {
      // Browser autoplay policy can still block until the user's first click.
    });
  } else {
    video.pause();
  }
}

function syncCoverVideo() {
  const video = ui.coverVideo;
  if (!video) return;
  const shouldPlay = ui.cockpit.classList.contains("cover-active") && !state.running && !state.awaitingReward;
  if (shouldPlay) {
    video.muted = true;
    video.volume = 0;
    video.play().catch(() => {
      // Muted autoplay is allowed in most browsers, but keep this non-fatal.
    });
  } else {
    video.pause();
  }
}

function showIntroPage() {
  state.running = false;
  state.ended = false;
  state.awaitingReward = false;
  ui.cockpit.classList.remove("cover-active");
  ui.cockpit.classList.add("intro-active");
  ui.cover.hidden = true;
  ui.intro.hidden = false;
  ui.reward.hidden = true;
  ui.gameOver.hidden = true;
  syncCoverVideo();
  syncStageVideo();
  draw();
}

function resetGame() {
  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
  state.running = true;
  state.ended = false;
  state.awaitingReward = false;
  state.keys.clear();
  state.time = 0;
  state.levelTime = 0;
  state.levelIndex = 0;
  state.lastFrame = performance.now();
  state.life = 100;
  state.focus = 100;
  state.energy = 20;
  state.aiLevel = 1;
  state.dataCollected = 0;
  state.carX = 0;
  state.carVX = 0;
  state.shake = 0;
  state.brakeFlash = 0;
  state.ghostFlash = 0;
  state.spawnTimer = 0.8;
  state.ghostTimer = 6.5;
  state.dataTimer = 2.4;
  state.popupTimer = 24;
  state.currentPhaseId = "dusk";
  state.upgrades = { horn: false, headlight: false };
  state.popupActive = false;
  state.currentCall = disturbanceCalls[0];
  state.popupLeft = 0;
  state.nightVision = 0;
  state.radarPulse = 0;
  state.energyAbsorb = 0;
  state.stats = { ghosts: 0, avoided: 0, closed: 0 };
  state.cooldown = { radar: 0, horn: 0, night: 0, silence: 0 };
  state.objects = [];
  state.floaters = [];
  state.impactEffects = [];
  state.hitSprites = [];
  window.clearTimeout(setHint.timer);
  ui.aiHint.textContent = "车头前缘判定：危险贴近车头才会触发效果。";
  ui.cockpit.classList.remove("cover-active");
  ui.cockpit.classList.remove("intro-active");
  ui.cover.hidden = true;
  ui.intro.hidden = true;
  syncCoverVideo();
  ui.reward.hidden = true;
  ui.gameOver.hidden = true;
  ui.disturbance.hidden = true;
  updateUI();
  syncStageVideo();
  state.rafId = requestAnimationFrame(loop);
}

function returnToCover() {
  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
  state.running = false;
  state.ended = false;
  state.awaitingReward = false;
  state.keys.clear();
  state.objects = [];
  state.floaters = [];
  state.impactEffects = [];
  state.hitSprites = [];
  state.popupActive = false;
  ui.cockpit.classList.add("cover-active");
  ui.cockpit.classList.remove("intro-active");
  ui.cover.hidden = false;
  ui.intro.hidden = true;
  ui.reward.hidden = true;
  ui.gameOver.hidden = true;
  ui.disturbance.hidden = true;
  ui.popupArt.hidden = true;
  ui.popupArt.removeAttribute("src");
  syncStageVideo();
  syncCoverVideo();
  draw();
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function sample(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  const m = String(Math.floor(safe / 60)).padStart(2, "0");
  const s = String(safe % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function getPhase() {
  return phases[state.levelIndex] || phases[phases.length - 1];
}

function sampleByName(list, names) {
  const pool = list.filter((item) => names.includes(item.name));
  return sample(pool.length ? pool : list);
}

function countActive(kind) {
  return state.objects.filter((obj) => obj.kind === kind && !obj.remove && obj.z > carFront.passedZ).length;
}

function phaseInterval(range) {
  return rand(range[0], range[1]);
}

function spawnObject(kind) {
  const phase = getPhase();
  const type = kind === "real"
    ? sampleByName(realTypes, phase.realNames)
    : sampleByName(ghostTypes, phase.ghostNames);
  const side = Math.random() < 0.5 ? -1 : 1;
  const x = rand(-0.85, 0.85);
  const drift = kind === "real" ? type.drift * side * rand(0.4, 1) : rand(-0.08, 0.08);
  state.objects.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    kind,
    type,
    x,
    z: 1.02,
    drift,
    hp: type.hp ?? 1,
    hit: false,
    avoided: false,
    targetPulse: 0,
  });
}

function spawnDataPack() {
  state.objects.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    kind: "data",
    type: { name: "AI数据包", color: "#49d7ff", speed: 0.76, shape: "data" },
    x: rand(-0.72, 0.72),
    z: 1.02,
    drift: rand(-0.04, 0.04),
    hp: 1,
    hit: false,
    avoided: false,
    targetPulse: 0,
  });
}

function loop(now) {
  if (!state.running) {
    state.rafId = null;
    return;
  }
  const dt = Math.min(0.033, (now - state.lastFrame) / 1000 || 0);
  state.lastFrame = now;
  update(dt);
  draw();
  state.rafId = state.running ? requestAnimationFrame(loop) : null;
}

function update(dt) {
  state.time += dt;
  state.levelTime += dt;
  const phase = getPhase();
  if (state.levelTime >= phase.duration) {
    completeLevel();
    return;
  }

  const left = state.keys.has("ArrowLeft") || state.keys.has("a") || state.keys.has("A");
  const right = state.keys.has("ArrowRight") || state.keys.has("d") || state.keys.has("D");
  const input = (right ? 1 : 0) - (left ? 1 : 0);
  state.carVX += input * dt * steering.acceleration;
  state.carVX *= Math.pow(steering.damping, dt);
  state.carVX = clamp(state.carVX, -steering.maxVelocity, steering.maxVelocity);
  state.carX = Math.max(-1, Math.min(1, state.carX + state.carVX * dt));

  if (phase.id !== state.currentPhaseId) {
    state.currentPhaseId = phase.id;
    state.radarPulse = Math.max(state.radarPulse, 0.45);
    setHint(`${phase.title}：${phase.description}`);
    syncStageVideo();
  }

  state.spawnTimer -= dt;
  state.ghostTimer -= dt;
  state.dataTimer -= dt;
  state.popupTimer -= dt;
  state.shake = Math.max(0, state.shake - dt * 4);
  state.brakeFlash = Math.max(0, state.brakeFlash - dt * 2.8);
  state.ghostFlash = Math.max(0, state.ghostFlash - dt * 2.5);
  state.nightVision = Math.max(0, state.nightVision - dt);
  state.radarPulse = Math.max(0, state.radarPulse - dt);
  state.energyAbsorb = Math.max(0, state.energyAbsorb - dt);
  Object.keys(state.cooldown).forEach((key) => {
    state.cooldown[key] = Math.max(0, state.cooldown[key] - dt);
  });

  if (state.spawnTimer <= 0) {
    if (countActive("real") < phase.maxReal) {
      spawnObject("real");
    }
    state.spawnTimer = phaseInterval(phase.realInterval);
  }
  if (state.ghostTimer <= 0) {
    if (countActive("ghost") < phase.maxGhost) {
      spawnObject("ghost");
    }
    state.ghostTimer = phaseInterval(phase.ghostInterval);
  }
  if (state.dataTimer <= 0) {
    if (countActive("data") < phase.maxData) {
      spawnDataPack();
    }
    state.dataTimer = phaseInterval(phase.dataInterval);
  }
  if (state.popupTimer <= 0 && !state.popupActive) {
    openPopup();
    state.popupTimer = phaseInterval(phase.popupInterval);
  }

  if (state.popupActive) {
    state.popupLeft -= dt;
    ui.popupCountdown.style.width = `${Math.max(0, state.popupLeft / 5) * 100}%`;
    if (state.popupLeft <= 0) {
      state.popupActive = false;
      ui.disturbance.hidden = true;
      damageFocus(16, `${state.currentCall.missHint}，专注值下降`);
    }
  }

  const speedScale = (0.16 + state.time * 0.00042) * phase.speed;
  state.objects.forEach((obj) => {
    const kindSpeed = obj.kind === "ghost" ? 0.88 : obj.kind === "data" ? 0.76 : 0.78;
    obj.z -= dt * speedScale * obj.type.speed * kindSpeed;
    if (!obj.yielding) {
      obj.x += obj.drift * dt * (1.1 - obj.z);
    }
    obj.targetPulse += dt;
    if (obj.horned) obj.horned = Math.max(0, obj.horned - dt);
    if (obj.hornReact) obj.hornReact = Math.max(0, obj.hornReact - dt);
    if (!obj.hit) {
      if (hitsCarFront(obj) && !isHornSafeRealTarget(obj)) {
        obj.hit = true;
        if (obj.kind === "data") {
          handleDataCollect(obj);
        } else if (obj.kind === "ghost") {
          handleGhostCollision(obj);
        } else {
          handleRealCollision(obj);
        }
      } else if (entersForegroundOcclusion(obj)) {
        hideObjectBehindCockpit(obj);
      }
    }
  });

  state.objects = state.objects.filter((obj) => obj.z > -0.15 && !obj.remove);
  state.floaters.forEach((floater) => {
    floater.life -= dt;
    floater.y -= dt * 0.18;
  });
  state.floaters = state.floaters.filter((floater) => floater.life > 0);
  state.impactEffects.forEach((effect) => {
    effect.life -= dt;
    effect.radius += dt * 170;
    effect.y -= dt * 18;
  });
  state.impactEffects = state.impactEffects.filter((effect) => effect.life > 0);
  state.hitSprites.forEach((effect) => {
    effect.life -= dt;
    effect.age += dt;
  });
  state.hitSprites = state.hitSprites.filter((effect) => effect.life > 0);

  if (state.life <= 0 || state.focus <= 0) {
    endGame(false);
  }

  updateUI();
}

function completeLevel() {
  endGame(true);
}

function applyLevelReward(levelIndex) {
  if (levelIndex === 0) {
    state.upgrades.horn = true;
  }
  if (levelIndex === 1) {
    state.upgrades.headlight = true;
  }
}

function continueNextLevel() {
  if (!state.awaitingReward) return;
  state.levelIndex += 1;
  const phase = getPhase();
  state.awaitingReward = false;
  state.running = true;
  syncStageVideo();
  state.keys.clear();
  state.levelTime = 0;
  state.lastFrame = performance.now();
  state.carX = 0;
  state.carVX = 0;
  state.shake = 0;
  state.brakeFlash = 0;
  state.ghostFlash = 0;
  state.spawnTimer = 1.1;
  state.ghostTimer = phase.id === "oldtown" ? 4.4 : 2.2;
  state.dataTimer = 2.2;
  state.popupTimer = phase.id === "midnight" ? 8 : 14;
  state.currentPhaseId = phase.id;
  state.popupActive = false;
  state.objects = [];
  state.floaters = [];
  state.impactEffects = [];
  state.hitSprites = [];
  ui.reward.hidden = true;
  ui.disturbance.hidden = true;
  setHint(`${phase.title}：${phase.description}`);
  updateUI();
  state.rafId = requestAnimationFrame(loop);
}

function openPopup() {
  const call = sample(disturbanceCalls);
  state.popupActive = true;
  state.currentCall = call;
  state.popupLeft = 5;
  ui.popupTitle.textContent = call.title;
  ui.popupLine.textContent = `${call.line} 空格关闭。`;
  ui.popupArt.src = GAME_ASSETS.calls[call.artKey] || "";
  ui.popupArt.hidden = !GAME_ASSETS.calls[call.artKey];
  ui.disturbance.hidden = false;
  ui.popupCountdown.style.width = "100%";
}

function closePopup(manual = true) {
  if (!state.popupActive) return;
  state.popupActive = false;
  ui.disturbance.hidden = true;
  ui.popupArt.hidden = true;
  ui.popupArt.removeAttribute("src");
  if (manual) {
    state.stats.closed += 1;
    addEnergy(5);
    addFloater("+能量", 0.82, 0.38, "#49d7ff");
  }
}

function isHornSafeRealTarget(obj) {
  return obj.kind === "real" && obj.hornSafe;
}

function hitsCarFront(obj) {
  const contact = getObjectContactPoint(obj);
  const hitbox = getCarFrontHitbox(canvas.width, canvas.height);
  if (contact.y < hitbox.topY) return false;
  if (contact.y > hitbox.activeBottomY) return false;
  const halfWidth = carFrontHalfWidthAt(contact.y, hitbox) * 0.94;
  return Math.abs(contact.x - hitbox.centerX) <= halfWidth;
}

function getObjectContactPoint(obj) {
  const projected = project(obj.x, obj.z, canvas.width, canvas.height);
  const bottomOffset = obj.kind === "data" ? 18 : obj.kind === "ghost" ? 38 : 34;
  return {
    x: projected.x,
    y: projected.y + bottomOffset * projected.scale,
  };
}

function entersForegroundOcclusion(obj) {
  if (obj.kind !== "real" && obj.kind !== "ghost") return false;
  const contact = getObjectContactPoint(obj);
  if (contact.y < getForegroundOcclusionTopY(canvas.height)) return false;

  const hitbox = getCarFrontHitbox(canvas.width, canvas.height);
  const inFrontLane = Math.abs(contact.x - hitbox.centerX) <= hitbox.activeBottomHalf * 1.08;
  return !inFrontLane || contact.y > hitbox.activeBottomY + canvas.height * 0.025;
}

function getForegroundOcclusionTopY(h) {
  const hoodBox = layoutBox("gameplay", "visual", "hoodVisual");
  if (hoodBox) return (hoodBox.y / LAYOUT_COORDINATE_HEIGHT) * h;
  return h * 0.68;
}

function hideObjectBehindCockpit(obj) {
  obj.remove = true;
  obj.avoided = true;
  if (obj.kind === "real") {
    state.stats.avoided += 1;
    addEnergy(2);
  }
}

function getCarVisualMotion(w) {
  const offsetX = clamp(state.carX * w * 0.12 + state.carVX * w * 0.028, -w * 0.2, w * 0.2);
  const tilt = clamp(state.carVX * 0.026 + state.carX * 0.024, -0.12, 0.12);
  return { offsetX, tilt };
}

function getCarFrontHitbox(w, h) {
  const motion = getCarVisualMotion(w);
  const calibratedBox = layoutBox("gameplay", "hitbox", "carFrontActive");
  if (calibratedBox) {
    const boxX = (calibratedBox.x / LAYOUT_COORDINATE_WIDTH) * w;
    const boxY = (calibratedBox.y / LAYOUT_COORDINATE_HEIGHT) * h;
    const boxW = (calibratedBox.w / LAYOUT_COORDINATE_WIDTH) * w;
    const boxH = (calibratedBox.h / LAYOUT_COORDINATE_HEIGHT) * h;
    const topY = boxY + boxH * 0.5;
    const activeBottomY = boxY + boxH * 0.78;
    const topHalf = boxW * 0.18;
    const activeBottomHalf = boxW * 0.29;
    return {
      centerX: boxX + boxW / 2 + motion.offsetX,
      topY,
      bottomY: boxY + boxH,
      activeBottomY,
      topHalf,
      bottomHalf: boxW * 0.5,
      activeBottomHalf,
    };
  }

  const topY = h * carFront.topYRatio;
  const bottomY = h;
  const topHalf = w * carFront.topHalfRatio;
  const bottomHalf = w * carFront.bottomHalfRatio;
  const activeBottomY = topY + (bottomY - topY) * carFront.activeDepthRatio;
  const activeBottomHalf = topHalf + (bottomHalf - topHalf) * carFront.activeDepthRatio;
  return {
    centerX: w / 2 + motion.offsetX,
    topY,
    bottomY,
    activeBottomY,
    topHalf,
    bottomHalf,
    activeBottomHalf,
  };
}

function carFrontHalfWidthAt(y, hitbox) {
  const progress = clamp((y - hitbox.topY) / (hitbox.activeBottomY - hitbox.topY), 0, 1);
  return hitbox.topHalf + (hitbox.activeBottomHalf - hitbox.topHalf) * progress;
}

function handleRealCollision(obj) {
  addHitSprite(obj, "real");
  obj.remove = true;
  state.carVX *= -0.35;
  state.brakeFlash = 1;
  addFrontImpact("现实碰撞", "#ff5d6c", obj.x, "real");
  damageLife(obj.type.damage, `撞到现实目标：${obj.type.name}，生命值大幅下降`);
  addFloater("-生命", obj.x, 0.22, "#ff5d6c");
}

function handleGhostCollision(obj) {
  addHitSprite(obj, "ghost");
  obj.remove = true;
  state.ghostFlash = 1;
  addFrontImpact("怪谈惊扰", "#b37cff", obj.x, "ghost");
  damageFocus(14, `怪谈贴上车头：${obj.type.name}，专注值下降`);
  addFloater("-专注", obj.x, 0.22, "#b37cff");
}

function addHitSprite(obj, type) {
  const direction = obj.x >= state.carX ? 1 : -1;
  state.hitSprites.push({
    type,
    objectType: obj.type,
    x: obj.x,
    z: obj.z,
    direction,
    age: 0,
    life: type === "ghost" ? 0.72 : 0.58,
    maxLife: type === "ghost" ? 0.72 : 0.58,
  });
}

function handleDataCollect(obj) {
  obj.remove = true;
  state.dataCollected += 1;
  state.energyAbsorb = 0.72;
  addEnergy(18);
  addFrontImpact("收集数据", "#49d7ff", obj.x, "data");
  addFloater("+AI能量", obj.x, 0.24, "#49d7ff");

  if (state.dataCollected % 4 === 0) {
    state.aiLevel += 1;
    state.radarPulse = Math.max(state.radarPulse, 0.45);
    addFloater(`AI Lv.${state.aiLevel}`, obj.x, 0.34, "#bdfdff");
    addAiAbsorbIcon(obj.x, obj.z, "升级");
    setHint(`AI能力提升到 Lv.${state.aiLevel}：技能冷却更短，效果更强`);
  } else {
    addAiAbsorbIcon(obj.x, obj.z, "+AI");
    setHint("收集到AI数据包：AI能量上升");
  }
}

function addAiAbsorbIcon(x, z, label) {
  state.floaters.push({
    text: label,
    x,
    y: z,
    color: "#bdfdff",
    life: 1.15,
    icon: "ai",
  });
}

function damageLife(amount, reason) {
  state.life = Math.max(0, state.life - amount);
  state.shake = 1;
  setHint(reason);
}

function damageFocus(amount, reason) {
  state.focus = Math.max(0, state.focus - amount);
  state.shake = 0.65;
  setHint(state.focus < 70 ? `${reason}，视野失焦` : reason);
}

function setHint(text) {
  ui.aiHint.textContent = text;
  window.clearTimeout(setHint.timer);
  setHint.timer = window.setTimeout(() => {
    ui.aiHint.textContent = "车头前缘判定：危险贴近车头才会触发效果。";
  }, 1800);
}

function useSkill(name) {
  if (!state.running || state.ended) return;
  if (!isValidSkill(name)) return;
  if (state.cooldown[name] > 0) return;

  if (name === "horn") {
    const targets = getHornTargets();
    if (targets.length === 0) {
      setHint("智能鸣笛：前方暂无现实目标");
      return;
    }
    if (!spendEnergy(name)) return;
    state.cooldown.horn = getCooldown("horn");
    const moved = useSmartHorn(targets);
    setHint(`${state.upgrades.horn ? "救命喇叭" : "智能鸣笛"}：${moved} 个现实目标避让`);
    return;
  }

  if (!spendEnergy(name)) return;

  if (name === "radar") {
    state.cooldown.radar = getCooldown("radar");
    state.radarPulse = 0.65;
    let hits = 0;
    state.objects.forEach((obj) => {
      if (obj.kind === "ghost" && obj.z < 0.86) {
        obj.hp -= state.aiLevel >= 4 ? 2 : 1;
        if (obj.hp <= 0) {
          disperse(obj);
          hits += 1;
        }
      }
    });
    addEnergy(hits * 3);
    setHint(hits ? `雷达脉冲驱散 ${hits} 个怪谈` : "雷达脉冲扫空了，注意节奏");
  }

  if (name === "night") {
    state.cooldown.night = getCooldown("night");
    state.nightVision = 5.5 + state.aiLevel * 0.45 + (state.upgrades.headlight ? 3.2 : 0);
    setHint(state.upgrades.headlight ? "强光大灯开启：雨夜也得看清路" : "夜视开启：车灯范围扩大");
  }

  if (name === "silence") {
    state.cooldown.silence = getCooldown("silence");
    const hadPopup = state.popupActive;
    closePopup(false);
    state.focus = Math.min(100, state.focus + 14 + state.aiLevel * 2);
    if (hadPopup) state.stats.closed += 1;
    state.radarPulse = Math.max(state.radarPulse, 0.3);
    setHint("AI静音场清除了车机惊扰");
  }
}

function getCooldown(name) {
  const base = { radar: 5.2, horn: 9.5, night: 8.5, silence: 9 }[name];
  return Math.max(base * 0.62, base - (state.aiLevel - 1) * 0.45);
}

function getSkillCost(name) {
  return Math.max(10, skillCosts[name] - (state.aiLevel - 1) * 2);
}

function addEnergy(amount) {
  state.energy = Math.min(100, state.energy + amount);
}

function spendEnergy(name) {
  const cost = getSkillCost(name);
  if (state.energy < cost) {
    setHint(`AI能量不足：${skillLabel(name)}需要 ${cost}% 能量`);
    return false;
  }
  state.energy = Math.max(0, state.energy - cost);
  return true;
}

function skillLabel(name) {
  return {
    radar: "雷达脉冲",
    horn: "智能鸣笛",
    night: "夜视摄像头",
    silence: "AI静音场",
  }[name];
}

function isValidSkill(name) {
  return validSkills.has(name);
}

function getHornTargets() {
  const hitbox = getCarFrontHitbox(canvas.width, canvas.height);
  const hornCone = state.upgrades.horn ? 0.42 : 0.34;
  const maxDepth = state.upgrades.horn ? 0.82 : 0.74;
  const maxTargets = state.upgrades.horn ? 5 : 3;
  return state.objects
    .filter((obj) => {
      if (obj.kind !== "real" || obj.remove || obj.hit || obj.yielding) return false;
      if (obj.z > maxDepth || obj.z < carFront.passedZ) return false;

      const projected = project(obj.x, obj.z, canvas.width, canvas.height);
      const distanceFromCar = Math.abs(projected.x - hitbox.centerX);
      return distanceFromCar < canvas.width * hornCone || hitsCarFront(obj);
    })
    .sort((a, b) => a.z - b.z)
    .slice(0, maxTargets);
}

function useSmartHorn(candidates) {
  let moved = 0;
  candidates.forEach((obj) => {
    const direction = obj.x >= state.carX ? 1 : -1;
    const roadsideX = direction * (state.upgrades.horn ? 1.26 : 1.08);
    obj.drift = direction * (state.upgrades.horn ? 2.6 : 2.1);
    obj.x = clamp(roadsideX, -1.35, 1.35);
    obj.hornSafe = true;
    obj.horned = state.upgrades.horn ? 0.9 : 0.7;
    obj.hornReact = state.upgrades.horn ? 0.9 : 0.7;
    obj.yielding = true;
    obj.yieldDirection = direction;
    moved += 1;
    addFloater("避让", obj.x, obj.z, "#ffd36a");
  });

  if (moved > 0) {
    state.radarPulse = Math.max(state.radarPulse, 0.35);
    addFrontImpact("智能鸣笛", "#ffd36a", state.carX, "horn");
  }
  return moved;
}

function disperse(obj) {
  obj.remove = true;
  state.stats.ghosts += 1;
  addEnergy(3);
  addFloater("+1", obj.x, obj.z, "#49d7ff");
}

function addFloater(text, x, z, color) {
  state.floaters.push({ text, x, y: z, color, life: 1.1 });
}

function addFrontImpact(text, color, x, type) {
  const hitbox = getCarFrontHitbox(canvas.width, canvas.height);
  const maxLife = type === "data" ? 0.78 : 0.95;
  state.impactEffects.push({
    text,
    color,
    x,
    y: hitbox.topY + canvas.height * 0.018,
    radius: type === "data" ? 26 : 36,
    life: maxLife,
    maxLife,
    type,
  });
}

function updateUI() {
  const phase = getPhase();
  ui.lifeFill.style.width = `${state.life}%`;
  ui.lifeText.textContent = `${Math.round(state.life)}%`;
  ui.focusFill.style.width = `${state.focus}%`;
  ui.focusText.textContent = `${Math.round(state.focus)}%`;
  ui.surviveTime.textContent = formatTime(state.levelTime);
  ui.homeTime.textContent = `本关剩余 ${formatTime(phase.duration - state.levelTime)}`;
  ui.timeProgress.style.transform = `scaleX(${1 - clamp(state.levelTime / phase.duration, 0, 1)})`;
  ui.phaseText.textContent = phase.title;
  ui.energyFill.style.width = `${state.energy}%`;
  ui.energyFill.parentElement.style.setProperty("--energy-level", `${state.energy}%`);
  ui.energyText.textContent = `${Math.round(state.energy)}%`;
  ui.aiLevelText.textContent = `AI Lv.${state.aiLevel}`;
  ui.energyIcon.classList.toggle("absorb", state.energyAbsorb > 0);

  Object.entries(state.cooldown).forEach(([key, value]) => {
    const cost = getSkillCost(key);
    const button = document.querySelector(`[data-skill="${key}"]`);
    if (value > 0) {
      ui.cooldowns[key].textContent = `${value.toFixed(1)}s`;
    } else {
      ui.cooldowns[key].textContent = state.energy >= cost ? `需${cost}%能量` : `能量不足`;
    }
    button.disabled = value > 0;
    button.classList.toggle("low-energy", value <= 0 && state.energy < cost);
  });

  drawRadar();
}

function draw() {
  const w = canvas.width;
  const h = canvas.height;
  const shakeX = (Math.random() - 0.5) * state.shake * 12;
  const shakeY = (Math.random() - 0.5) * state.shake * 8;

  ctx.save();
  ctx.translate(shakeX, shakeY);
  drawSceneEnvironment(w, h);
  drawHeadlights(w, h);
  drawObjects(w, h);
  drawCockpit(w, h);
  drawEffects(w, h);
  drawFocusDistortion(w, h);
  ctx.restore();
}

function drawSceneEnvironment(w, h) {
  const phase = getPhase();
  const video = phase.id === "dusk" ? ui.stageOneVideo : null;
  if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    const parallaxX = clamp(state.carX * 10, -14, 14);
    drawImageCover(video, -12 - parallaxX, -6, w + 24, h + 12);
    drawVideoMood(w, h);
    return;
  }

  const background = getLoadedImage(GAME_ASSETS.backgrounds[phase.id]);
  if (!background) {
    drawSky(w, h);
    drawRoad(w, h);
    return;
  }

  const parallaxX = clamp(state.carX * 18, -24, 24);
  ctx.drawImage(background, -18 - parallaxX, -8, w + 36, h + 18);

  const mood = ctx.createLinearGradient(0, 0, 0, h);
  if (phase.id === "dusk") {
    mood.addColorStop(0, "rgba(42, 24, 60, 0.12)");
    mood.addColorStop(1, "rgba(0, 0, 0, 0.24)");
  } else if (phase.id === "oldtown") {
    mood.addColorStop(0, "rgba(8, 20, 44, 0.18)");
    mood.addColorStop(1, "rgba(0, 0, 0, 0.34)");
  } else {
    mood.addColorStop(0, "rgba(78, 8, 22, 0.18)");
    mood.addColorStop(1, "rgba(0, 0, 0, 0.42)");
  }
  ctx.fillStyle = mood;
  ctx.fillRect(0, 0, w, h);
  drawRoadMotionOverlay(w, h);
}

function drawVideoMood(w, h) {
  const vignette = ctx.createRadialGradient(w / 2, h * 0.48, h * 0.18, w / 2, h * 0.5, h * 0.78);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.22)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(12, 28, 48, 0.08)";
  ctx.fillRect(0, 0, w, h);
}

function drawRoadMotionOverlay(w, h) {
  const horizon = h * ROAD_VANISH_Y_RATIO;
  const speed = 340 + getPhase().speed * 120;
  const centerShift = -state.carX * w * 0.08;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 34; i += 1) {
    const t = ((i * 47 + state.time * speed) % (h - horizon)) / (h - horizon);
    const depth = t * t;
    const y = horizon + depth * (h - horizon);
    const half = w * (0.035 + depth * 0.42);
    const alpha = 0.05 + depth * 0.24;
    ctx.strokeStyle = `rgba(190, 230, 255, ${alpha})`;
    ctx.lineWidth = 1 + depth * 4;
    ctx.beginPath();
    ctx.moveTo(w / 2 + centerShift - half, y);
    ctx.lineTo(w / 2 + centerShift - half * 1.35, y + 12 + depth * 38);
    ctx.moveTo(w / 2 + centerShift + half, y);
    ctx.lineTo(w / 2 + centerShift + half * 1.35, y + 12 + depth * 38);
    ctx.stroke();
  }

  for (let i = 0; i < 18; i += 1) {
    const t = ((i * 73 + state.time * (speed * 0.62)) % (h - horizon)) / (h - horizon);
    const depth = Math.pow(t, 1.7);
    const y = horizon + depth * (h - horizon);
    const width = w * (0.08 + depth * 0.5);
    ctx.fillStyle = `rgba(255, 246, 188, ${0.035 + depth * 0.12})`;
    ctx.fillRect(w / 2 - width / 2 + centerShift, y, width, 2 + depth * 5);
  }

  ctx.restore();
}

function drawSky(w, h) {
  const phase = getPhase();
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.68);
  if (phase.id === "dusk") {
    sky.addColorStop(0, "#29345b");
    sky.addColorStop(0.42, "#51283d");
    sky.addColorStop(1, "#080b13");
  } else if (phase.id === "oldtown") {
    sky.addColorStop(0, "#121b35");
    sky.addColorStop(0.42, "#161728");
    sky.addColorStop(1, "#05080f");
  } else {
    sky.addColorStop(0, "#1a1022");
    sky.addColorStop(0.4, "#3a0815");
    sky.addColorStop(1, "#030408");
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 22; i += 1) {
    const x = ((i * 173 + state.time * 22) % (w + 240)) - 120;
    const y = h * 0.16 + (i % 5) * 34;
    const height = 72 + (i % 4) * 34;
    ctx.fillStyle = phase.id === "midnight"
      ? (i % 3 === 0 ? "rgba(34, 12, 28, 0.82)" : "rgba(12, 14, 24, 0.78)")
      : (i % 3 === 0 ? "rgba(20, 35, 55, 0.78)" : "rgba(12, 24, 38, 0.72)");
    ctx.fillRect(x, y, 52 + (i % 4) * 24, height);
    ctx.fillStyle = i % 4 === 0 ? "rgba(255, 73, 98, 0.62)" : "rgba(76, 210, 255, 0.48)";
    ctx.fillRect(x + 8, y + 14, 20, 5);
  }

  const lanterns = phase.id === "dusk" ? 5 : phase.id === "oldtown" ? 8 : 13;
  for (let i = 0; i < lanterns; i += 1) {
    const x = (i * 190 - (state.time * 80) % 190) + 20;
    ctx.fillStyle = "rgba(255, 56, 76, 0.7)";
    ctx.beginPath();
    ctx.ellipse(x, h * 0.34 + (i % 2) * 28, 11, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 170, 120, 0.5)";
    ctx.stroke();
  }
}

function drawRoad(w, h) {
  const horizon = h * ROAD_VANISH_Y_RATIO;
  const roadTop = w * 0.16;
  const roadBottom = w * 1.02;

  ctx.fillStyle = "rgba(4, 7, 11, 0.78)";
  ctx.beginPath();
  ctx.moveTo(w / 2 - roadTop / 2, horizon);
  ctx.lineTo(w / 2 + roadTop / 2, horizon);
  ctx.lineTo(w / 2 + roadBottom / 2 + state.carX * 80, h);
  ctx.lineTo(w / 2 - roadBottom / 2 + state.carX * 80, h);
  ctx.closePath();
  ctx.fill();

  const roadGradient = ctx.createLinearGradient(0, horizon, 0, h);
  roadGradient.addColorStop(0, "rgba(40, 44, 56, 0.62)");
  roadGradient.addColorStop(1, "rgba(8, 10, 14, 0.94)");
  ctx.fillStyle = roadGradient;
  ctx.beginPath();
  ctx.moveTo(w / 2 - roadTop / 2, horizon);
  ctx.lineTo(w / 2 + roadTop / 2, horizon);
  ctx.lineTo(w / 2 + roadBottom / 2 + state.carX * 80, h);
  ctx.lineTo(w / 2 - roadBottom / 2 + state.carX * 80, h);
  ctx.closePath();
  ctx.fill();

  for (let lane = -2; lane <= 2; lane += 1) {
    const offset = lane * 0.18;
    ctx.strokeStyle = lane === 0 ? "rgba(220, 245, 255, 0.45)" : "rgba(220, 245, 255, 0.2)";
    ctx.lineWidth = lane === 0 ? 3 : 2;
    ctx.setLineDash([24, 24]);
    ctx.lineDashOffset = -state.time * 120;
    ctx.beginPath();
    ctx.moveTo(projectX(offset, 1), horizon);
    ctx.lineTo(projectX(offset - state.carX * 0.12, 0.08), h);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  for (let i = 0; i < 24; i += 1) {
    const y = horizon + ((i * 42 + state.time * 260) % (h - horizon));
    const width = (y - horizon) / (h - horizon);
    ctx.fillStyle = `rgba(96, 210, 255, ${0.05 + width * 0.16})`;
    ctx.fillRect(w * 0.22 + width * 90, y, w * 0.56 - width * 180, 2);
  }
}

function drawHeadlights(w, h) {
  const light = getLoadedImage(GAME_ASSETS.foreground.headlights);
  if (!light) return;

  const motion = getCarVisualMotion(w);
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = state.upgrades.headlight || state.nightVision > 0 ? 0.3 : 0.22;
  drawImageCover(light, w * 0.02 + motion.offsetX * 0.16, h * 0.3, w * 0.96, h * 0.6);
  ctx.restore();
}

function drawObjects(w, h) {
  const ordered = [...state.objects].sort((a, b) => b.z - a.z);
  ordered.forEach((obj) => {
    const p = project(obj.x, obj.z, w, h);
    const scale = p.scale;
    if (obj.kind === "real") {
      drawReal(obj, p.x, p.y, scale);
    } else if (obj.kind === "data") {
      drawDataPack(obj, p.x, p.y, scale);
    } else {
      drawGhost(obj, p.x, p.y, scale);
    }
  });

  drawHitSprites(w, h);

  state.floaters.forEach((floater) => {
    const p = project(floater.x, floater.y, w, h);
    ctx.globalAlpha = Math.max(0, floater.life);
    if (floater.icon === "ai") {
      drawAiAbsorbIcon(p.x, p.y, p.scale, floater);
      ctx.globalAlpha = 1;
      return;
    }
    ctx.fillStyle = floater.color;
    ctx.font = `${Math.max(18, p.scale * 24)}px sans-serif`;
    ctx.font = "700 " + ctx.font;
    ctx.fillText(floater.text, p.x + 12, p.y - 28);
    ctx.globalAlpha = 1;
  });
}

function drawAiAbsorbIcon(x, y, scale, floater) {
  const alpha = Math.max(0, floater.life);
  const size = Math.max(20, 22 * scale);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x + 18 * scale, y - 42 * scale - (1 - alpha) * 22);
  ctx.fillStyle = "rgba(73, 215, 255, 0.22)";
  ctx.beginPath();
  ctx.arc(0, 0, size * 1.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(189, 253, 255, 0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.68, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.68, 0);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "rgba(73, 215, 255, 0.72)";
  ctx.fill();
  ctx.fillStyle = "#d9ffff";
  ctx.font = `900 ${Math.max(12, 13 * scale)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(floater.text, 0, size + 18);
  ctx.textAlign = "start";
  ctx.restore();
}

function drawHitSprites(w, h) {
  state.hitSprites.forEach((effect) => {
    const t = clamp(effect.age / effect.maxLife, 0, 1);
    const x = effect.x + effect.direction * (effect.type === "real" ? t * 0.34 : t * 0.08);
    const z = effect.type === "real" ? effect.z - t * 0.06 : effect.z + t * 0.02;
    const p = project(x, z, w, h);
    const image = getSpriteImage(effect.objectType.assetKey);
    if (!image) return;

    if (effect.type === "real") {
      drawSpriteAsset(image, p.x, p.y - t * 58, p.scale * (1 + t * 0.08), {
        height: effect.objectType.shape === "scooter" || effect.objectType.shape === "rider" ? 126 : 116,
        anchorY: 0.8,
        alpha: 1 - t,
        rotation: effect.direction * (0.12 + t * 0.34),
        shadowColor: "rgba(255, 93, 108, 0.18)",
      });
      return;
    }

    drawSpriteAsset(image, p.x, p.y - t * 18, p.scale * (1 + t * 0.46), {
      height: effect.objectType.shape === "bride" ? 142 : 124,
      anchorY: 0.78,
      alpha: 1 - t,
      rotation: effect.direction * t * 0.28,
      glowColor: "rgba(255, 55, 120, 0.85)",
      shadowColor: "rgba(179, 124, 255, 0.2)",
    });
  });
}

function drawSpriteAsset(image, x, y, scale, options = {}) {
  if (!image) return false;
  const height = (options.height || 120) * scale;
  const width = height * (image.naturalWidth / image.naturalHeight);
  const anchorY = options.anchorY ?? 0.82;
  const drawX = -width / 2;
  const drawY = -height * anchorY;

  ctx.save();
  ctx.translate(x, y);
  if (options.rotation) ctx.rotate(options.rotation);
  ctx.globalAlpha = options.alpha ?? 1;

  if (options.shadowColor) {
    ctx.fillStyle = options.shadowColor;
    ctx.beginPath();
    ctx.ellipse(0, height * (1 - anchorY) * 0.78, width * 0.34, height * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (options.glowColor) {
    ctx.shadowColor = options.glowColor;
    ctx.shadowBlur = 22 * scale;
  }

  if (options.scaleX || options.scaleY) ctx.scale(options.scaleX || 1, options.scaleY || 1);
  ctx.drawImage(image, drawX, drawY, width, height);
  ctx.restore();
  return true;
}

function drawDataPack(obj, x, y, s) {
  const image = getSpriteImage("data-pack");
  if (image) {
    const pulse = 1 + Math.sin(obj.targetPulse * 8) * 0.08;
    drawSpriteAsset(image, x, y, s * pulse, {
      height: 78,
      anchorY: 0.58,
      glowColor: "rgba(73, 215, 255, 0.9)",
      shadowColor: "rgba(73, 215, 255, 0.18)",
    });
    return;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  const pulse = 1 + Math.sin(obj.targetPulse * 8) * 0.08;
  ctx.fillStyle = "rgba(73, 215, 255, 0.16)";
  ctx.beginPath();
  ctx.ellipse(0, 4, 46 * pulse, 18 * pulse, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(189, 253, 255, 0.84)";
  ctx.lineWidth = 3 / s;
  ctx.beginPath();
  ctx.moveTo(0, -44 * pulse);
  ctx.lineTo(26 * pulse, -14 * pulse);
  ctx.lineTo(0, 22 * pulse);
  ctx.lineTo(-26 * pulse, -14 * pulse);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = "rgba(73, 215, 255, 0.7)";
  ctx.fill();
  ctx.fillStyle = "#e9ffff";
  ctx.font = "800 12px sans-serif";
  ctx.fillText("AI数据", -22, 42);
  ctx.restore();
}

function drawReal(obj, x, y, s) {
  const type = obj.type;
  const react = obj.hornReact ? obj.hornReact / (state.upgrades.horn ? 0.55 : 0.38) : 0;
  const baseYieldOffset = obj.yielding ? obj.yieldDirection * (state.upgrades.horn ? 88 : 54) : 0;
  const reactBoost = obj.hornReact ? obj.yieldDirection * (state.upgrades.horn ? 18 : 12) * easeOutCubic(clamp(react, 0, 1)) : 0;
  const yieldOffset = baseYieldOffset + reactBoost;
  const image = getSpriteImage(type.assetKey);

  if (image) {
    const wobble = obj.hornReact ? obj.yieldDirection * 0.08 * easeOutCubic(clamp(react, 0, 1)) : 0;
    const walk = Math.sin(obj.targetPulse * 9);
    const near = clamp((1 - obj.z - 0.55) / 0.45, 0, 1);
    drawSpriteAsset(image, x + yieldOffset + walk * near * 5, y - Math.abs(walk) * near * 6, s, {
      height: type.shape === "scooter" || type.shape === "rider" ? 126 : 116,
      anchorY: 0.8,
      rotation: wobble,
      scaleX: 1 + walk * near * 0.025,
      scaleY: 1 - Math.abs(walk) * near * 0.025,
      shadowColor: "rgba(255, 215, 142, 0.16)",
    });

    return;
  }

  ctx.save();
  ctx.translate(x + yieldOffset, y);
  ctx.scale(s, s);
  ctx.fillStyle = "rgba(255, 245, 200, 0.16)";
  ctx.beginPath();
  ctx.ellipse(0, 8, 50, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  if (type.shape === "rider" || type.shape === "scooter") {
    ctx.strokeStyle = type.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(-18, 16, 11, 0, Math.PI * 2);
    ctx.arc(20, 16, 11, 0, Math.PI * 2);
    ctx.moveTo(-18, 16);
    ctx.lineTo(2, -4);
    ctx.lineTo(20, 16);
    ctx.stroke();
    ctx.fillStyle = type.color;
    ctx.fillRect(-2, -34, 12, 28);
    ctx.beginPath();
    ctx.arc(4, -42, 8, 0, Math.PI * 2);
    ctx.fill();
    if (type.shape === "rider") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(14, -42, 12, 8);
    } else {
      ctx.fillStyle = "#ff6b8a";
      ctx.beginPath();
      ctx.arc(-18, -20, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = type.color;
    ctx.fillRect(-9, -32, 18, 42);
    ctx.beginPath();
    ctx.arc(0, -42, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = type.shape === "worker" ? "#dfff76" : "rgba(255,255,255,0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-16, -8);
    ctx.lineTo(16, -8);
    ctx.stroke();
    if (type.shape === "child") {
      ctx.fillStyle = "#e6f8ff";
      ctx.beginPath();
      ctx.arc(26, 10, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawGhost(obj, x, y, s) {
  const type = obj.type;
  const image = getSpriteImage(type.assetKey);
  const pulse = 1 + Math.sin(obj.targetPulse * 7) * 0.05;

  if (image) {
    drawSpriteAsset(image, x, y, s * pulse, {
      height: type.shape === "bride" ? 142 : 124,
      anchorY: 0.78,
      alpha: type.shape === "mist" ? 0.86 : 0.96,
      glowColor: type.shape === "lantern" || type.shape === "bride"
        ? "rgba(255, 55, 82, 0.82)"
        : "rgba(116, 202, 255, 0.72)",
      shadowColor: "rgba(179, 124, 255, 0.18)",
    });

    return;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  ctx.fillStyle = type.color;
  ctx.globalAlpha = type.shape === "mist" ? 0.48 : 0.9;
  if (type.shape === "lantern") {
    ctx.beginPath();
    ctx.ellipse(0, -24, 18, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffd36a";
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.lineTo(0, 24);
    ctx.stroke();
  } else if (type.shape === "paper") {
    ctx.fillRect(-16, -56, 32, 72);
    ctx.fillStyle = "#ff4d67";
    ctx.fillRect(-8, -40, 16, 4);
  } else if (type.shape === "bride") {
    ctx.beginPath();
    ctx.moveTo(0, -66);
    ctx.lineTo(28, 24);
    ctx.lineTo(-28, 24);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1b0711";
    ctx.fillRect(-7, -48, 14, 38);
  } else {
    ctx.beginPath();
    ctx.ellipse(0, -30, 20, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-16, -24, 32, 42);
  }
  ctx.globalAlpha = 1;

  ctx.restore();
}

function drawCockpit(w, h) {
  const drewHood = drawMovableCarHood(w, h);
  const drewCockpit = drawGeneratedCockpitForeground(w, h);
  if (drewHood || drewCockpit) return;

  const motion = getCarVisualMotion(w);
  drawWindshieldFrame(w, h, motion);

  const dash = ctx.createLinearGradient(0, h * 0.76, 0, h);
  dash.addColorStop(0, "rgba(4, 10, 18, 0.08)");
  dash.addColorStop(0.32, "rgba(5, 11, 18, 0.72)");
  dash.addColorStop(1, "rgba(1, 4, 8, 0.98)");
  ctx.fillStyle = dash;
  ctx.fillRect(0, h * 0.74, w, h * 0.26);
  drawGeneratedCockpitForeground(w, h);

  drawCarFrontZone(w, h);
}

function drawGeneratedCockpitForeground(w, h) {
  const cockpit = getLoadedImage(GAME_ASSETS.foreground.cockpit);
  if (!cockpit) return false;

  ctx.save();
  ctx.globalAlpha = 0.96;
  drawImageCover(cockpit, 0, 0, w, h);
  ctx.restore();
  return true;
}

function drawMovableCarHood(w, h) {
  const hood = getLoadedImage(GAME_ASSETS.foreground.hood);
  if (!hood) return false;

  const motion = getCarVisualMotion(w);
  const hoodWidth = w * 0.78;
  const hoodHeight = hoodWidth * ((hood.naturalHeight || hood.height) / (hood.naturalWidth || hood.width));
  const x = w / 2 - hoodWidth / 2 + motion.offsetX * 0.55;
  const y = h * 0.685;

  ctx.save();
  ctx.translate(x + hoodWidth / 2, y + hoodHeight * 0.92);
  ctx.rotate(motion.tilt * 0.24);
  ctx.translate(-(x + hoodWidth / 2), -(y + hoodHeight * 0.92));
  ctx.globalAlpha = 0.98;
  ctx.drawImage(hood, x, y, hoodWidth, hoodHeight);
  ctx.restore();

  drawHoodConnectionShadow(w, h, motion);
  return true;
}

function drawHoodConnectionShadow(w, h, motion) {
  const center = w / 2 + motion.offsetX * 0.2;
  const y = h * 0.756;

  ctx.save();
  const shadow = ctx.createLinearGradient(0, y - h * 0.035, 0, y + h * 0.07);
  shadow.addColorStop(0, "rgba(1, 4, 9, 0)");
  shadow.addColorStop(0.48, "rgba(1, 5, 10, 0.46)");
  shadow.addColorStop(1, "rgba(1, 5, 10, 0)");
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(center, y + h * 0.014, w * 0.31, h * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(94, 213, 242, 0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(center - w * 0.25, y);
  ctx.quadraticCurveTo(center, y - h * 0.025, center + w * 0.25, y);
  ctx.stroke();
  ctx.restore();
}

function drawImageCover(image, dx, dy, dw, dh) {
  const iw = image.videoWidth || image.naturalWidth || image.width;
  const ih = image.videoHeight || image.naturalHeight || image.height;
  if (!iw || !ih) return;
  const scale = Math.max(dw / iw, dh / ih);
  const sw = dw / scale;
  const sh = dh / scale;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
}

function drawWindshieldFrame(w, h, motion) {
  ctx.save();
  const pillar = ctx.createLinearGradient(0, h * 0.18, 0, h);
  pillar.addColorStop(0, "rgba(8, 12, 18, 0.12)");
  pillar.addColorStop(1, "rgba(2, 5, 9, 0.92)");

  ctx.fillStyle = pillar;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w * 0.105, 0);
  ctx.quadraticCurveTo(w * 0.145, h * 0.38, w * 0.19 + motion.offsetX * 0.08, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w, 0);
  ctx.lineTo(w * 0.895, 0);
  ctx.quadraticCurveTo(w * 0.855, h * 0.38, w * 0.81 + motion.offsetX * 0.08, h);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(189, 253, 255, 0.16)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.118, h * 0.02);
  ctx.quadraticCurveTo(w * 0.16, h * 0.42, w * 0.205, h * 0.78);
  ctx.moveTo(w * 0.882, h * 0.02);
  ctx.quadraticCurveTo(w * 0.84, h * 0.42, w * 0.795, h * 0.78);
  ctx.stroke();

  const reflection = ctx.createLinearGradient(w * 0.14, h * 0.12, w * 0.76, h * 0.72);
  reflection.addColorStop(0, "rgba(255, 255, 255, 0)");
  reflection.addColorStop(0.46, "rgba(210, 240, 255, 0.08)");
  reflection.addColorStop(0.52, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = reflection;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawEffects(w, h) {
  drawFrontImpacts(w, h);

  if (state.brakeFlash > 0) {
    ctx.fillStyle = `rgba(255, 65, 82, ${state.brakeFlash * 0.18})`;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = `rgba(255, 65, 82, ${state.brakeFlash * 0.55})`;
    ctx.font = "900 30px sans-serif";
    ctx.fillText("现实碰撞 / 生命下降", w * 0.39, h * 0.31);
  }

  if (state.ghostFlash > 0) {
    ctx.fillStyle = `rgba(111, 78, 255, ${state.ghostFlash * 0.16})`;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = `rgba(184, 134, 255, ${state.ghostFlash * 0.62})`;
    ctx.font = "900 30px sans-serif";
    ctx.fillText("惊扰 / 专注下降", w * 0.4, h * 0.31);
  }

  if (state.radarPulse > 0) {
    const t = 1 - state.radarPulse / 0.65;
    const hitbox = getCarFrontHitbox(w, h);
    ctx.strokeStyle = `rgba(73, 215, 255, ${1 - t})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(hitbox.centerX, h * 0.72, 100 + t * 520, 34 + t * 180, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  const phase = getPhase();
  const rainCount = phase.id === "dusk" ? 22 : phase.id === "oldtown" ? 40 : 62;
  ctx.strokeStyle = phase.id === "midnight" ? "rgba(255,210,220,0.2)" : "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  for (let i = 0; i < rainCount; i += 1) {
    const x = (i * 87 + state.time * 240) % canvas.width;
    const y = (i * 53 + state.time * 420) % canvas.height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 9, y + 24);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(210, 240, 255, 0.28)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(canvas.width * 0.52, canvas.height * 0.43, 360, 0.34, 0.7);
  ctx.stroke();
}

function drawFocusDistortion(w, h) {
  const focusLoss = clamp(1 - state.focus / 100, 0, 1);
  const soft = clamp((70 - state.focus) / 30, 0, 1);
  const heavy = clamp((40 - state.focus) / 20, 0, 1);
  const critical = clamp((20 - state.focus) / 20, 0, 1);
  if (focusLoss <= 0.3) return;

  ctx.save();

  const offset = 2 + soft * 3 + heavy * 5 + critical * 8;
  const ghostAlpha = 0.035 + soft * 0.035 + heavy * 0.045 + critical * 0.06;
  ctx.globalAlpha = ghostAlpha;
  ctx.drawImage(canvas, -offset, 0);
  ctx.drawImage(canvas, offset * 0.7, 0);

  if (heavy > 0) {
    ctx.globalAlpha = 0.04 + heavy * 0.08 + critical * 0.08;
    ctx.drawImage(canvas, -offset * 0.5, offset * 0.38);
    ctx.drawImage(canvas, offset * 0.42, -offset * 0.32);
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = `rgba(169, 193, 215, ${0.04 + soft * 0.08 + heavy * 0.08 + critical * 0.1})`;
  ctx.fillRect(0, 0, w, h);

  const vignette = ctx.createRadialGradient(w / 2, h * 0.48, w * 0.18, w / 2, h * 0.5, w * 0.72);
  vignette.addColorStop(0, `rgba(20, 28, 40, ${critical * 0.12})`);
  vignette.addColorStop(0.62, `rgba(16, 13, 26, ${0.08 + heavy * 0.1})`);
  vignette.addColorStop(1, `rgba(0, 0, 0, ${0.28 + soft * 0.18 + heavy * 0.2 + critical * 0.16})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = `rgba(225, 238, 255, ${0.1 + soft * 0.08 + heavy * 0.12})`;
  ctx.lineWidth = 2 + heavy * 2;
  const rainCount = Math.floor(18 + soft * 20 + heavy * 28 + critical * 22);
  for (let i = 0; i < rainCount; i += 1) {
    const x = (i * 71 + state.time * (310 + heavy * 130)) % (w + 160) - 80;
    const y = (i * 43 + state.time * (460 + heavy * 220)) % (h + 120) - 60;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 10 - heavy * 8, y + 30 + heavy * 18);
    ctx.stroke();
  }

  if (heavy > 0) {
    ctx.fillStyle = `rgba(151, 110, 255, ${heavy * 0.08 + critical * 0.1})`;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = `rgba(220, 235, 255, ${heavy * 0.08})`;
    ctx.font = "900 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("专注下降：视野失焦", w / 2, h * 0.36);
    ctx.textAlign = "start";
  }

  if (critical > 0) {
    const tunnel = ctx.createRadialGradient(w / 2, h * 0.5, w * 0.04, w / 2, h * 0.5, w * 0.46);
    tunnel.addColorStop(0, `rgba(255, 255, 255, ${critical * 0.05})`);
    tunnel.addColorStop(0.36, `rgba(20, 18, 35, ${critical * 0.18})`);
    tunnel.addColorStop(1, `rgba(0, 0, 0, ${critical * 0.42})`);
    ctx.fillStyle = tunnel;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.restore();
}

function drawFrontImpacts(w, h) {
  const frontCenter = project(state.carX, 0.12, w, h);
  state.impactEffects.forEach((effect) => {
    const alpha = Math.max(0, effect.life);
    const xOffset = (effect.x - state.carX) * 220;
    const x = frontCenter.x + xOffset;
    const y = effect.y;

    const t = 1 - alpha / effect.maxLife;

    ctx.save();
    ctx.globalAlpha = Math.min(1, alpha * 1.45);

    if (effect.type === "real") {
      ctx.fillStyle = `rgba(255, 93, 108, ${0.08 + alpha * 0.1})`;
      ctx.fillRect(0, 0, w, h);
      const burst = ctx.createRadialGradient(x, y, 4, x, y, effect.radius * 2.25);
      burst.addColorStop(0, "rgba(255, 230, 185, 0.72)");
      burst.addColorStop(0.28, "rgba(255, 93, 108, 0.42)");
      burst.addColorStop(1, "rgba(255, 93, 108, 0)");
      ctx.fillStyle = burst;
      ctx.beginPath();
      ctx.arc(x, y, effect.radius * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 216, 178, ${0.75 * alpha})`;
      ctx.lineWidth = 2 + alpha * 3;
      ctx.beginPath();
      ctx.arc(x, y, effect.radius * (0.9 + t * 0.7), Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
    }

    if (effect.type === "ghost") {
      const bloom = ctx.createRadialGradient(x, y, 2, x, y, effect.radius * 2.35);
      bloom.addColorStop(0, "rgba(255, 80, 120, 0.48)");
      bloom.addColorStop(0.42, "rgba(179, 124, 255, 0.24)");
      bloom.addColorStop(1, "rgba(40, 6, 80, 0)");
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(x, y, effect.radius * 2.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 92, 132, ${0.58 * alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, effect.radius * (0.55 + t * 1.15), 0, Math.PI * 2);
      ctx.stroke();
    }

    if (effect.type === "data") {
      ctx.fillStyle = "rgba(73, 215, 255, 0.24)";
      ctx.beginPath();
      ctx.arc(x, y, effect.radius * 0.68, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(189, 253, 255, 0.9)";
      ctx.beginPath();
      ctx.moveTo(x, y - effect.radius);
      ctx.lineTo(x + effect.radius, y);
      ctx.lineTo(x, y + effect.radius);
      ctx.lineTo(x - effect.radius, y);
      ctx.closePath();
      ctx.stroke();
    }

    if (effect.type === "block") {
      ctx.fillStyle = "rgba(73, 215, 255, 0.18)";
      ctx.fillRect(x - 54, y - 30, 108, 60);
      ctx.strokeStyle = "rgba(189, 253, 255, 0.92)";
      ctx.strokeRect(x - 54, y - 30, 108, 60);
    }

    ctx.fillStyle = effect.color;
    ctx.font = "900 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(effect.text, x, y - effect.radius - 14);
    ctx.textAlign = "start";
    ctx.restore();
  });
}

function drawCarFrontZone(w, h) {
  const hitbox = getCarFrontHitbox(w, h);
  const center = hitbox.centerX;
  const frontY = hitbox.topY;
  const halfTop = hitbox.topHalf;
  const halfBottom = hitbox.bottomHalf;
  const activeBottomY = hitbox.activeBottomY;
  const activeHalfBottom = hitbox.activeBottomHalf;
  const impactGlow = Math.min(1, state.impactEffects.reduce((max, effect) => Math.max(max, effect.life), 0));

  const hoodGradient = ctx.createLinearGradient(0, frontY, 0, h);
  hoodGradient.addColorStop(0, "rgba(88, 118, 136, 0.34)");
  hoodGradient.addColorStop(0.36, "rgba(31, 47, 61, 0.72)");
  hoodGradient.addColorStop(1, "rgba(4, 9, 15, 0.96)");
  ctx.fillStyle = hoodGradient;
  ctx.beginPath();
  ctx.moveTo(center - halfTop * 1.08, frontY);
  ctx.quadraticCurveTo(center, frontY - h * 0.028, center + halfTop * 1.08, frontY);
  ctx.lineTo(center + halfBottom, h);
  ctx.lineTo(center - halfBottom, h);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(225, 246, 255, 0.24)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(center - halfTop * 1.1, frontY);
  ctx.quadraticCurveTo(center, frontY - h * 0.03, center + halfTop * 1.1, frontY);
  ctx.stroke();

  ctx.strokeStyle = "rgba(92, 205, 230, 0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(center - activeHalfBottom, activeBottomY);
  ctx.lineTo(center - halfBottom, h);
  ctx.moveTo(center + activeHalfBottom, activeBottomY);
  ctx.lineTo(center + halfBottom, h);
  ctx.stroke();

  ctx.fillStyle = "rgba(2, 5, 10, 0.42)";
  ctx.beginPath();
  ctx.ellipse(center, h * 0.94, w * 0.18, h * 0.075, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(73, 215, 255, 0.22)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(center, h * 0.98, w * 0.13, Math.PI * 1.08, Math.PI * 1.92);
  ctx.stroke();

  ctx.strokeStyle = impactGlow > 0 ? `rgba(255, 94, 104, ${0.72 + impactGlow * 0.22})` : "rgba(165, 230, 245, 0.26)";
  ctx.lineWidth = impactGlow > 0 ? 6 : 2;
  ctx.beginPath();
  ctx.moveTo(center - halfTop, frontY);
  ctx.lineTo(center + halfTop, frontY);
  ctx.lineTo(center + activeHalfBottom, activeBottomY);
  ctx.lineTo(center - activeHalfBottom, activeBottomY);
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = "rgba(165, 230, 245, 0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(center - halfTop, frontY);
  ctx.lineTo(center - activeHalfBottom, activeBottomY);
  ctx.moveTo(center + halfTop, frontY);
  ctx.lineTo(center + activeHalfBottom, activeBottomY);
  ctx.stroke();

  ctx.fillStyle = impactGlow > 0 ? `rgba(255, 94, 104, ${0.18 + impactGlow * 0.18})` : "rgba(185, 235, 245, 0.06)";
  ctx.fillRect(center - halfTop, frontY - 10, halfTop * 2, 20);

}

function drawRadar() {
  const w = radarCanvas.width;
  const h = radarCanvas.height;
  radar.clearRect(0, 0, w, h);
  radar.fillStyle = "rgba(73, 215, 255, 0.025)";
  radar.beginPath();
  radar.arc(w / 2, h / 2, 50, 0, Math.PI * 2);
  radar.fill();
  radar.strokeStyle = "rgba(73, 215, 255, 0.28)";
  radar.lineWidth = 2;
  radar.beginPath();
  radar.arc(w / 2, h / 2, 50, 0, Math.PI * 2);
  radar.stroke();
  radar.strokeStyle = "rgba(73, 215, 255, 0.16)";
  radar.beginPath();
  radar.moveTo(w / 2, h / 2);
  radar.lineTo(w / 2, 6);
  radar.stroke();

  state.objects.forEach((obj) => {
    const rx = w / 2 + obj.x * 42;
    const ry = h - obj.z * 82;
    radar.fillStyle = obj.kind === "ghost" ? "#49d7ff" : obj.kind === "data" ? "#d9ffff" : "#ffd36a";
    radar.beginPath();
    radar.arc(rx, ry, obj.kind === "ghost" ? 4 : obj.kind === "data" ? 5 : 3, 0, Math.PI * 2);
    radar.fill();
  });
}

function layoutBox(screenName, layerName, id) {
  return manualLayout?.screens?.[screenName]?.[layerName]?.find((box) => box.id === id) || null;
}

function percent(value, total) {
  return `${(value / total) * 100}%`;
}

function setCanvasBounds(element, box) {
  if (!element || !box) return;
  element.classList.add("layout-box");
  element.style.left = percent(box.x, LAYOUT_COORDINATE_WIDTH);
  element.style.top = percent(box.y, LAYOUT_COORDINATE_HEIGHT);
  element.style.width = percent(box.w, LAYOUT_COORDINATE_WIDTH);
  element.style.height = percent(box.h, LAYOUT_COORDINATE_HEIGHT);
}

function setRelativeBounds(element, box, parentBox) {
  if (!element || !box || !parentBox) return;
  element.classList.add("layout-text");
  element.style.left = percent(box.x - parentBox.x, parentBox.w);
  element.style.top = percent(box.y - parentBox.y, parentBox.h);
  element.style.width = percent(box.w, parentBox.w);
  element.style.height = percent(box.h, parentBox.h);
}

function setRelativeVisualBounds(element, box, parentBox) {
  if (!element || !box || !parentBox) return;
  element.classList.add("layout-box");
  element.style.left = percent(box.x - parentBox.x, parentBox.w);
  element.style.top = percent(box.y - parentBox.y, parentBox.h);
  element.style.width = percent(box.w, parentBox.w);
  element.style.height = percent(box.h, parentBox.h);
}

function applyGameplayLayout(layout) {
  const gameplay = layout?.screens?.gameplay;
  if (!gameplay || !ui.cockpit) return;
  manualLayout = layout;
  ui.cockpit.classList.add("layout-manual");

  const visualTargets = {
    topHudPanel: document.querySelector(".top-hud-skin"),
    lifeCard: document.querySelector(".life-card"),
    timerCard: document.querySelector(".timer-card"),
    radarCard: document.querySelector(".radar-card"),
    disturbanceCall: ui.disturbance,
    skillQ: document.querySelector('[data-skill="radar"]'),
    skillW: document.querySelector('[data-skill="horn"]'),
    skillE: document.querySelector('[data-skill="night"]'),
    skillR: document.querySelector('[data-skill="silence"]'),
    energyCard: document.querySelector(".energy-card"),
  };

  Object.entries(visualTargets).forEach(([id, element]) => {
    setCanvasBounds(element, layoutBox("gameplay", "visual", id));
  });

  const topHudBox = layoutBox("gameplay", "visual", "topHudPanel");
  if (topHudBox) {
    ["lifeCard", "timerCard"].forEach((id) => {
      if (!layoutBox("gameplay", "visual", id)) setCanvasBounds(visualTargets[id], topHudBox);
    });
    if (!layoutBox("gameplay", "visual", "radarCard")) {
      setCanvasBounds(visualTargets.radarCard, layoutBox("gameplay", "hitbox", "radarHotzone"));
    }
  }

  const energyBox = layoutBox("gameplay", "visual", "energyCard");
  const energyFillBox = layoutBox("gameplay", "visual", "energyFillVisual") || layoutBox("gameplay", "visual", "energyFill");
  setRelativeVisualBounds(ui.energyIcon, layoutBox("gameplay", "visual", "energyIcon"), energyBox);
  setRelativeVisualBounds(ui.energyFill.parentElement, energyFillBox, energyBox);

  const textTargets = {
    lifeLabel: { element: document.querySelector(".life-card .hud-label"), parent: "lifeCard" },
    lifeText: { element: ui.lifeText, parent: "lifeCard" },
    surviveTime: { element: ui.surviveTime, parent: "timerCard" },
    homeTime: { element: ui.homeTime, parent: "timerCard" },
    phaseText: { element: ui.phaseText, parent: "timerCard" },
    radarTitle: { element: document.querySelector(".radar-card span"), parent: "radarCard" },
    aiLevelText: { element: ui.aiLevelText, parent: "energyCard" },
    energyText: { element: ui.energyText, parent: "energyCard" },
    skillQText: { element: document.querySelector('[data-skill="radar"] strong'), parent: "skillQ" },
    skillWText: { element: document.querySelector('[data-skill="horn"] strong'), parent: "skillW" },
    skillEText: { element: document.querySelector('[data-skill="night"] strong'), parent: "skillE" },
    skillRText: { element: document.querySelector('[data-skill="silence"] strong'), parent: "skillR" },
  };

  Object.entries(textTargets).forEach(([id, target]) => {
    const textBox = layoutBox("gameplay", "text", id);
    const parentBox = layoutBox("gameplay", "visual", target.parent) || topHudBox;
    setRelativeBounds(target.element, textBox, parentBox);
  });

  const radarBox = layoutBox("gameplay", "visual", "radarCard") || layoutBox("gameplay", "hitbox", "radarHotzone");
  if (radarCanvas && radarBox) {
    radarCanvas.width = Math.round(radarBox.w * 0.7);
    radarCanvas.height = Math.round(radarBox.h * 0.7);
  }

  setCanvasBounds(ui.showIntro, layoutBox("cover", "hitbox", "coverStartHotzone"));
}

async function loadManualLayout() {
  try {
    const response = await fetch("../04-程序素材库/assets/layouts/ui-hotzone-layout.json?v=6");
    if (!response.ok) throw new Error(`layout ${response.status}`);
    const layout = await response.json();
    applyGameplayLayout(layout);
    drawRadar();
  } catch (error) {
    console.warn("UI layout not applied", error);
  }
}

function getRoadVanishY(h) {
  const box = layoutBox("gameplay", "hitbox", "roadVanishPoint");
  if (box) return ((box.y + box.h / 2) / LAYOUT_COORDINATE_HEIGHT) * h;
  return h * ROAD_VANISH_Y_RATIO;
}

function projectX(x, z) {
  const w = canvas.width;
  const horizon = getRoadVanishY(canvas.height);
  const depth = clamp(1 - z, 0, 1);
  const perspective = Math.pow(depth, 1.22);
  return w / 2 + (x - state.carX * 0.36 * perspective) * (70 + perspective * 600);
}

function project(x, z, w, h) {
  const depth = clamp(1 - z, 0, 1);
  const perspective = Math.pow(depth, 1.18);
  const scaleDepth = Math.pow(depth, 1.32);
  const px = w / 2 + (x - state.carX * 0.36 * perspective) * (64 + perspective * 650);
  const py = getRoadVanishY(h) + perspective * h * 0.46;
  return {
    x: px,
    y: py,
    scale: 0.14 + scaleDepth * 2.9,
  };
}

function endGame(won) {
  state.running = false;
  state.ended = true;
  state.awaitingReward = false;
  syncStageVideo();
  ui.cockpit.classList.remove("cover-active");
  ui.cockpit.classList.remove("intro-active");
  ui.cover.hidden = true;
  ui.intro.hidden = true;
  syncCoverVideo();
  ui.reward.hidden = true;
  ui.gameOver.hidden = false;
  ui.gameOver.classList.toggle("result-success", won);
  ui.gameOver.classList.toggle("result-fail", !won);
  ui.disturbance.hidden = true;
  ui.popupArt.hidden = true;
  ui.popupArt.removeAttribute("src");
  ui.resultKicker.textContent = won ? "安全到家" : "夜归失败";
  ui.resultTitle.textContent = won ? "你到家了" : "差一点，就到家了";
  ui.resultText.textContent = won
    ? "门口的灯还亮着。雨还在下，但这次，车停在了家门口。获得平安钥匙。"
    : "车灯还亮着。但这段路，没让你过去。不是你菜，是今晚下班路真的有问题。";
  ui.resultTime.textContent = formatTime(state.time);
  ui.resultGhosts.textContent = state.stats.ghosts;
  ui.resultAvoided.textContent = state.stats.avoided;
  ui.resultClosed.textContent = state.stats.closed;
}

ui.showIntro.addEventListener("click", showIntroPage);
document.getElementById("startGame").addEventListener("click", resetGame);
document.getElementById("restartGame").addEventListener("click", resetGame);
ui.returnHome.addEventListener("click", returnToCover);
document.getElementById("continueStage").addEventListener("click", continueNextLevel);
ui.cover.addEventListener("pointerdown", syncCoverVideo);

document.querySelectorAll(".skill-btn").forEach((button) => {
  button.addEventListener("click", () => useSkill(button.dataset.skill));
});

window.addEventListener("keydown", (event) => {
  const skillKeyMap = {
    q: "radar",
    w: "horn",
    e: "night",
    r: "silence",
  };
  const normalizedKey = event.key.toLowerCase();
  if (["ArrowLeft", "ArrowRight", "a", "A", "d", "D", " ", "q", "Q", "w", "W", "e", "E", "r", "R"].includes(event.key)) {
    event.preventDefault();
  }
  if (event.key === " ") {
    if (state.popupActive) closePopup(true);
    return;
  }
  if (skillKeyMap[normalizedKey]) useSkill(skillKeyMap[normalizedKey]);
  state.keys.add(event.key);
});

window.addEventListener("keyup", (event) => {
  state.keys.delete(event.key);
});

window.addEventListener("blur", () => {
  state.keys.clear();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) state.keys.clear();
});

canvas.addEventListener("pointerdown", (event) => {
  if (!state.running) return;
  const rect = canvas.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width * canvas.width;
  const py = (event.clientY - rect.top) / rect.height * canvas.height;
  const hit = [...state.objects].reverse().find((obj) => {
    if (obj.kind !== "ghost") return false;
    const p = project(obj.x, obj.z, canvas.width, canvas.height);
    const radius = 42 * p.scale;
    return Math.hypot(px - p.x, py - p.y) < radius;
  });
  if (hit) {
    hit.hp -= 1;
    if (hit.hp <= 0) disperse(hit);
    setHint(`AI锁定：${hit.type.name}`);
  }
});

loadManualLayout();
syncCoverVideo();
draw();
