# Header Scroll Transformation

## Summary

Add a dynamic scroll-driven shape transformation to the site header. At the top of the page, the header floats with rounded corners, horizontal margins, and an accent glow shadow. On scroll (~50px), it smoothly morphs into a compact full-width sticky bar using Framer Motion spring animations.

## Decisions

- **Animation library:** Framer Motion (`motion` package, v11+) — chosen over pure CSS transitions for spring physics and smooth multi-property interpolation
- **Style:** Bold — dramatic floating state with accent glow, pronounced transition to compact sticky
- **Scope:** Header wrapper only — no changes to nav links, dropdown, mobile menu, or any internal components

## Behavior

### Floating State (scrollY < 50px)

- Horizontal margins: `16px` on mobile, `24px` on `lg`+
- Top margin: `12px`
- Border radius: `16px`
- Background: `background/80` with `backdrop-blur(16px)`
- Shadow: `0 8px 32px rgba(0,0,0,0.4)` + subtle accent border glow `0 0 0 1px rgba(accent, 0.1)`
- Border: `1px solid border` (existing token) at reduced opacity
- Height: standard `h-14`

### Sticky State (scrollY >= 50px)

- Horizontal margins: `0`
- Top margin: `0`
- Border radius: `0`
- Background: `background/95` with `backdrop-blur(20px)`
- Shadow: none (replaced by bottom border)
- Border-bottom: `1px solid border`
- Height: compact `h-12`
- Inner padding tightens slightly

### Transition

- Driven by `useScroll().scrollY` via `useMotionValueEvent`
- Toggles a `scrolled` boolean state
- `motion.header` uses `animate` prop with two variant objects
- Spring config: `type: "spring", stiffness: 300, damping: 30` — snappy but smooth
- Scroll threshold: `50px`

## Files to Modify

### New dependency

- `motion` (npm package) — Framer Motion v11+ React bindings

### Modified files

- `src/components/layout/Header.tsx` — wrap `<header>` with `motion.header`, add scroll listener, animate between floating/sticky states. Internal nav content unchanged.

### Unchanged

- Mobile menu overlay — no transformation applied
- `useClickOutside` hook, escape key handling, pathname-based mobile close
- ThemeToggle, UserMenu, dropdown, all nav links
- No CSS file changes needed — all animation via Framer Motion inline

## Technical Details

```tsx
// Scroll detection
const { scrollY } = useScroll()
const [scrolled, setScrolled] = useState(false)

useMotionValueEvent(scrollY, "change", (latest) => {
  setScrolled(latest > 50)
})

// motion.header with animate prop
<motion.header
  animate={scrolled ? "sticky" : "floating"}
  variants={{
    floating: {
      marginLeft: 16, marginRight: 16, marginTop: 12,
      borderRadius: 16,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(26,122,79,0.1)",
    },
    sticky: {
      marginLeft: 0, marginRight: 0, marginTop: 0,
      borderRadius: 0,
      boxShadow: "none",
    },
  }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  className="sticky top-0 z-50 ..."
>
```

## Out of Scope

- Hide-on-scroll-down / show-on-scroll-up behavior
- Mobile menu animation changes
- Any content or layout changes within the header
- Color/theme changes on scroll
