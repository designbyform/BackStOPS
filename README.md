# BackStOPS Compliance

**Small business compliance tracking dashboard.** Never miss a license, renewal, insurance cert, tax deadline, or required filing again.

---

## What Was Built

A full-featured MVP SaaS compliance dashboard for regulated small businesses, including:

- **Landing Page** — Marketing page with pricing, pain points, and CTAs
- **Auth** — Mock login/signup (pre-filled demo credentials)
- **Dashboard** — Overview of overdue, due soon, missing documents, recently completed
- **Businesses** — CRUD for business profiles with compliance summaries
- **Compliance Items** — Full CRUD with category, status, priority, due dates, documents, notes
- **Templates** — 7 pre-built compliance templates (Restaurant, Wine Bar, Wine Importer, Wine Distributor, Food Truck, Salon, Contractor) with apply-to-business flow
- **Calendar** — Monthly calendar view + sortable list view with filters
- **Documents** — Tracking view for all required documents with status
- **Settings** — Profile, notifications, subscription placeholder, team members
- **Concierge View** — Internal admin dashboard for compliance team with Send Reminder, Request Document, Mark Reviewed, and Escalate actions

### Seed Data

Three demo businesses with 10–12 realistic compliance items each:
1. **Light Sleeper Wine Bar** (DC Wine Bar) — overdue city license, active liquor license, missing insurance cert, etc.
2. **Kily Import** (DC Wine Importer) — overdue TTB permit, overdue excise tax, expired workers comp, etc.
3. **Capitol Hill Food Truck** (DC Food Truck) — overdue vending permit, expired GL insurance, critical mobile unit permit due in 4 days

---

## How to Run

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

**Demo login:** `alice@designbyform.com` / any password

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **lucide-react** (icons)
- **date-fns** (date utilities)
- **localStorage** for state persistence (no backend required)

---

## What Is Mocked

| Feature | Status | Notes |
|---|---|---|
| Authentication | Mock | Any password works. Pre-filled with demo email. |
| Database | localStorage | React Context + localStorage. Persists across reloads. |
| File uploads | Mock | Document URL/filename field only. No actual file storage. |
| Email notifications | Placeholder | Toggle UI exists. No actual email sending. |
| Payment processing | Placeholder | Pricing UI exists. No Stripe/billing. |
| Team permissions | Basic | UI exists. No real role enforcement. |

---

## Supabase Integration (Next Steps)

To connect a real backend:

### 1. Install Supabase client
```bash
npm install @supabase/supabase-js
```

### 2. Create `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Replace `lib/store.tsx`
The store is structured to mirror what a real Supabase integration would look like. Replace the `useState`/localStorage calls with Supabase queries. All function signatures stay the same.

### 4. Create database tables
See `lib/types.ts` for the complete data model. Create tables for:
- `users`
- `businesses`
- `compliance_items`
- `activity_logs`

### 5. Add Supabase Auth
Replace mock `login()` with `supabase.auth.signInWithPassword()`.

### 6. Add File Storage
Replace the document URL field with `supabase.storage.from('documents').upload()`.

---

## Top 5 Next Product Features

1. **Email/SMS Reminders** — Connect Resend or Postmark to send automated reminders based on `reminder_days_before` values. This is the core retention driver.

2. **Supabase Backend** — Real database, real auth, real multi-user support. Required before public launch.

3. **Multi-location Support** — Allow businesses to have multiple locations with location-specific compliance items. Key for restaurant groups and contractors.

4. **PDF Report Generation** — Generate a "Compliance Summary" PDF per business for monthly concierge review calls. Use `@react-pdf/renderer`.

5. **AI-Assisted Onboarding** — Given a business type + jurisdiction, suggest a full compliance checklist automatically using Claude API. "Tell me your state, city, and business type and we'll build your first checklist."

---

## Deployment

Deploy to Vercel with one click:
- Push to GitHub
- Import repo in Vercel
- Add environment variables (when Supabase is set up)
- Deploy

No special build configuration needed.

---

## Disclaimer

BackStOPS helps organize compliance tasks and reminders. It does not provide legal, tax, or regulatory advice. Always verify requirements with the relevant agency or qualified professional.
