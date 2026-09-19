# LinguaLoop v2

Single-user language learning app with cross-device study history.

## Modes
Chinese, Japanese, German and Italian are conversation-first. English is Academic English.

## Weakness-first review
Low-scoring expressions are saved automatically. Repeated mistakes increase priority. Reviews are graded Again / Hard / Remembered and rescheduled.

## iPhone ↔ Mac sync (Supabase)
No user login UI is required. LinguaLoop keeps an offline local copy and can sync the same private learner state between devices.

1. Create a free Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. In Supabase project settings/API, copy the **Project URL** and the client-safe **publishable/anon key**. Never use a service-role/secret key in the browser.
4. Open LinguaLoop → **☁️ 동기화 설정**.
5. Enter the URL, client key, and a long random personal **Sync ID**.
6. Enter the same three values once on the iPhone and Mac.

Synced state: language/lesson position, completed count, XP source data, weak expressions, lapse counts, scores, SRS intervals and due dates.

### Security note
The sync is now capability-based rather than globally readable. The browser sends the private Sync ID in a request header; the database stores only its SHA-256 hash. RLS recomputes that hash for every request and only exposes the matching row. A public GitHub repository therefore does not reveal the learner record or Sync ID.

Use a long random Sync ID and keep it private. The Supabase publishable key is client-safe; never put a secret/service-role key in this app.

After updating from the earlier prototype, re-run the complete `supabase/schema.sql` in Supabase SQL Editor to replace the old permissive policies.

## Offline behavior
Every change is written locally first. If cloud sync is unavailable, studying continues locally and a later save attempts cloud sync. The current MVP uses last-write-wins state sync, so avoid actively studying on both devices at the exact same time.

## Run
```bash
python3 -m http.server 8080
```
