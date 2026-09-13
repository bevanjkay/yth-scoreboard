const teamsEl = document.getElementById('teams');
const countdownEl = document.getElementById('countdown');
const countdownTimeEl = document.getElementById('countdown-time');
const flashEl = document.getElementById('flash');
const airhornEl = document.getElementById('airhorn');

let countdownTimer = null;
let activeCountdownEnd = null;

const renderTeams = ({ teams, font }) => {
  document.body.style.fontFamily = Scoreboard.fontFamily(font);
  teamsEl.dataset.count = String(teams.length);

  teams.forEach((team, index) => {
    let tile = teamsEl.children[index];
    if (!tile) {
      tile = document.createElement('div');
      tile.className = 'team';
      tile.innerHTML = '<div class="team-name"></div><div class="team-score"></div>';
      teamsEl.append(tile);
    }
    tile.style.backgroundColor = team.color;
    tile.querySelector('.team-name').textContent = team.name;

    const scoreEl = tile.querySelector('.team-score');
    const score = String(team.score);
    if (scoreEl.textContent !== score) {
      scoreEl.textContent = score;
      scoreEl.classList.remove('bump');
      void scoreEl.offsetWidth;
      scoreEl.classList.add('bump');
    }
  });

  while (teamsEl.children.length > teams.length) teamsEl.lastElementChild.remove();
};

const formatTime = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const finishCountdown = (airhorn) => {
  clearInterval(countdownTimer);
  countdownTimer = null;
  countdownEl.hidden = true;

  if (airhorn) {
    airhornEl.currentTime = 0;
    airhornEl.play().catch(() => {});
  }
  flashEl.classList.remove('show');
  void flashEl.offsetWidth;
  flashEl.classList.add('show');

  const state = Scoreboard.load();
  if (state.countdown?.endsAt === activeCountdownEnd) {
    Scoreboard.save({ ...state, countdown: null });
  }
  activeCountdownEnd = null;
};

const renderCountdown = ({ countdown }) => {
  if (!countdown || countdown.endsAt <= Date.now()) {
    if (!countdownTimer) countdownEl.hidden = true;
    return;
  }
  if (countdown.endsAt === activeCountdownEnd) return;

  clearInterval(countdownTimer);
  activeCountdownEnd = countdown.endsAt;
  countdownEl.hidden = false;

  const tick = () => {
    const remaining = countdown.endsAt - Date.now();
    countdownTimeEl.textContent = formatTime(remaining);
    if (remaining <= 0) finishCountdown(countdown.airhorn);
  };
  tick();
  countdownTimer = setInterval(tick, 200);
};

const render = (state) => {
  renderTeams(state);
  renderCountdown(state);
};

render(Scoreboard.load());

// Hosted: other tabs on the same origin fire storage events.
window.addEventListener('storage', (event) => {
  if (event.key === null || event.key === 'scoreboard') render(Scoreboard.load());
});

// Local files: Chrome gives every file:// page its own origin, so the
// updater pushes state directly to the window it opened instead.
window.addEventListener('message', (event) => {
  if (event.source !== window.opener || event.data?.type !== 'scoreboard') return;
  render({ ...Scoreboard.load(), ...event.data.state });
});
