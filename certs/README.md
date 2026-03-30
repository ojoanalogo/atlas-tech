# Wallet Certificates

This directory holds signing certificates for wallet pass generation.
These files are gitignored — do not commit them.

## Required files

### Apple Wallet
- `pass.pem` — Pass Type ID certificate
- `pass-key.pem` — Certificate private key
- `wwdr.pem` — Apple WWDR intermediate certificate

### Google Wallet
- `google-sa.json` — Google Cloud service account key with Wallet API enabled
