'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from '@/lib/auth-client'
import { Save, CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

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
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
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
          Generate a digital business card for Apple Wallet or Google Wallet. Save your profile first.
        </p>

        {/* Card Preview */}
        <div className="mb-6 p-6 rounded-xl bg-card border border-border max-w-sm">
          <div className="text-xs font-mono text-muted uppercase tracking-wider mb-1">Tech Atlas</div>
          <div className="text-lg font-bold text-primary">{profile.name || 'Your Name'}</div>
          {profile.title && <div className="text-sm text-secondary">{profile.title}</div>}
          {profile.company && <div className="text-sm text-muted">{profile.company}</div>}
          <div className="mt-3 space-y-1">
            {profile.email && <div className="text-xs font-mono text-muted">{profile.email}</div>}
            {profile.phone && <div className="text-xs font-mono text-muted">{profile.phone}</div>}
          </div>
        </div>

        {/* Wallet Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleWallet('apple')}
            disabled={!hasSavedProfile || walletLoading !== null}
            className="flex items-center gap-2 px-4 py-2 text-sm font-mono font-medium bg-primary text-background rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {walletLoading === 'apple' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            Add to Apple Wallet
          </button>
          <button
            onClick={() => handleWallet('google')}
            disabled={!hasSavedProfile || walletLoading !== null}
            className="flex items-center gap-2 px-4 py-2 text-sm font-mono font-medium border border-border text-primary rounded-md hover:bg-elevated transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {walletLoading === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            Add to Google Wallet
          </button>
        </div>
      </div>
    </div>
  )
}
