# Acting Assignment Management

Web app for HR to manage temporary acting assignments: create assignments with employee and position details, set compensation, and track status through their lifecycle (active, expired, terminated, or converted to permanent).

**Features:**

- **Create assignments** — Employee and position info, start/end dates, reason, and compensation (fixed increment, percentage, allowance, or multiple allowances).
- **List and filter** — View all assignments and filter by status (Scheduled, Active, Expired, Terminated Early, Converted to Permanent).
- **Lifecycle** — Status updates automatically from start/end dates; optional “terminate early” or “converted to permanent.”
- **Expiration reminder** — Toast when active assignments are within a set number of days of ending (configurable via `NEXT_PUBLIC_EXPIRATION_REMINDER_DAYS`, default 7).
- **Accessible UI** — Semantic HTML, skip link, keyboard navigation, focus states, and Sonner toasts (Next.js, TypeScript, shadcn/ui, Tailwind).

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5005](http://localhost:5005).

Build: `pnpm build`. Start production: `pnpm start`.

## Links

- **Deployed app:** [https://acting-assignment-management.vercel.app/](https://acting-assignment-management.vercel.app/)
- **Repository:** [https://github.com/ephrem-ketachew/acting-assignment-management](https://github.com/ephrem-ketachew/acting-assignment-management)
