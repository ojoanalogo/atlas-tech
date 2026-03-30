# Profile & Digital Wallet Card

**Date:** 2026-03-29
**Status:** Approved

## Overview

Self-service feature allowing any authenticated user to edit their profile and generate a digital presentation card for Apple Wallet and Google Wallet. The card serves as a digital business card with contact info and a QR code linking to the user's public profile.

## 1. Profile Data Model

New Drizzle schema — not a Payload collection. Lives in the same PostgreSQL database, managed by `drizzle-kit` migrations.

**Table: `profiles`**

| Column      | Type      | Constraints                          |
|-------------|-----------|--------------------------------------|
| `userId`    | text      | PK, references better-auth user      |
| `name`      | text      | NOT NULL                             |
| `title`     | text      |                                      |
| `company`   | text      |                                      |
| `email`     | text      |                                      |
| `phone`     | text      |                                      |
| `website`   | text      |                                      |
| `photo`     | text      | URL to uploaded image                |
| `linkedin`  | text      |                                      |
| `x`         | text      |                                      |
| `github`    | text      |                                      |
| `createdAt` | timestamp | DEFAULT now()                        |
| `updatedAt` | timestamp | DEFAULT now(), updated on each write |

- Drizzle ORM for queries, `drizzle-kit` for migrations.
- Reuse/extract a shared `pg` Pool from the existing `src/lib/auth.ts` connection.
- No Payload CMS involvement — profile CRUD goes through Drizzle queries in API routes.

## 2. API Routes

### `GET /api/user/profile`

- Returns the authenticated user's profile from the `profiles` table.
- 401 if not signed in.
- 404 if no profile exists yet.

### `PUT /api/user/profile`

- Upserts profile data (create on first save, update thereafter).
- Validates input fields server-side.
- 401 if not signed in.

### `POST /api/user/wallet`

- Request body: `{ platform: 'apple' | 'google' }`
- Reads the user's profile from Drizzle.
- **Apple:** generates a `.pkpass` file using `passkit-generator`, returns binary download (`Content-Type: application/vnd.apple.pkpass`).
- **Google:** creates a pass object via the official `@googleapis/walletobjects` SDK, returns JSON with the "Add to Google Wallet" save link URL.
- 401 if not signed in.
- 400 if profile doesn't exist or required fields are missing (name at minimum).

All routes are session-gated via Better Auth.

## 3. Profile Editing UI

### Page: `/dashboard/profile`

Follows the existing dashboard pattern (`/dashboard/entries`, `/dashboard/jobs`).

**Profile form:**
- Photo upload (reuse existing S3-backed media infrastructure)
- Fields: name, title, company, email, phone, website
- Social links: LinkedIn, X, GitHub
- Save button that `PUT`s to `/api/user/profile`

**Wallet card section** (below the form):
- Styled preview component showing how the pass will look
- Two buttons: "Add to Apple Wallet" and "Add to Google Wallet"
  - Apple: triggers `.pkpass` file download
  - Google: opens the save link in a new tab
- Buttons disabled until the user has saved their profile at least once

Everything on one page — no separate flows.

## 4. Wallet Pass Design

### Apple Wallet (`.pkpass`)

- **Pass style:** Generic
- **Front fields:** name, title, company, email, phone
- **Back fields:** website, LinkedIn, X, GitHub
- **QR code:** links to public profile URL
- **vCard data:** embedded in the pass for contact saving
- **Branding:** atlas-tech logo on the header, site brand colors

### Google Wallet

- **Pass type:** Generic Pass
- **Header:** name, title, company
- **Detail rows:** email, phone, website, social links
- **QR code:** same profile URL as Apple
- **Branding:** atlas-tech logo + brand colors

### QR Code Target

The QR code links to the user's public directory entry if one exists (`/directorio/[slug]` where the entry's `owner` matches the user ID). If no directory entry exists, the QR encodes a vCard with the user's contact info instead (so scanning still provides value).

### Pass Lifecycle

Passes are generated on-demand (stateless). If the user updates their profile, they generate a new pass. No push-update infrastructure for v1.

## 5. Environment Variables

```env
# Apple Wallet
APPLE_PASS_TYPE_ID=pass.com.atlastech.card
APPLE_TEAM_ID=<team-id>
APPLE_PASS_CERT_PATH=certs/pass.pem
APPLE_PASS_KEY_PATH=certs/pass-key.pem
APPLE_WWDR_CERT_PATH=certs/wwdr.pem

# Google Wallet
GOOGLE_WALLET_ISSUER_ID=<issuer-id>
GOOGLE_WALLET_SERVICE_ACCOUNT_JSON=certs/google-sa.json
GOOGLE_WALLET_CLASS_ID=atlastech.profile-card
```

Apple certificates and Google service account JSON stored in a `certs/` directory (gitignored).

## 6. New Dependencies

| Package              | Purpose                              |
|----------------------|--------------------------------------|
| `drizzle-orm`        | Query builder for profiles table     |
| `drizzle-kit`        | Schema migrations                    |
| `passkit-generator`  | Apple `.pkpass` file generation       |
| `googleapis`                | Official Google API SDK (includes walletobjects) |

## 7. File Structure (New/Modified)

```
src/
  db/
    index.ts                    # Shared Drizzle client + pg pool
    schema/
      profiles.ts               # Drizzle schema for profiles table
  app/
    (frontend)/
      dashboard/
        profile/
          page.tsx              # Profile edit page + wallet card UI
    api/
      user/
        profile/
          route.ts              # GET, PUT profile
        wallet/
          route.ts              # POST generate wallet pass
  lib/
    wallet/
      apple.ts                  # passkit-generator wrapper
      google.ts                 # Google Wallet API wrapper
certs/                          # gitignored, Apple + Google credentials
drizzle.config.ts               # Drizzle Kit config
```

## 8. Out of Scope (v1)

- Push notifications to update existing passes
- Pass analytics/tracking
- Custom pass designs per user
- Sharing passes via link/email
- Public profile page creation (assumes directory entry already exists for QR link)
