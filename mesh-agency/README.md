# MESH — AI Automation Agency

Standalone marketing site. No database required.

## Copy to your Mac

From your Mac terminal:

```bash
# Option A — clone only this folder from the repo
git clone --branch cursor/ai-automation-agency-fd91 --single-branch \
  https://github.com/iCreativate/peboli.git mesh-agency-temp
mv mesh-agency-temp/mesh-agency ~/Desktop/mesh-agency
rm -rf mesh-agency-temp

# Option B — if you already have the repo
cd /path/to/peboli
git checkout cursor/ai-automation-agency-fd91
cp -R mesh-agency ~/Desktop/mesh-agency
```

## Run locally

```bash
cd ~/Desktop/mesh-agency
npm install
npm run dev
```

Open http://localhost:3000

## Pages

- `/` — Landing
- `/services` — Services
- `/work` — Case studies
- `/contact` — Contact form (saves to `data/contact-submissions.jsonl`)
