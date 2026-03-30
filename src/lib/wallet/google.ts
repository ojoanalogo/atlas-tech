import { google } from 'googleapis'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import type { Profile } from '@/db/schema/profiles'

const ISSUER_ID = process.env.GOOGLE_WALLET_ISSUER_ID!
const CLASS_ID = process.env.GOOGLE_WALLET_CLASS_ID!

function getCredentials() {
  const raw = fs.readFileSync(process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON!)
  return JSON.parse(raw.toString())
}

function getClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON!,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  })

  return google.walletobjects({ version: 'v1', auth })
}

async function ensureClass() {
  const client = getClient()
  const classId = `${ISSUER_ID}.${CLASS_ID}`

  try {
    await client.genericclass.get({ resourceId: classId })
  } catch {
    await client.genericclass.insert({
      requestBody: {
        id: classId,
      },
    })
  }
}

export async function generateGoogleWalletLink(profile: Profile, qrValue: string): Promise<string> {
  await ensureClass()

  const credentials = getCredentials()
  const objectId = `${ISSUER_ID}.profile-${profile.userId}`
  const classId = `${ISSUER_ID}.${CLASS_ID}`

  const genericObject = {
    id: objectId,
    classId,
    state: 'ACTIVE',
    cardTitle: {
      defaultValue: { language: 'en', value: 'Tech Atlas' },
    },
    header: {
      defaultValue: { language: 'en', value: profile.name },
    },
    subheader: profile.title
      ? { defaultValue: { language: 'en', value: profile.title } }
      : undefined,
    textModulesData: [
      ...(profile.company
        ? [{ id: 'company', header: 'Company', body: profile.company }]
        : []),
      ...(profile.email
        ? [{ id: 'email', header: 'Email', body: profile.email }]
        : []),
      ...(profile.phone
        ? [{ id: 'phone', header: 'Phone', body: profile.phone }]
        : []),
      ...(profile.website
        ? [{ id: 'website', header: 'Website', body: profile.website }]
        : []),
      ...(profile.linkedin
        ? [{ id: 'linkedin', header: 'LinkedIn', body: profile.linkedin }]
        : []),
      ...(profile.x
        ? [{ id: 'x', header: 'X / Twitter', body: profile.x }]
        : []),
      ...(profile.github
        ? [{ id: 'github', header: 'GitHub', body: profile.github }]
        : []),
    ],
    barcode: {
      type: 'QR_CODE',
      value: qrValue,
    },
  }

  const claims = {
    iss: credentials.client_email,
    aud: 'google',
    origins: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'],
    typ: 'savetowallet',
    payload: {
      genericObjects: [genericObject],
    },
  }

  const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' })

  return `https://pay.google.com/gp/v/save/${token}`
}
