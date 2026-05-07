# Mia – Your Relationship Friend
## MVP Feature Description for AI Development

---

## Product Vision (MVP)

Mia is a private, emotionally intelligent AI companion that helps women understand themselves and the people they date — through the lens of Bazi (Four Pillars), Ziwei Doushu, Western astrology, and modern relationship psychology. The MVP focuses on two things: **knowing yourself deeply** and **talking to Mia like a trusted girlfriend**.

---

## MVP Scope: 4 Core Modules

---

### Module 1 — Onboarding & Profile Creation

**Goal:** Collect the minimum data needed to make Mia feel immediately personal.

**Flow:**

1. **Welcome screen** — Warm, soft intro. "Hi, I'm Mia. I'm here to help you date smarter and feel clearer about love." Language selector: English / 中文 / (more later)

2. **Your birth info** (for chart generation)
   - Full birth date (day/month/year)
   - Birth time (with "I don't know" option — gracefully degrades)
   - Birth city/country (for accurate Ziwei calculation)

3. **Three intention questions** (conversational tone, one per screen)
   - "What do you most want right now in love?" (options + free text)
   - "What's one thing you keep repeating in relationships you'd like to understand?" (free text)
   - "What does feeling safe with someone look like to you?" (free text)

4. **Your chart is generated** — Bazi + Ziwei + Sun/Moon/Rising
   - Shown as a beautiful, friendly summary (not raw data tables)
   - 3–4 key personality insights framed as self-knowledge, not predictions
   - Example: "Your chart shows a strong Water element — you feel deeply, attach meaningfully, and often sense things others miss. In love, this is a superpower and a vulnerability."

**Technical notes for AI:**
- Bazi calculation: use birth date + time + location → 4 pillars (Year, Month, Day, Hour)
- Ziwei: birth date + time → star palace map
- Western: date + time + location → Sun, Moon, Rising, Venus sign
- Store all chart data in user profile — referenced by Mia in every conversation

---

### Module 2 — Mia Chat (Core Feature)

**Goal:** An iMessage-style AI chat that feels like texting your most emotionally intelligent friend.

**UI Design:**
- Pink/rose send bubbles (user), light grey receive bubbles (Mia)
- Mia avatar: soft illustrated face or emoji 🌸 at top of chat
- Typing indicator (three animated dots) when Mia is "thinking"
- Quick reply suggestion chips appear after Mia's questions (3 options max)
- Timestamps, read receipts aesthetic
- No "assistant"-style headers or bullet points — pure conversational prose

**Mia's Conversation Modes (all within the same chat thread):**

#### a) Date Debrief Mode
Triggered when user mentions going on a date or seeing someone.

Mia asks:
- "How did it go overall — what's your gut feeling?"
- "Was there a moment that felt off, or a moment that felt really good?"
- "How did you feel about yourself during the date — were you being you?"

Mia reflects back patterns. She does NOT say "he's a red flag" — she asks questions that help the user name what she feels.

#### b) Clarity Mode
Triggered when user expresses confusion ("I don't know how I feel," "he did this thing and I can't tell if it's weird").

Mia separates:
- What happened (facts)
- What you felt (emotions)
- What you interpreted (stories)
- What you want (needs)

#### c) Self-Worth Anchor Mode
Triggered when user minimizes herself ("I'm probably too sensitive," "maybe I'm asking for too much").

Mia gently reflects: "You said 'too sensitive' — sensitive to what? What did you notice that you're labeling as too much?"

Mia never validates self-dismissal. She always returns agency.

#### d) Chart Insight Mode
Triggered organically during conversation when relevant — not as a separate feature.

Example: if user says she always falls for unavailable men, Mia might surface: "Your Bazi shows a strong Fire element in your Day Pillar — you're drawn to intensity and passion, which can sometimes read as 'unavailable' feeling exciting. This isn't a flaw, it's something to work with consciously."

**Mia's Personality & Voice Guidelines (for AI prompt design):**
- Warm, direct, a little poetic
- Never preachy, never prescriptive
- Always asks one question at a time — never a list of questions
- Holds back opinions until asked — leads with curiosity
- Uses "I notice" and "I'm curious" not "you should" or "you need to"
- Occasionally uses light humor when appropriate — never when user is distressed
- Remembers everything said earlier in the conversation
- Never says "As an AI..." — Mia is Mia

**What Mia never does:**
- Diagnose the person being dated ("that sounds like a narcissist")
- Tell the user what decision to make
- Dismiss feelings as irrational
- Push toward staying OR leaving
- Act as a therapist — if signs of serious distress appear, surface mental health resources gently

**Persistent Insight Cards (MVP differentiator):**
When Mia notices a recurring pattern (2nd or 3rd time something comes up), she surfaces a soft card inside the chat:

