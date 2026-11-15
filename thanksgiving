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

// Click or tap the turkey and it gobbles.
const turkey = document.querySelector(".turkey");
const bubble = document.querySelector(".bubble");
const phrases = ["Gobble gobble!", "Pass the pie!", "Seconds, please!", "Gobble gobble gobble!"];
let timer;
turkey.addEventListener("click", () => {
  clearTimeout(timer);
  turkey.classList.remove("gobble");
  void turkey.offsetWidth; // restart the animation
  turkey.classList.add("gobble");
  bubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];
  timer = setTimeout(() => {
    turkey.classList.remove("gobble");
    bubble.textContent = "";
  }, 1400);
});

// Countdown to the fourth Thursday of November.
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
