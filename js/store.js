// Shared state for the updater and display windows.
// Loaded as a classic script (not a module) so the app still works when
// opened straight from the filesystem in Chrome.
const Scoreboard = (() => {
  const KEY = 'scoreboard';
  const MAX_TEAMS = 4;
  const DEFAULT_COLOURS = ['#e11d48', '#2563eb', '#f97316', '#7c3aed'];
  const FONTS = ['Oswald', 'Press Start 2P', 'Rubik Mono One', 'Bangers', 'VT323'];
  const DEFAULT_FONT = FONTS[0];

  const newTeam = (index) => ({
    name: '',
    color: DEFAULT_COLOURS[index] ?? DEFAULT_COLOURS[0],
    score: 0,
  });

  const defaultState = () => ({
    teams: [newTeam(0), newTeam(1)],
    font: DEFAULT_FONT,
    countdown: null,
  });

  // Reads the per-key layout used by versions before 2026 so an existing
  // browser keeps its team names and scores after upgrading.
  const migrateLegacy = () => {
    const count = Number.parseInt(localStorage.getItem('Teams') ?? '', 10);
    if (!Number.isInteger(count) || count < 1) return null;

    const teams = [];
    for (let i = 1; i <= Math.min(count, MAX_TEAMS); i++) {
      teams.push({
        name: localStorage.getItem(`Team${i}Name`) ?? '',
        color: localStorage.getItem(`Team${i}Color`) || DEFAULT_COLOURS[i - 1],
        score: Number.parseInt(localStorage.getItem(`Team${i}Score`) ?? '0', 10) || 0,
      });
    }
    const font = (localStorage.getItem('font') ?? DEFAULT_FONT).replaceAll("'", '');

    ['Teams', 'font', 'countdown', 'airhorn'].forEach((k) => localStorage.removeItem(k));
    for (let i = 0; i <= MAX_TEAMS; i++) {
      ['Name', 'Color', 'Score'].forEach((k) => localStorage.removeItem(`Team${i}${k}`));
    }

    return { ...defaultState(), teams, font: FONTS.includes(font) ? font : DEFAULT_FONT };
  };

  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...defaultState(), ...JSON.parse(raw) };
    } catch {
      // Corrupt JSON: fall through and start fresh.
    }
    const migrated = migrateLegacy();
    if (migrated) save(migrated);
    return migrated ?? defaultState();
  };

  const save = (state) => {
    localStorage.setItem(KEY, JSON.stringify(state));
    return state;
  };

  const reset = () => {
    localStorage.removeItem(KEY);
    return defaultState();
  };

  const fontFamily = (font) => `'${font}', sans-serif`;

  return { MAX_TEAMS, FONTS, DEFAULT_FONT, newTeam, load, save, reset, fontFamily };
})();
