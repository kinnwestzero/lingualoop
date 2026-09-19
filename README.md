# LinguaLoop v2

A conversation-first language learning prototype.

## Modes
- 🇨🇳 Chinese conversation
- 🇯🇵 Japanese conversation
- 🇩🇪 German conversation
- 🇮🇹 Italian conversation
- 🎓 Academic English — seminars, presentations, research synthesis

## v2 prototype
- Daily scenario-based speaking loops
- Browser text-to-speech for model dialogue
- Browser speech recognition for learner turns (where supported)
- Local progress / XP persistence
- Responsive mobile-first UI
- No backend or API key required

## Run
Open `index.html` in a modern browser, or serve the directory:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

> Speech recognition support varies by browser. Chrome-based browsers generally provide the best support.

## Next
The prototype is intentionally dependency-free. A production iteration can add authentication, spaced repetition, AI pronunciation/grammar feedback, generated role-play, and synced learner profiles.
