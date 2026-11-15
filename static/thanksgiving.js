// ---- Settings: change these to change the shortcut --------------------
const SHORTCUT = {
  key: ",",        // the key to press
  presses: 2,      // how many times
  withinMs: 700,   // ...inside this many milliseconds
  go: "cosmic",    // where it takes you (relative, so it stays off GitHub Pages)
};
// -----------------------------------------------------------------------

// Press the shortcut key twice quickly to open Cosmic.
let hits = [];
addEventListener("keydown", (e) => {
  if (e.key !== SHORTCUT.key || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  const now = Date.now();
  hits = hits.filter((t) => now - t < SHORTCUT.withinMs).concat(now);
  if (hits.length < SHORTCUT.presses) return;
  hits = [];
  // Only jump if the Cosmic server is actually there (it is not on GitHub Pages).
  fetch(SHORTCUT.go, { method: "HEAD" })
    .then((r) => { if (r.ok) location.assign(SHORTCUT.go); })
    .catch(() => {});
});

// ---- Countdown to the fourth Thursday of November -----------------------
const feast = (year) => {
  const d = new Date(year, 10, 1);
  d.setDate(1 + ((4 - d.getDay() + 7) % 7) + 21);
  return d;
};
const today = new Date();
today.setHours(0, 0, 0, 0);
const days = Math.round((feast(today.getFullYear()) - today) / 864e5);
const countdown = document.getElementById("countdown");
if (days === 0) countdown.textContent = "Today is Thanksgiving. Enjoy the feast!";
else if (days === 1) countdown.textContent = "Thanksgiving is tomorrow.";
else if (days > 1 && days <= 60) countdown.textContent = `${days} days until Thanksgiving.`;

// ---- The turkey ---------------------------------------------------------
const $ = (s) => document.querySelector(s);
const svg = $("#turkey"), head = $("#head"), body = $("#body");
const hats = [$("#hat"), $("#chef"), $("#party"), null];
let hatIdx = 0;
const hat = () => hats[hatIdx];
const bubble = $(".bubble"), stat = $("#stat");
const feathers = [...svg.querySelectorAll(".f")];
const wings = [...svg.querySelectorAll(".wing")];
const pupils = [...svg.querySelectorAll(".pupil")];
const lids = [...svg.querySelectorAll(".lid")];
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const keys = (prop, vals) => vals.map((v) => ({ [prop]: v }));
const anim = (el, frames, opts) => (calm || !el ? null : el.animate(frames, { easing: "ease-in-out", ...opts }));

let sayTimer;
function say(content, ms = 1600) {
  bubble.replaceChildren(content); // a string or an element
  bubble.style.pointerEvents = content instanceof Node ? "auto" : "none";
  clearTimeout(sayTimer);
  sayTimer = setTimeout(() => {
    bubble.replaceChildren();
    bubble.style.pointerEvents = "none";
  }, ms);
}

// Sound is off until you turn it on. The gobble is synthesized, so there are no audio files.
let soundOn = false, ac;
function honk() {
  if (!soundOn) return;
  ac ??= new AudioContext();
  const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
  const lfo = ac.createOscillator(), lg = ac.createGain();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(520, t);
  o.frequency.exponentialRampToValueAtTime(260, t + 0.6);
  lfo.frequency.value = 24;
  lg.gain.value = 60;
  lfo.connect(lg).connect(o.frequency);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.18, t + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
  o.connect(g).connect(ac.destination);
  o.start(t); lfo.start(t); o.stop(t + 0.75); lfo.stop(t + 0.75);
}

const PHRASES = [
  "Gobble gobble!",
  "Pass the pie!",
  "Seconds, please!",
  "Gobble gobble gobble!",
  "Winner, winner, turkey dinner",
  "Let’s talk turkey",
  "It’s time to get basted!",
  "The goal is to gobble until you wobble",
];
const DOC_URL = "https://docs.google.com/document/d/1wVbQ46CoeD9ZfR0-LglyLQsRVkWSBYvMhY9_dvoBGg8/edit?usp=sharing";
function documentLink() {
  const link = document.createElement("a");
  link.href = DOC_URL;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Open the document";
  link.style.color = "inherit";
  return link;
}
function gobble(text) {
  anim(head, keys("transform", [0, 5, 0, 5, 0].map((y) => `translateY(${y}px)`)), { duration: 450 });
  anim(svg, keys("transform", ["scale(1)", "scale(1.04, 0.96)", "scale(1)"]), { duration: 300 });
  if (text) say(text);
  else {
    // Rare surprises on a plain gobble: 1 in 1000 shows the document link, 1 in 3000 a special message.
    const roll = Math.random();
    if (roll < 1 / 1000) say(documentLink(), 5000);
    else if (roll < 1 / 3000 + 1 / 1000) say("McKenzie is cuteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    else say(pick(PHRASES));
  }
  honk();
}

// Feather colors, listed from the outer feathers to the center one.
const THEMES = [
  ["#6e3a14", "#c8321f", "#e8651a", "#f08a1c", "#f6c133"], // autumn
  ["#3b1f5c", "#7a3b9c", "#c0509b", "#f07aa0", "#ffc2d4"], // berry
  ["#12414a", "#1f7a6d", "#3fae7a", "#9ad06a", "#e6e66a"], // forest
  ["#2a2f5e", "#5a4aa8", "#d6578a", "#ff8a5c", "#ffd36a"], // sunset
];
let theme = 0;
const order = (f) => parseInt(f.style.getPropertyValue("--i"), 10);
function setTheme(i) {
  theme = i;
  feathers.forEach((f) => f.style.setProperty("--c", THEMES[theme][4 - order(f)]));
}
function nextTheme() {
  setTheme((theme + 1) % THEMES.length);
  say(pick(["Ooh, new look!", "Fashion!", "How do I look?"]));
  save();
}

// Corn falls into the beak. The belly grows a little with every kernel.
const FOODS = { "🌽": "More corn!", "🥧": "Pie! My favorite!", "🍎": "Crunchy!", "🍇": "Sweet!" };
let fed = 0;
function feed() {
  const food = pick(Object.keys(FOODS));
  const k = document.createElementNS("http://www.w3.org/2000/svg", "text");
  k.setAttribute("x", 200); k.setAttribute("y", 10); k.setAttribute("font-size", 24); k.setAttribute("text-anchor", "middle");
  k.textContent = food;
  svg.append(k);
  const fall = anim(k, keys("transform", ["translateY(0)", "translateY(196px)"]), { duration: 650, easing: "cubic-bezier(0.5, 0, 0.9, 0.6)" });
  (fall ? fall.finished : Promise.resolve()).then(() => {
    k.remove();
    fed++;
    body.style.setProperty("--belly", 1 + Math.min(fed, 8) * 0.015);
    stat.textContent = `Treats eaten: ${fed}`;
    save();
    gobble(fed === 8 ? "I am stuffed!" : FOODS[food]);
  });
}

// Hat button cycles the wardrobe.
const HAT_NAMES = ["Pilgrim", "Chef", "Party", "None"];
function wearHat(i, btn) {
  hatIdx = i;
  hats.forEach((h, j) => h && (h.style.display = j === i ? "" : "none"));
  btn.textContent = `🎩 Hat: ${HAT_NAMES[i]}`;
}
function nextHat(btn) {
  wearHat((hatIdx + 1) % hats.length, btn);
  say(["Back in style!", "Bon appetit!", "Party time!", "Breezy!"][hatIdx]);
  save();
}

// Strut: fan the tail out or let it relax.
let spread = 1;
function strut(btn) {
  spread = spread === 1 ? 0.35 : 1;
  svg.style.setProperty("--spread", spread);
  btn.setAttribute("aria-pressed", spread === 1);
  say(spread === 1 ? "Look at this tail!" : "Relaxing...");
}

function toggleSound(btn) {
  soundOn = !soundOn;
  btn.setAttribute("aria-pressed", soundOn);
  btn.textContent = (soundOn ? "🔊" : "🔇") + " Sound";
  honk();
}

// Click or tap a part of the turkey.
const parts = {
  head: () => gobble(),
  belly: () => {
    anim(body, keys("scale", ["1", "1.06 0.94", "1", "1.04 0.97", "1"]), { duration: 500 });
    say(fed >= 8 ? "Burp! Excuse me." : "Hee hee, that tickles!");
  },
  hat: () => {
    anim(hat(), keys("transform", ["translateY(0) rotate(0deg)", "translateY(-16px) rotate(-10deg)", "translateY(0) rotate(0deg)"]), { duration: 500 });
    say("Why, thank you kindly!");
  },
  wing: () => {
    wings.forEach((w, i) => anim(w, keys("transform", [0, 1, 0, 1, 0].map((v) => `rotate(${(i ? 1 : -1) * v * 28}deg)`)), { duration: 500 }));
    say("Flap flap!");
  },
  feet: () => {
    anim(svg, keys("transform", ["translateY(0)", "translateY(-22px)", "translateY(0)"]), { duration: 450, easing: "cubic-bezier(0.3, 0.7, 0.4, 1)" });
    say("Wheee!");
  },
  feather: (el) => {
    const a = parseFloat(el.style.getPropertyValue("--a")) * spread;
    anim(el, keys("transform", [a, a - 9, a + 9, a].map((d) => `rotate(${d}deg)`)), { duration: 450 });
    const all = THEMES.flat();
    el.style.setProperty("--c", all[(all.indexOf(el.style.getPropertyValue("--c")) + 1) % all.length]);
    say("Ooh, fancy!");
  },
};
// Eight quick clicks make it dizzy.
let clicks = [];
svg.addEventListener("click", (e) => {
  const now = Date.now();
  clicks = clicks.filter((t) => now - t < 2500).concat(now);
  if (clicks.length >= 8) {
    clicks = [];
    const spin = (deg) => ({ transform: `rotate(${deg}deg)`, transformOrigin: "50% 60%" });
    anim(svg, [spin(0), spin(360)], { duration: 900 });
    return say("Whoa, dizzy!");
  }
  const el = e.target.closest("[data-part]");
  if (el) parts[el.dataset.part](el);
});

// The buttons under the turkey.
$(".tools").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  ({ gobble: () => gobble(), feed, hat: () => nextHat(btn), strut: () => strut(btn), colors: nextTheme, sound: () => toggleSound(btn) })[btn.dataset.act]();
});

