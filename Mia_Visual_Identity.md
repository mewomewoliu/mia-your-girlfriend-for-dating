# Mia — Visual Identity Guide
## Design Language: Deep Green Glass

---

## Core Aesthetic Direction

**"Deep Green Glass"**

Mia's visual identity is built on one emotional truth: *this is a private, safe space where you can say anything.* The UI disappears into the background — dark, breathing, atmospheric — so the conversation feels like the only thing that exists.

Inspired by Pillowtalk's moody depth, adapted with deep forest greens, sage, and dark teal. Minimalist to the point of silence. Glass morphism throughout. Nothing is solid, nothing is loud.

---

## Color System

### Background
- **Base:** `#080c09` — near-black with the faintest green undertone. Never cold grey, never pure black.
- **Gradient mesh orbs** — three overlapping blurred shapes drifting slowly across the canvas:

| Orb | Color | Opacity | Position |
|---|---|---|---|
| Forest deep | `#2a5c52` | 75% | Top-right |
| Dark green | `#1e412d` | 60% | Mid-left |
| Shadow green | `#143226` | 50% | Bottom-right |
| Glow hint | `#6b9e7e` | 12% | Mid-lower |

- **Film grain overlay:** 4% opacity — adds analog warmth, prevents the background from reading as digital or flat

### Accent Colors

| Token | Value | Usage |
|---|---|---|
| `--green-primary` | `#6b9e7e` | Active states, borders, send button, nav active |
| `--sage` | `#8aab8f` | Insight card labels, secondary accents, quick replies |
| `--green-muted` | `#4a7a5c` | Subtle borders, dividers |
| `--text-primary` | `#e8ede9` | All body text — warm white with a green breath |
| `--text-secondary` | `#8a9e8d` | Timestamps, labels, hints, placeholders |
| `--glass` | `rgba(255,255,255,0.05)` | All surface backgrounds |
| `--glass-border` | `rgba(255,255,255,0.08)` | All surface borders |
| `--user-bubble` | `rgba(107,158,126,0.22)` | User chat bubble fill |
| `--mia-bubble` | `rgba(255,255,255,0.045)` | Mia chat bubble fill |

### What Never Appears
- Any warm hue (pink, orange, red, yellow)
- White or light backgrounds
- Purple or blue tones
- High-saturation greens (no neon energy)
- Hard drop shadows

---

## Typography

### Display — Mia's Voice
**Font:** `DM Serif Display` — italic
**Weight:** Regular (400)
**Case:** lowercase
**Size:** 26–36px
**Use:** Opening prompts, onboarding questions, section intros
**Example:** *"what are you feeling about him?"*

The italic serif feels like handwriting — intimate, not authoritative.

### Body — Conversation
**Font:** `DM Sans`
**Mia messages:** Weight 300 (Light) — delicate, considered
**User messages:** Weight 400 (Regular) — grounded, present
**Size:** 14–15px
**Case:** Mia always lowercase. User text as typed.

### Meta — Labels, Nav, Timestamps
**Font:** `DM Sans`
**Weight:** 400
**Size:** 9.5–11px
**Case:** lowercase
**Color:** `#8a9e8d`

### Type Scale
```
Display (Mia prompts):  28–36px  DM Serif Display Italic
Headline:               18–22px  DM Serif Display
Body / Chat:            14–15px  DM Sans 300–400
Caption / Meta:         9.5–11px DM Sans 400
```

---

## Components

### Chat Bubbles

**User (sent):**
```
background:      rgba(107,158,126,0.22)
border:          1px solid rgba(107,158,126,0.28)
backdrop-filter: blur(20px)
border-radius:   20px 20px 4px 20px
padding:         10px 14px
color:           #e8ede9
font-weight:     400
```

**Mia (received):**
```
background:      rgba(255,255,255,0.045)
border:          1px solid rgba(255,255,255,0.07)
backdrop-filter: blur(20px)
border-radius:   20px 20px 20px 4px
padding:         10px 14px
color:           #e8ede9
font-weight:     300
```

Both bubbles: fully glass. The background always shows through. No solid fills anywhere.

