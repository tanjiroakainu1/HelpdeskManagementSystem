# Helpdesk Management System

**React + TypeScript + Tailwind** helpdesk with ten roles and full ticket workflow.

**Developer:** Raminder Jangao — full-stack UI, ten-role workflow, candy emerald × galaxy theme.

## Quick start

```bash
npm install
cp .env.example .env   # add OPENROUTER_API_KEY for Galaxy Guide AI chat
npm run dev      # http://localhost:5173
npm run build    # output in dist/
```

### Galaxy Guide (AI assistant)

Floating chat on **home**, **login**, **register**, and **every role**. Users can ask **anything** (helpdesk + general knowledge). Quick questions change per role.

| Environment | How AI works |
|-------------|----------------|
| **Local** | `OPENROUTER_API_KEY` in `.env` → Vite proxy `/api/assistant/*` |
| **Vercel** | Same env vars in Project → Settings → Environment Variables → serverless `api/assistant/*` |

```bash
npm run test:ai   # smoke test (dev server must be running)
```

**Security:** Never commit `.env`. The API key is **never** exposed to the browser bundle.

## Deploy on Vercel

1. Push the repo to GitHub and import in [Vercel](https://vercel.com).
2. **Environment Variables** (Production + Preview):

   | Name | Value |
   |------|--------|
   | `OPENROUTER_API_KEY` | Your API key (required) |
   | `OPENROUTER_MODEL` | `openrouter/free` (optional) |

3. Deploy. `vercel.json` builds the Vite app and routes `/api/assistant/chat` + `/api/assistant/health` to Edge functions.

```bash
npx vercel dev          # local production-like test (needs Vercel CLI + .env)
npm run test:ai         # after vercel dev or npm run dev
```

Open `https://your-app.vercel.app/#/` and use the **✦ Guide** button.

Open the built app: `dist/index.html` (HashRouter — e.g. `/#/login`, `/#/super-admin/dashboard`).

**Demo password for all roles:** `password123`  
Use **Quick Role Access** on login or any dashboard to switch roles.

## Roles (`src/roles/`)

| Role | Route folder |
|------|----------------|
| Super Admin | `super-admin` |
| Help Desk Manager | `help-desk-manager` |
| Support Supervisor | `support-supervisor` |
| Support Agent | `support-agent` |
| IT Technician | `it-technician` |
| Department Head | `department-head` |
| Employee / Customer | `employee-customer` |
| Knowledge Base Editor | `knowledge-base-editor` |
| Quality Assurance Officer | `quality-assurance-officer` |
| System Auditor | `system-auditor` |

Each role has its own folder with **one React file per function** under `pages/`. Routes are merged in `src/features/pageRegistry.tsx`.

### Data layer

- **`src/lib/api.ts`** → **`src/lib/db.ts`** (persistence key: `helpdesk_db_v2`)
- **`systemRecords`** — shared CRUD log visible to every role (**System Records** in the sidebar)

## Deploy on XAMPP (optional)

Copy the `dist/` folder contents into your htdocs path, or point the vhost document root to `dist/` after `npm run build`.

## Troubleshooting blank screen

1. Stop old dev servers (`Ctrl+C` in terminal), then run `npm run dev` again.
2. Open the URL Vite prints (e.g. `http://localhost:5173/#/login`).
3. If the page is still blank, open DevTools → Application → Local Storage → delete `helpdesk_db_v2`, then refresh.
4. Or run `npm run build` and open `dist/index.html` in the browser.