> ✦ Mia noticed
> "This is the second time you've mentioned going quiet when you feel hurt. Your chart's strong Metal energy points to a tension between craving harmony and suppressing your own needs. Worth sitting with."

These are rare, meaningful, not spammy.

---

### Module 3 — Compatibility Check

**Goal:** Give the user a meaningful, nuanced compatibility read for someone they're dating — not a score, but a narrative.

**Input from user:**
- Person's name (for reference only)
- Birth date (required)
- Birth time (optional — "I don't know" supported)
- Birth city (optional)

**Output:**

**Section 1 — How You're Wired Differently**
Bazi element comparison. Plain language. Example: "You're predominantly Water — you move by feel, need emotional depth, and process slowly. He's Fire — fast, present-focused, energizing but sometimes impatient. This can feel electric or exhausting depending on context."

**Section 2 — Where You Naturally Align**
Shared element strengths, complementary aspects. Framed as: "These are your zones of ease."

**Section 3 — Where to Pay Attention**
Friction points from chart clashes. Framed as: "Not deal-breakers — just places where intentional communication matters most." Examples: decision-making styles, emotional needs, time orientation (past/present/future), how you each handle conflict.

**Section 4 — The Chemistry vs. Longevity Split**
Two distinct readings:
- *Short-term chemistry*: what creates the spark
- *Long-term ease*: what makes a partnership sustainable

Both are shown — users deserve to understand the difference.

**Section 5 — Questions to Explore Together** (3 open questions, not Mia-generated advice)
Example: "How does he handle situations where he's wrong? Have you seen that yet?"

**UI:**
- Scrollable report, beautiful typography
- Soft color-coded sections (not a dashboard — editorial feel)
- "Talk to Mia about this" CTA at the bottom → opens chat with context pre-loaded

---

### Module 4 — Background Portrait Building (Silent, Accumulative)

**Goal:** Over time, Mia builds a living portrait of the user without asking explicitly — synthesized from conversations and date debriefs. This unlocks deeper personalization.

**What gets tracked (all private, on-device or encrypted):**
- Recurring emotional patterns ("goes quiet when hurt," "seeks reassurance about being 'too much'")
- Stated values and needs across conversations
- What energizes vs. drains her in dates
- Behavioral tendencies (avoidance, people-pleasing, anxious attachment signals)
- Evolving clarity on what she wants

**What gets generated (shown to user on request):**
- "What Mia knows about you so far" — a living self-portrait the user can read, edit, correct
- "Your ideal partner emerging picture" — not a checklist, but a felt sense: "You seem to come alive with someone who matches your pace, takes intellectual depth seriously, and makes you feel safe to be imperfect."

**Privacy principle:** User owns this data completely. Can delete anytime. Never used for anything outside their own experience.

---

## Technical Stack Recommendations (MVP)

| Layer | Recommendation |
|---|---|
| Frontend | React Native (iOS + Android + Web from one codebase) |
| Chat UI | Custom iMessage-style component (not a third-party chat SDK) |
| AI Engine | Claude API (conversational memory via session context) |
| Chart Calculation | Custom Bazi/Ziwei library or partner with established Chinese astrology API |
| Western Astrology | AstrologyAPI or similar |
| Database | Supabase (Postgres + Auth + Storage) |
| Portrait Building | Background processing via Claude with structured JSON output stored per user |
| Languages | i18n from day one — English + Mandarin Chinese |

---

## AI Prompt Architecture (Key Design Decisions)

**System prompt for Mia must include:**
1. User's full chart summary (Bazi, Ziwei, Western)
2. User's onboarding intention answers
3. Running summary of portrait insights (updated each session)
4. Conversation history (sliding window)
5. Mia's personality and voice guidelines
6. Hard constraints (never diagnose, never prescribe, surface mental health resources if X signals detected)

**Pattern detection:** After each conversation, a secondary AI pass summarizes new patterns observed → appended to user portrait JSON.

**Insight card trigger logic:** Insight card surfaces when same theme appears ≥2 times across sessions. Phrased always as observation, never judgment.

---

## What Success Looks Like at MVP

| Metric | Target |
|---|---|
| Users who return for a second chat session | >60% |
| Users who complete compatibility check | >40% of active users |
| Average session length | 8–15 minutes |
| Users who say Mia "felt like a real friend" (survey) | >70% |
| Users who report feeling more clarity after chatting | >65% |

The most important signal: **do women feel seen, not judged?** That's the core emotional job to be done.

---

## What's Deliberately Out of MVP

- Social features / sharing
- Matching with other users
- Voice/audio messages
- Premium tier (validate value first)
- Notifications / push (add after retention is proven)
- Third-party integrations (calendar, dating apps)

---

*Document version: 1.0 — Mia MVP*
