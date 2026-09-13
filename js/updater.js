const teamsEl = document.getElementById('teams');
const fontsEl = document.getElementById('fonts');
const statusEl = document.getElementById('status');
const teamTemplate = document.getElementById('team-template');

let displayWindow = null;
let statusTimer = null;

const showStatus = (text) => {
  statusEl.textContent = text;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { statusEl.textContent = ''; }, 1500);
};

const readTeams = () =>
  [...teamsEl.querySelectorAll('.team')].map((card) => ({
    name: card.querySelector('[data-field="name"]').value.trim(),
    color: card.querySelector('[data-field="color"]').value,
    score: Number.parseInt(card.querySelector('[data-field="score"]').value, 10) || 0,
  }));

const readFont = () => fontsEl.querySelector('input:checked')?.value ?? Scoreboard.DEFAULT_FONT;

const pushToDisplay = (state) => {
  if (!displayWindow || displayWindow.closed) return;
  const origin = location.protocol === 'file:' ? '*' : location.origin;
  displayWindow.postMessage({ type: 'scoreboard', state }, origin);
};

const save = (patch = {}) => {
  const state = Scoreboard.save({
    ...Scoreboard.load(),
    teams: readTeams(),
    font: readFont(),
    ...patch,
  });
  pushToDisplay(state);
  showStatus('Saved');
  return state;
};

const openDisplay = () => {
  displayWindow = window.open('scoreboard/scoreboard.html', 'scoreboard', 'popup');
  displayWindow?.focus();
};

const renderTeam = (team, index) => {
  const card = teamTemplate.content.firstElementChild.cloneNode(true);
  card.querySelector('legend').textContent = `Team ${index + 1}`;
  card.querySelector('[data-field="name"]').value = team.name;
  card.querySelector('[data-field="color"]').value = team.color;
  card.querySelector('[data-field="score"]').value = team.score;
  teamsEl.append(card);
};

const renderFonts = (selected) => {
  fontsEl.replaceChildren(
    ...Scoreboard.FONTS.map((font) => {
      const label = document.createElement('label');
      label.className = 'font-option';
      label.style.fontFamily = Scoreboard.fontFamily(font);
      const input = Object.assign(document.createElement('input'), {
        type: 'radio',
        name: 'font',
        value: font,
        checked: font === selected,
      });
      label.append(input, ` ${font}`);
      return label;
    }),
  );
};

const render = (state) => {
  teamsEl.replaceChildren();
  state.teams.forEach(renderTeam);
  renderFonts(state.font);
};

render(Scoreboard.load());

document.getElementById('add-team').addEventListener('click', () => {
  const teams = readTeams();
  if (teams.length >= Scoreboard.MAX_TEAMS) {
    showStatus(`Maximum ${Scoreboard.MAX_TEAMS} teams`);
    return;
  }
  renderTeam(Scoreboard.newTeam(teams.length), teams.length);
  save();
});

document.getElementById('remove-team').addEventListener('click', () => {
  const last = teamsEl.querySelector('.team:last-child');
  if (!last) {
    showStatus('No teams to remove');
    return;
  }
  last.remove();
  save();
});

teamsEl.addEventListener('input', () => save());

teamsEl.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-diff]');
  if (!button) return;
  const scoreInput = button.closest('.team').querySelector('[data-field="score"]');
  const current = Number.parseInt(scoreInput.value, 10) || 0;
  scoreInput.value = current + Number.parseInt(button.dataset.diff, 10);
  save();
});

fontsEl.addEventListener('change', () => save());

document.getElementById('start-countdown').addEventListener('click', () => {
  const seconds = Number.parseInt(document.getElementById('countdown-seconds').value, 10);
  if (!Number.isInteger(seconds) || seconds < 1) {
    showStatus('Enter a number of seconds');
    return;
  }
  const countdown = {
    endsAt: Date.now() + seconds * 1000,
    airhorn: document.getElementById('airhorn').checked,
  };
  if (!displayWindow || displayWindow.closed) openDisplay();
  save({ countdown });
});

document.getElementById('open-scoreboard').addEventListener('click', () => {
  save();
  openDisplay();
});

document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Reset ALL teams, scores and settings?')) return;
  const state = Scoreboard.reset();
  render(state);
  save();
});

window.addEventListener('storage', (event) => {
  if (event.key === null || event.key === 'scoreboard') render(Scoreboard.load());
});