// The eyes follow the pointer.
const EYES = [[187, 171], [213, 171]];
addEventListener("pointermove", (e) => {
  const r = svg.getBoundingClientRect(), k = r.width / 400;
  head.style.rotate = `${Math.max(-7, Math.min(7, ((e.clientX - (r.left + r.width / 2)) / r.width) * 14))}deg`; // head tilts toward you
  pupils.forEach((p, i) => {
    const dx = e.clientX - (r.left + EYES[i][0] * k), dy = e.clientY - (r.top + EYES[i][1] * k);
    const a = Math.atan2(dy, dx), d = Math.min(3.5, Math.hypot(dx, dy) / 40);
    p.style.transform = `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px)`;
  });
});

// It blinks every few seconds.
function blink() {
  if (!asleep) lids.forEach((l) => anim(l, keys("transform", ["scaleY(0)", "scaleY(1)", "scaleY(0)"]), { duration: 180 }));
  setTimeout(blink, 2500 + Math.random() * 3500);
}
setTimeout(blink, 2500);

// It remembers the theme, hat and treats between visits.
const store = {
  get() { try { return JSON.parse(localStorage.getItem("turkey")) || {}; } catch { return {}; } },
  set(v) { try { localStorage.setItem("turkey", JSON.stringify(v)); } catch {} },
};
function save() { store.set({ fed, theme, hatIdx }); }
const saved = store.get();
if (saved.theme) setTheme(saved.theme);
if (saved.hatIdx) wearHat(saved.hatIdx, $('[data-act="hat"]'));
if (saved.fed) {
  fed = saved.fed;
  body.style.setProperty("--belly", 1 + Math.min(fed, 8) * 0.015);
  stat.textContent = `Treats eaten: ${fed}`;
  setTimeout(() => say("Welcome back!"), 1200);
}

// After 25 quiet seconds it falls asleep. Any movement wakes it.
let asleep = false, idleTimer;
function sleep() {
  asleep = true;
  svg.classList.add("asleep");
  head.style.rotate = "0deg";
  clearTimeout(sayTimer);
  bubble.textContent = "Zzz...";
}
function wake() {
  clearTimeout(idleTimer);
  if (asleep) {
    asleep = false;
    svg.classList.remove("asleep");
    say("Huh? Oh, hello!");
  }
  idleTimer = setTimeout(sleep, 25000);
}
["pointerdown", "pointermove", "keydown"].forEach((t) => addEventListener(t, wake));
wake();
