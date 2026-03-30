'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from '@/lib/auth-client'
import Image from 'next/image'
import { Save, Loader2, CheckCircle, AlertCircle, Mail, Phone, Globe, QrCode } from 'lucide-react'

interface ProfileData {
  name: string
  title: string
  company: string
  email: string
  phone: string
  website: string
  photo: string
  linkedin: string
  x: string
  github: string
}

const emptyProfile: ProfileData = {
  name: '',
  title: '',
  company: '',
  email: '',
  phone: '',
  website: '',
  photo: '',
  linkedin: '',
  x: '',
  github: '',
}

const inputClass =
  'mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-primary font-mono text-sm placeholder:text-muted/50 focus:outline-hidden focus:border-accent transition-colors'
const labelClass = 'text-xs font-mono text-muted uppercase tracking-wider'

export function ProfileForm() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<ProfileData>(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [hasSavedProfile, setHasSavedProfile] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletLoading, setWalletLoading] = useState<'apple' | 'google' | null>(null)
  const [walletTab, setWalletTab] = useState<'apple' | 'google'>('apple')

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile({
          name: data.name || '',
          title: data.title || '',
          company: data.company || '',
          email: data.email || '',
          phone: data.phone || '',
          website: data.website || '',
          photo: data.photo || '',
          linkedin: data.linkedin || '',
          x: data.x || '',
          github: data.github || '',
        })
        setHasSavedProfile(true)
      }
    } catch {
      // No profile yet — use empty form
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session) fetchProfile()
  }, [session, fetchProfile])

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setError(null)
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }
      setSaved(true)
      setHasSavedProfile(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleWallet = async (platform: 'apple' | 'google') => {
    setWalletLoading(platform)
    try {
      if (platform === 'apple') {
        const res = await fetch('/api/user/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform: 'apple' }),
        })
        if (!res.ok) throw new Error('Failed to generate pass')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${profile.name.replace(/[^a-zA-Z0-9]/g, '-')}.pkpass`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        const res = await fetch('/api/user/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform: 'google' }),
        })
        if (!res.ok) throw new Error('Failed to generate pass')
        const data = await res.json()
        window.open(data.saveLink, '_blank')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate wallet pass')
    } finally {
      setWalletLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="h-4 w-16 bg-elevated rounded animate-pulse" />
          <div className="h-10 bg-elevated rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-10 bg-elevated rounded-lg animate-pulse" />
            <div className="h-10 bg-elevated rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-10 bg-elevated rounded-lg animate-pulse" />
            <div className="h-10 bg-elevated rounded-lg animate-pulse" />
          </div>
          <div className="h-10 bg-elevated rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-10 bg-elevated rounded-lg animate-pulse" />
            <div className="h-10 bg-elevated rounded-lg animate-pulse" />
            <div className="h-10 bg-elevated rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="border-t border-border pt-8">
          <div className="h-5 w-40 bg-elevated rounded animate-pulse mb-4" />
          <div className="h-64 bg-elevated rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Form */}
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input
            className={inputClass}
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title</label>
            <input
              className={inputClass}
              value={profile.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div>
            <label className={labelClass}>Company</label>
            <input
              className={inputClass}
              value={profile.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="e.g. Atlas Tech"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Email</label>
            <input
              className={inputClass}
              type="email"
              value={profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              className={inputClass}
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+52 667 123 4567"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Website</label>
          <input
            className={inputClass}
            value={profile.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://yoursite.com"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input
              className={inputClass}
              value={profile.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/you"
            />
          </div>
          <div>
            <label className={labelClass}>X / Twitter</label>
            <input
              className={inputClass}
              value={profile.x}
              onChange={(e) => handleChange('x', e.target.value)}
              placeholder="@handle"
            />
          </div>
          <div>
            <label className={labelClass}>GitHub</label>
            <input
              className={inputClass}
              value={profile.github}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="username"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !profile.name.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-mono font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar perfil'}
          </button>
          {error && (
            <span className="flex items-center gap-1 text-xs text-red-400 font-mono">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </span>
          )}
        </div>
      </div>

      {/* Wallet Card Section */}
      <div className="border-t border-border pt-8">
        <h2 className="text-lg font-semibold text-primary mb-2">Digital Wallet Card</h2>
        <p className="text-sm text-muted mb-6">
          Preview your digital business card and add it to your wallet.
        </p>

        {/* Platform Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-elevated rounded-lg w-fit">
          <button
            onClick={() => setWalletTab('apple')}
            className={`px-4 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
              walletTab === 'apple'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted hover:text-secondary'
            }`}
          >
            Apple Wallet
          </button>
          <button
            onClick={() => setWalletTab('google')}
            className={`px-4 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
              walletTab === 'google'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted hover:text-secondary'
            }`}
          >
            Google Wallet
          </button>
        </div>

        {/* Phone Mockup */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-[280px]">
            {/* Phone Frame */}
            <div className="rounded-[2.5rem] border-[3px] border-primary/20 bg-black p-3 shadow-xl">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl z-10" />
              {/* Screen */}
              <div className="rounded-[2rem] overflow-hidden bg-neutral-900 min-h-[420px] flex flex-col">
                {/* Status bar */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2 text-[10px] text-white/60 font-mono">
                  <span>9:41</span>
                  <div className="flex gap-1 items-center">
                    <div className="w-4 h-2 border border-white/60 rounded-sm relative">
                      <div className="absolute inset-[1px] right-[2px] bg-white/60 rounded-xs" />
                    </div>
                  </div>
                </div>

                {walletTab === 'apple' ? (
                  /* Apple Wallet Pass Preview */
                  <div className="flex-1 flex flex-col px-4 pb-4">
                    {/* Pass card */}
                    <div className="mt-2 rounded-2xl bg-[#0f0f0f] border border-white/10 overflow-hidden flex-1 flex flex-col">
                      {/* Header */}
                      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                            <span className="text-accent text-xs font-bold">TA</span>
                          </div>
                          <span className="text-white/50 text-[10px] font-mono uppercase tracking-wider">Tech Atlas</span>
                        </div>
                        <span className="text-white/30 text-[9px] font-mono">GENERIC</span>
                      </div>

                      {/* Primary field */}
                      <div className="px-4 pt-2 pb-3">
                        <div className="text-white/40 text-[9px] font-mono uppercase tracking-wider">NAME</div>
                        <div className="text-white text-base font-semibold truncate">
                          {profile.name || 'Your Name'}
                        </div>
                      </div>

                      {/* Secondary fields */}
                      <div className="px-4 pb-3 flex gap-4">
                        {(profile.title || !profile.name) && (
                          <div className="flex-1 min-w-0">
                            <div className="text-white/40 text-[8px] font-mono uppercase tracking-wider">TITLE</div>
                            <div className="text-white/90 text-[11px] truncate">{profile.title || '—'}</div>
                          </div>
                        )}
                        {(profile.company || !profile.name) && (
                          <div className="flex-1 min-w-0">
                            <div className="text-white/40 text-[8px] font-mono uppercase tracking-wider">COMPANY</div>
                            <div className="text-white/90 text-[11px] truncate">{profile.company || '—'}</div>
                          </div>
                        )}
                      </div>

                      {/* Auxiliary fields */}
                      <div className="px-4 pb-3 flex gap-4">
                        {profile.email && (
                          <div className="flex-1 min-w-0">
                            <div className="text-white/40 text-[8px] font-mono uppercase tracking-wider">EMAIL</div>
                            <div className="text-white/80 text-[10px] truncate">{profile.email}</div>
                          </div>
                        )}
                        {profile.phone && (
                          <div className="flex-1 min-w-0">
                            <div className="text-white/40 text-[8px] font-mono uppercase tracking-wider">PHONE</div>
                            <div className="text-white/80 text-[10px] truncate">{profile.phone}</div>
                          </div>
                        )}
                      </div>

                      {/* QR Code area */}
                      <div className="mt-auto px-4 pb-4 flex justify-center">
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                          <QrCode className="w-12 h-12 text-neutral-900" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Google Wallet Pass Preview */
                  <div className="flex-1 flex flex-col px-4 pb-4">
                    {/* Pass card */}
                    <div className="mt-2 rounded-2xl bg-white overflow-hidden flex-1 flex flex-col">
                      {/* Header */}
                      <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-neutral-100">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <span className="text-accent text-xs font-bold">TA</span>
                        </div>
                        <span className="text-neutral-500 text-[11px] font-medium">Tech Atlas</span>
                      </div>

                      {/* Main content */}
                      <div className="px-4 pt-4 pb-3">
                        <div className="text-neutral-900 text-lg font-semibold truncate">
                          {profile.name || 'Your Name'}
                        </div>
                        {profile.title && (
                          <div className="text-neutral-500 text-xs mt-0.5">{profile.title}</div>
                        )}
                      </div>

                      {/* Detail rows */}
                      <div className="px-4 space-y-3 pb-4">
                        {profile.company && (
                          <div className="flex items-center gap-2.5">
                            <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <div>
                              <div className="text-neutral-400 text-[9px] uppercase tracking-wider">Company</div>
                              <div className="text-neutral-700 text-[11px]">{profile.company}</div>
                            </div>
                          </div>
                        )}
                        {profile.email && (
                          <div className="flex items-center gap-2.5">
                            <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <div>
                              <div className="text-neutral-400 text-[9px] uppercase tracking-wider">Email</div>
                              <div className="text-neutral-700 text-[11px]">{profile.email}</div>
                            </div>
                          </div>
                        )}
                        {profile.phone && (
                          <div className="flex items-center gap-2.5">
                            <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <div>
                              <div className="text-neutral-400 text-[9px] uppercase tracking-wider">Phone</div>
                              <div className="text-neutral-700 text-[11px]">{profile.phone}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* QR Code area */}
                      <div className="mt-auto px-4 pb-4 flex justify-center border-t border-neutral-100 pt-4">
                        <div className="w-16 h-16 bg-neutral-50 rounded-lg flex items-center justify-center">
                          <QrCode className="w-12 h-12 text-neutral-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA Badge */}
          <button
            onClick={() => handleWallet(walletTab)}
            disabled={!hasSavedProfile || walletLoading !== null}
            className="relative transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {walletLoading === walletTab && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg z-10">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              </div>
            )}
            <Image
              src={walletTab === 'apple' ? '/wallet/apple.svg' : '/wallet/google.svg'}
              alt={walletTab === 'apple' ? 'Add to Apple Wallet' : 'Add to Google Wallet'}
              width={walletTab === 'apple' ? 180 : 210}
              height={48}
              className="h-12 w-auto"
            />
          </button>

          {!hasSavedProfile && (
            <p className="text-xs text-muted font-mono">Save your profile first to enable wallet cards.</p>
          )}

          {error && (
            <span className="flex items-center gap-1 text-xs text-red-400 font-mono">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
