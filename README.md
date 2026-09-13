# yth-scoreboard

A browser-based scoreboard and countdown for youth ministries that do not have presentation software to run a scoreboard during games or tribal wars.

It is plain HTML, CSS and JavaScript with no build step or dependencies. Scores are kept in the browser's Local Storage and shown in a second window that you drag to a TV or projector.

## How to Use

### Setting up

- Type in team names and pick a colour for each (defaults are red and blue).
- Use "Add Team" and "Remove Team" for up to four teams.
- Click "Open / Refresh Scoreboard" and move the new window to your second screen.

### Updating scores

Type a new score, or use the quick buttons (+1, +100, +1000 and their negatives). Changes save automatically and appear on the scoreboard immediately.

### Countdown

Enter a number of seconds and click "Start Countdown". Tick "Airhorn" to play a sound when the timer ends. The scoreboard window opens automatically if it is not already open.

### Fonts

Choose from Oswald, Press Start 2P, Rubik Mono One, Bangers or VT323. The scoreboard updates as soon as you pick one.

### Resetting

Teams, scores and settings are remembered on the same computer and browser. Click "Reset All" to start again.

## Running it yourself

Open `index.html` in any modern browser, or host the folder on any static web server. Fonts load from Google Fonts, so an internet connection is needed for the custom fonts; everything else works offline.

## Credits

Created by [Bevan Kay](https://bevankay.me) for [ythmin.com](http://ythmin.com).
