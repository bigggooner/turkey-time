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
const phrases = ["Gobble gobble!", "Pass the pie!", "Seconds, please!", "Gobble gobble gobble!", "Winner, winner, turkey dinner", "Let’s talk turkey", "It’s time to get basted!", "The goal is to gobble until you wobble",];
let timer;
turkey.addEventListener("click", () => {
  clearTimeout(timer);
  turkey.classList.remove("gobble");
  void turkey.offsetWidth; // restart the animation
  turkey.classList.add("gobble");
  const roll = Math.random();
  const showDocument = roll < 1 / 1000;
  if (showDocument) {
    const link = document.createElement("a");
    link.href = "https://docs.google.com/document/d/1wVbQ46CoeD9ZfR0-LglyLQsRVkWSBYvMhY9_dvoBGg8/edit?usp=sharing";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open the document";
    link.style.color = "inherit";
    bubble.replaceChildren(link);
    bubble.style.pointerEvents = "auto";
  } else if (roll < 1 / 3000 + 1 / 1000) {
    bubble.textContent = "McKenzie is cuteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
    bubble.style.pointerEvents = "none";
  } else {
    bubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    bubble.style.pointerEvents = "none";
  }
  timer = setTimeout(() => {
    turkey.classList.remove("gobble");
    bubble.textContent = "";
    bubble.style.pointerEvents = "none";
  }, showDocument ? 5000 : 1400);
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
