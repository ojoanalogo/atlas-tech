# Entry Detail Page Improvements

## Problem
The `[category]/[slug].astro` entry detail page has several UX/visual issues:
1. Low-info entries look "weak" with mostly empty sidebar
2. Rectangular logos don't fit well in the square overlap container
3. "Areas de enfoque" amber colors clash with the green accent theme
4. Tags are barely visible (muted colors blend with background)
5. Section headers lack visual weight and icons
6. Missing Lucide icons in sidebar details

## Design

### 1. Adaptive Layout
- **Threshold**: If sidebar has <=2 cards worth of content (few details + location only), switch to single-column centered layout (`max-w-3xl mx-auto`)
- **Rich entries**: Keep two-column `lg:grid-cols-[1fr_20rem]` layout
- In single-column mode, details and location merge into a compact horizontal strip below the header

### 2. Adaptive Logo Container
- Square logos: current `rounded-xl` 72x72 overlap
- Wide/rectangular logos: wider container `max-w-[140px] h-[56px]` with `object-contain`, padding, pill-shaped

### 3. Section Headers with Lucide Icons
Each section header gets a paired Lucide icon:
- Acerca de → `Info`
- Detalles → `LayoutList`
- Ubicacion → `MapPin`
- Enlaces → `Link`
- Habilidades → `Wrench`
- Servicios → `Cog`
- Tecnologias → `Cpu`
- Areas de enfoque → `Target`
- Tags → `Tag` (new visible header)

### 4. Tags Visibility
- Old: `bg-elevated border-border text-muted`
- New: `bg-accent/10 text-accent border-accent/20`

### 5. Focus Areas Colors
- Old: `bg-amber-500/10 text-amber-400 border-amber-500/20`
- New: Use entry type badge color family (blue for communities)

### 6. Sidebar Detail Icons
Each detail row gets a Lucide icon:
- Fundada → `Calendar`
- Equipo → `Users`
- Etapa → `TrendingUp`
- Sector → `Building2`
- Miembros → `Users`
- Frecuencia → `Clock`
- Plataforma → `Monitor`
- Rol → `UserCheck`
- Empresa → `Building`
