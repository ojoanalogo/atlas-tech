# Header Scroll Transformation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dynamic scroll-driven shape transformation to the Header — floating with rounded corners and accent glow at the top, morphing to a compact full-width sticky bar on scroll.

**Architecture:** Install `motion` (Framer Motion v11+), use `useScroll` + `useMotionValueEvent` to detect scroll position, toggle between two `motion.header` variant states with spring physics. Only the header wrapper changes — all internal content stays the same.

**Tech Stack:** Next.js, React, Framer Motion (`motion`), Tailwind CSS v4

---

### Task 1: Install Framer Motion

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the motion package**

Run:
```bash
npm install motion
```

- [ ] **Step 2: Verify installation**

Run:
```bash
node -e "require('motion'); console.log('motion OK')"
```
Expected: `motion OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install motion (framer-motion v11+)"
```

---

### Task 2: Add scroll detection and motion.header wrapper

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Add motion imports and scroll state**

At the top of `Header.tsx`, add the `motion` import and replace the existing React imports to include what's needed:

```tsx
// Add this import after the existing React imports
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
```

Inside the `Header` component, after the existing `usePathname()` call, add scroll detection:

```tsx
const { scrollY } = useScroll()
const [scrolled, setScrolled] = useState(false)

useMotionValueEvent(scrollY, "change", (latest) => {
  setScrolled(latest > 50)
})
```

- [ ] **Step 2: Replace `<header>` with `motion.header`**

Replace the opening `<header>` tag (currently line 50):

```tsx
// BEFORE:
<header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
```

```tsx
// AFTER:
<motion.header
  animate={scrolled ? "sticky" : "floating"}
  variants={{
    floating: {
      marginLeft: 16,
      marginRight: 16,
      marginTop: 12,
      borderRadius: 16,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(26,122,79,0.1)",
    },
    sticky: {
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      borderRadius: 0,
      boxShadow: "none",
    },
  }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
>
```

Replace the closing `</header>` tag (currently line 130):

```tsx
// BEFORE:
</header>
```

```tsx
// AFTER:
</motion.header>
```

- [ ] **Step 3: Verify the dev server runs without errors**

Run:
```bash
npm run dev
```

Open the site in a browser. Scroll up and down — the header should animate between the floating (rounded, margins, glow) and sticky (full-width, flat) states.

Expected behavior:
- At the top: header has ~16px side margins, 12px top margin, rounded corners (16px), subtle accent glow shadow
- After scrolling ~50px: header smoothly springs to full-width, no margins, no radius, no shadow
- Scrolling back up reverses the animation

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: add scroll-driven header transformation with framer motion"
```

---

### Task 3: Refine backdrop blur and background opacity per state

**Files:**
- Modify: `src/components/layout/Header.tsx`

The base Tailwind classes provide `bg-background/80 backdrop-blur-md` which is fine for the floating state but the sticky state should feel more solid. Add `backdropFilter` to the variants for a tighter blur when scrolled.

- [ ] **Step 1: Add backdropFilter to variants**

Update the variants object in the `motion.header`:

```tsx
variants={{
  floating: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 12,
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(26,122,79,0.1)",
    backdropFilter: "blur(16px)",
  },
  sticky: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    borderRadius: 0,
    boxShadow: "none",
    backdropFilter: "blur(20px)",
  },
}}
```

Also update the className to remove the static `backdrop-blur-md` since Framer Motion now controls it:

```tsx
className="sticky top-0 z-50 bg-background/80 border-b border-border"
```

- [ ] **Step 2: Adjust height for compact sticky state**

Update the inner container div (the `max-w-7xl` div) to respond to the scrolled state. Change its className to use a dynamic height:

```tsx
<div className={`max-w-7xl mx-auto px-4 flex items-center justify-between transition-[height] duration-300 ${scrolled ? 'h-12' : 'h-14'}`}>
```

This uses a CSS transition for height since it's on a child element, not the motion.header itself. The `transition-[height]` + `duration-300` gives a smooth height change that syncs visually with the spring animation on the parent.

- [ ] **Step 3: Verify in browser**

Run dev server and check:
- Floating state: softer blur (16px), taller header (h-14)
- Sticky state: tighter blur (20px), compact header (h-12)
- Height transition is smooth and in sync with the spring animation

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: refine header blur, opacity, and height per scroll state"
```

---

### Task 4: Add responsive floating margins for desktop

**Files:**
- Modify: `src/components/layout/Header.tsx`

The spec calls for `16px` margins on mobile and `24px` on `lg`+. Since Framer Motion variants don't support responsive values directly, we use a media query hook or a simpler approach: use CSS `clamp()` or just a wider margin that works well at all sizes.

- [ ] **Step 1: Use a window width check for responsive margins**

Add a simple responsive check inside the `Header` component, after the scroll detection:

```tsx
const [isLg, setIsLg] = useState(false)

useEffect(() => {
  const mql = window.matchMedia('(min-width: 1024px)')
  setIsLg(mql.matches)
  const handler = (e: MediaQueryListEvent) => setIsLg(e.matches)
  mql.addEventListener('change', handler)
  return () => mql.removeEventListener('change', handler)
}, [])
```

- [ ] **Step 2: Update the floating variant to use responsive margins**

```tsx
variants={{
  floating: {
    marginLeft: isLg ? 24 : 16,
    marginRight: isLg ? 24 : 16,
    marginTop: 12,
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(26,122,79,0.1)",
    backdropFilter: "blur(16px)",
  },
  sticky: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    borderRadius: 0,
    boxShadow: "none",
    backdropFilter: "blur(20px)",
  },
}}
```

- [ ] **Step 3: Verify at different viewport widths**

Check in browser:
- Mobile viewport (<1024px): floating state has 16px side margins
- Desktop viewport (>=1024px): floating state has 24px side margins
- Resizing the window live updates the margin

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: responsive floating margins for desktop header"
```

---

### Task 5: Final polish and edge case handling

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Suppress hydration mismatch for scroll/media state**

Both `scrolled` and `isLg` default to `false` on the server but may differ on the client. This is fine since the initial render (floating, mobile margins) is the correct SSR default. But to be explicit and avoid any flash, ensure the initial `animate` uses the `"floating"` variant which matches the SSR class output. This is already the case since `scrolled` starts as `false`.

Verify: no changes needed if `scrolled` defaults to `false` and `isLg` defaults to `false`. The initial render will always be the floating/mobile state.

- [ ] **Step 2: Verify the dropdown menu still works in the floating state**

Open the site, keep the header in floating state (at top of page), and click "Directorio" dropdown. The dropdown should:
- Open correctly beneath the button
- Position correctly relative to the rounded floating header
- Close on click outside and on Escape

If the dropdown overflows the rounded corners, add `overflow: visible` to the motion.header (it should be the default, but verify).

- [ ] **Step 3: Verify mobile menu still works**

On a mobile viewport:
- The hamburger menu should open the full-screen overlay
- The floating header shape should still be visible before opening the menu
- Closing the menu restores normal state

- [ ] **Step 4: Run the production build**

```bash
npm run build
```

Expected: builds without errors or warnings related to the header changes.

- [ ] **Step 5: Commit final state**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: header scroll transformation complete"
```
