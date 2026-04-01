import { PKPass } from 'passkit-generator'
import fs from 'fs'
import path from 'path'
import type { WalletProfile } from './types'

const PASS_MODEL_DIR = path.resolve(process.cwd(), 'src/lib/wallet/pass-model')

function loadCert(envBase64: string | undefined, envPath: string | undefined): Buffer {
  if (envBase64) return Buffer.from(envBase64.trim(), 'base64')
  if (envPath) return fs.readFileSync(envPath)
  throw new Error('Missing certificate: provide either base64 env var or file path')
}

function getCertificates() {
  return {
    wwdr: loadCert(process.env.APPLE_WWDR_CERT_B64, process.env.APPLE_WWDR_CERT_PATH),
    signerCert: loadCert(process.env.APPLE_PASS_CERT_B64, process.env.APPLE_PASS_CERT_PATH),
    signerKey: loadCert(process.env.APPLE_PASS_KEY_B64, process.env.APPLE_PASS_KEY_PATH),
  }
}

export async function generateApplePass(profile: WalletProfile, qrValue: string): Promise<Buffer> {
  const pass = await PKPass.from(
    {
      model: PASS_MODEL_DIR,
      certificates: getCertificates(),
    },
    {
      serialNumber: `atlas-${profile.userId}`,
      passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
      teamIdentifier: process.env.APPLE_TEAM_ID!,
      description: 'Digital Business Card',
      organizationName: 'Tech Atlas',
    },
  )

  pass.type = 'generic'

  // Primary: Name
  pass.primaryFields.push({
    key: 'name',
    label: 'NAME',
    value: profile.name,
  })

  // Secondary: Title + Company
  if (profile.title) {
    pass.secondaryFields.push({
      key: 'title',
      label: 'TITLE',
      value: profile.title,
    })
  }
  if (profile.company) {
    pass.secondaryFields.push({
      key: 'company',
      label: 'COMPANY',
      value: profile.company,
    })
  }

  // Auxiliary: Email + Phone
  if (profile.email) {
    pass.auxiliaryFields.push({
      key: 'email',
      label: 'EMAIL',
      value: profile.email,
    })
  }
  if (profile.phone) {
    pass.auxiliaryFields.push({
      key: 'phone',
      label: 'PHONE',
      value: profile.phone,
    })
  }

  // Back fields: website + socials
  if (profile.website) {
    pass.backFields.push({
      key: 'website',
      label: 'WEBSITE',
      value: profile.website,
    })
  }
  if (profile.linkedin) {
    pass.backFields.push({
      key: 'linkedin',
      label: 'LINKEDIN',
      value: profile.linkedin,
    })
  }
  if (profile.x) {
    pass.backFields.push({
      key: 'x',
      label: 'X / TWITTER',
      value: profile.x,
    })
  }
  if (profile.github) {
    pass.backFields.push({
      key: 'github',
      label: 'GITHUB',
      value: profile.github,
    })
  }

  // QR code
  pass.setBarcodes({
    format: 'PKBarcodeFormatQR',
    message: qrValue,
    messageEncoding: 'iso-8859-1',
  })

  return pass.getAsBuffer()
}
