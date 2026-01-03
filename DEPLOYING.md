This repo is a monorepo with a Next.js frontend in `frontend/` and an Express backend in `backend/`.

Quick CLI deploy (recommended)

1. Login to Vercel (interactive):

```powershell
npx vercel login
```

2. From the repo root, run the PowerShell helper (Windows PowerShell):

```powershell
./deploy-vercel.ps1 -Prod
```

This runs:

```text
npx vercel --cwd frontend --prod --confirm
```

Notes
- If you prefer non-interactive CI, pass `-Token <VERCEL_TOKEN>` to the script.
- Alternatively, deploy from inside `frontend/` directly:

```bash
cd frontend
npx vercel --prod
```

If you have an existing Vercel project connected to this repo, the CLI will prompt to link the deployment to it. To ensure the site uses the Next.js `frontend` build every time, either deploy using the `--cwd frontend` flag or set the project’s "Root Directory" to `frontend` in the Vercel dashboard.
