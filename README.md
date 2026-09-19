# LinguaLoop v2

Conversation-first language learning app prototype.

## Learning modes
- 🇨🇳 Chinese conversation (HSK-oriented)
- 🇯🇵 Japanese conversation (JLPT-oriented)
- 🇩🇪 German conversation (CEFR)
- 🇮🇹 Italian conversation (CEFR)
- 🎓 Academic English (CEFR C1-style academic tasks)

## Current v2
- Scenario-based speaking loops
- Browser TTS and speech recognition
- Immediate transcript similarity feedback
- Automatic review queue for difficult expressions
- Lightweight SRS-style review loop
- Local progress, XP and review persistence
- Responsive mobile-first UI
- No backend/API key required

## Run locally
```bash
python3 -m http.server 8080
```
Open http://localhost:8080.

## Architecture direction
The current build is a privacy-friendly static MVP. Real AI conversation and pronunciation/grammar assessment require a server-side model integration; API secrets must never be embedded in browser JavaScript.

Recommended production stack:
1. Web/mobile client
2. Auth + learner profile service
3. Server-side AI conversation/feedback endpoint
4. Speech transcription/pronunciation service
5. Synced SRS review store
6. CEFR/HSK/JLPT curriculum metadata

## Next production milestone
Add authenticated profiles and a server-side AI tutor endpoint, then replace heuristic similarity feedback with rubric-based grammar, vocabulary, task-completion, and pronunciation feedback.
