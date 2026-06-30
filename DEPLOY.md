# Deployment-Anleitung

Architektur: Frontend (statisch) auf Vercel, Backend (Node + SQLite) auf Railway, eigene Domain.

## 0. Eigenes GitHub-Repo anlegen

SchafTracker liegt aktuell innerhalb deines persönlichen Home-Verzeichnisses, das selbst
ein Git-Repo ist (`Q-rec/Portfolio26`). Für Railway/Vercel braucht es ein **eigenes,
sauberes Repo nur für dieses Projekt** — nicht das große Home-Repo verbinden.

```bash
cd /Users/bkurek/Documents/_privateStuff/SchafTracker
git init
git add backend frontend package.json package-lock.json .gitignore DEPLOY.md
git commit -m "Initial commit"
```

Dann auf GitHub ein neues, leeres Repo anlegen (z.B. `schaftracker`) und pushen:

```bash
git remote add origin git@github.com:<dein-user>/schaftracker.git
git branch -M main
git push -u origin main
```

## 1. Backend auf Railway

1. Auf [railway.app](https://railway.app) einloggen, **New Project → Deploy from GitHub repo** → `schaftracker` auswählen.
2. Service-Settings → **Root Directory** auf `backend` setzen.
3. **Volume** hinzufügen (Settings → Volumes), Mount-Pfad z.B. `/data` — das hält die SQLite-Datei über Redeploys hinweg.
4. Environment Variables setzen (Settings → Variables):
   - `DATABASE_URL=file:/data/prod.db`
   - `FRONTEND_ORIGIN=https://deine-domain.de` (deine spätere Frontend-Domain)
   - `PARK_LAT=52.5208`
   - `PARK_LNG=13.2957`
   - `PORT` wird von Railway automatisch gesetzt, nicht manuell setzen.
5. Deploy anstoßen. Railway erkennt Node automatisch (Nixpacks), `railway.toml` legt den Start-Befehl fest (`npm run start`, führt `prisma migrate deploy` aus und startet den Server).
6. Unter Settings → Networking eine **Custom Domain** wie `api.deine-domain.de` hinzufügen — Railway zeigt dir den nötigen DNS-CNAME-Eintrag an.

## 2. Frontend auf Vercel

1. Auf [vercel.com](https://vercel.com) einloggen, **Add New → Project** → dasselbe GitHub-Repo `schaftracker` auswählen.
2. **Root Directory** auf `frontend` setzen.
3. Build-Settings (Vercel erkennt Vite automatisch):
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment Variable setzen: `VITE_API_BASE=https://api.deine-domain.de` (die Railway-Domain aus Schritt 1.6).
5. Deploy anstoßen.
6. Unter Project Settings → Domains deine Hauptdomain `deine-domain.de` hinzufügen — Vercel zeigt dir die nötigen DNS-Einträge (meist A-Record oder CNAME auf `cname.vercel-dns.com`).

## 3. DNS bei deinem Domain-Registrar

Bei dem Anbieter, bei dem du die Domain gekauft hast, zwei Einträge anlegen:

| Typ   | Host  | Ziel                                   |
|-------|-------|-----------------------------------------|
| A/CNAME | `@` (Hauptdomain) | Wert von Vercel (Schritt 2.6) |
| CNAME | `api` | Wert von Railway (Schritt 1.6) |

DNS-Propagation kann bis zu ein paar Stunden dauern.

## 4. Nach dem ersten Deploy

- Testen: `https://deine-domain.de` öffnen, kompletten Flow durchklicken (Sichtung melden, bestätigen).
- Prüfen, dass `https://api.deine-domain.de/api/sightings/current` antwortet.
- Lokale Entwicklung bleibt unverändert (`npm run dev` im Root, nutzt weiterhin `localhost`).