### Insight Card (inside Mia bubble)
```
background:   rgba(107,158,126,0.08)
border:       1px solid rgba(107,158,126,0.2)
border-radius: 12px
padding:      10px 12px
```
Label: `9px DM Sans 500 uppercase #8aab8f letter-spacing 1.2px`
Text: `12px DM Sans 300 rgba(232,237,233,0.75)`

Surfaces only when Mia notices a pattern repeating. Never spammy.

### Buttons

**Primary:**
```
background:      rgba(107,158,126,0.22)
border:          1px solid rgba(107,158,126,0.35)
border-radius:   22px (pill)
padding:         10px 20px
color:           #e8ede9
font:            DM Sans 400
backdrop-filter: blur(12px)
```

**Ghost:**
```
background:   transparent
border:       1px solid rgba(255,255,255,0.1)
border-radius: 22px
color:        rgba(232,237,233,0.6)
```

No solid-fill buttons. Even primary buttons are glass-tinted.

### Input Field
```
background:      rgba(255,255,255,0.04)
border:          1px solid rgba(255,255,255,0.08)
border-radius:   26px
padding:         10px 16px
backdrop-filter: blur(16px)
focus border:    rgba(107,158,126,0.35)
```

### Navigation Bar
```
background:      rgba(8,12,9,0.88)
backdrop-filter: blur(24px)
border-top:      1px solid rgba(255,255,255,0.05)
```
Active icon/label: `#6b9e7e`
Inactive: `rgba(138,158,141,0.35)`

---

## Motion

### Principles
- Ambient over reactive — the background lives, the UI is quiet
- Ease-out for everything — nothing snaps
- One slow animation per screen: the breathing background

### Gradient Orb Drift
```css
@keyframes orb-drift {
  0%, 100% { transform: translate(0,0) scale(1); }
  33%  { transform: translate(18px,-22px) scale(1.06); }
  66%  { transform: translate(-12px,12px) scale(0.96); }
}
/* Duration: 11–22s per orb, staggered */
```

### Mia Orb Breathe
```css
@keyframes orb-breathe {
  0%,100% { box-shadow: 0 0 20px rgba(107,158,126,0.2); transform: scale(1); }
  50%     { box-shadow: 0 0 28px rgba(107,158,126,0.35); transform: scale(1.03); }
}
/* Duration: 4s */
```

### Bubble Entrance
```css
@keyframes bubble-in {
  from { opacity: 0; transform: translateY(7px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Duration: 320ms ease-out */
```

---

## Mia's Visual Identity

Mia is never a photo or a generic AI avatar.

She is a **glowing glass orb** — a soft radial gradient from sage at center to near-black at edge, with a green glow that slowly breathes. Inside: the mark `M✦` in DM Serif Display italic.

```
Size:       42px diameter
Background: radial-gradient — rgba(138,171,143,0.5) → rgba(42,92,82,0.7) → rgba(8,12,9,0.8)
Border:     1px solid rgba(107,158,126,0.3)
Glow:       0 0 20px rgba(107,158,126,0.2), 0 0 40px rgba(107,158,126,0.08)
Animation:  orb-breathe 4s infinite
```

The orb signals: alive, intelligent, warm, present — without being human.

---

## Five Design Principles

1. **Dark first.** Every screen starts from `#080c09`. There is no light mode.

2. **Glass over solid.** No opaque surfaces. Everything is translucent. The background always shows through every card, bubble, and button.

3. **Green is the only colour.** Deep forest, sage, and muted green are the sole accent hues. Nothing else enters the system.

4. **Atmosphere moves.** The gradient orbs drift slowly behind everything — always in motion, never demanding attention.

5. **Type breathes.** DM Serif italic for anything Mia initiates. DM Sans light for everything else. Lowercase always.

---

## Anti-Patterns

| Never | Always |
|---|---|
| Any pink, warm, or saturated hue | Forest green and sage only |
| White or light backgrounds | Near-black base |
| Solid opaque cards or buttons | Glass morphism throughout |
| Uppercase labels | lowercase |
| Hard drop shadows | Glow effects or none |
| Photo or illustrated avatar | Abstract glowing orb |
| Saturated / neon greens | Muted, dark, natural greens |
| Busy animations | One slow ambient drift |

---

*Mia Visual Identity v2.0 — Deep Green Glass*
*Inspired by Pillowtalk's atmospheric darkness. Made minimal, botanical, and distinctly Mia.*
