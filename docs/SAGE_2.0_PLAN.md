# Sage Advice 2.0 — Revamp Plan

_Drafted 2026-10-19. Goal: a free app that motivates and educates people in cultivating wisdom._

## 1. Where 1.0 stands

**Stack.** Vite 5, React 18, styled-components 6, framer-motion 11, Redux Toolkit + redux-persist, react-player 2, vite-plugin-pwa. Installable as a PWA already.

**Experience.** Fake 2 s splash → first visit lands on About → Home shows the logo, "Begin your path", and a play button → a full-screen overlay shows a wisdom line over an Unsplash photo, then plays a random YouTube Short → love / skip / refresh. A Loved page with notes and category filters. A meditation timer (1–20 min, bell/rain/waves, wake lock).

**Library.** 99 Shorts tagged across four categories (multi-tagged):

| Category | Videos |
|---|---|
| philosophy | 56 |
| well-being | 53 |
| motivation | 31 |
| mindfulness | 11 |

Top sources (via YouTube oEmbed on 2026-10-19): GROWTH™ 11, Daily Stoic 10, Buddhism 8, TEDx Talks 7, Philosophize This! 7, MINDSET ARCHITECTURE 4, John Vervaeke Clips 4, Philosophy Overdose 3, Ben Lionel Scott 3, The School of Life 2, John Vervaeke's Lectern 2, HealthyGamerGG 2, plus ~25 single-video sources.

**Problems worth fixing regardless of the redesign.**
- **9 of 99 videos no longer resolve** on YouTube (removed or private). There is no health check, so users hit dead players.
- Brand drift: manifest theme color is tan `#d4a373`, the UI accent is blue `#73a5d4` / indigo `#7374d4`. The declared secondary font (Syne) is never loaded; Moderustic is loaded but never used.
- Backgrounds hotlink Unsplash at runtime, so the "wisdom moment" depends on a third party and loads slowly on mobile.
- The custom controls float over the embedded YouTube player. YouTube's developer policies forbid obscuring the player or its attribution (III.F.2.c, III.I.6). Controls must sit outside the player frame.
- styled-components entered maintenance mode in 2025 and react-player 3 is a breaking rewrite. Both are fine today but should not anchor a 2.0.
- The 2 s artificial loader and the forced About redirect add friction before the first moment of value.

## 2. Inspiration scan (Dribbble, Behance, trend write-ups)

What recurs in the strongest wellness and quote work right now:

- **Tubik, "Quotes App" series** (Dribbble, 170k–228k views each): quotes as tactile paper cards with a soft pastel wash, a day counter as the hero number, light and dark as equal first-class themes. Closest in spirit to Sage's "one line of wisdom" moment.
- **strangehelix, "freud" mental-health series** (Dribbble, 25k–71k views): warm earthy palette, oversized expressive type, organic blobs, journaling and reflection as the core loop rather than a side feature.
- **Awsmd / QClay / RonDesignLab "Luma" meditation apps** (Dribbble, 86k–306k views): deep night grounds, a single glowing focal object, generous whitespace, very few controls on screen.
- **K&Z "Emberly" reflection journal** (Dribbble): candle-amber type on near-black. Lamplight rather than clinical white.
- **John Naveen, "Endeavor: a habit tracker with a soul"** (Dribbble): proof that progress UI can feel human when it drops streak-shaming.
- **Behance**: "INSIGHT Mental Health" (bubble clusters of emotions as navigation), "SOMORA Sleep" (night gradient, one big number), "Awaken" and "Bloom" case studies, all leaning on dark-first palettes and one hero metric.
- **2026 trend notes** (line25, wavespace, pixelmatters): translucency used to signal hierarchy rather than decorate; bento blocks only when block size carries meaning; spring/physics motion (Material 3 Expressive, iOS 26 Liquid Glass); bottom-anchored thumb navigation; dark mode as the default for calm products; soft pastels with a warning about contrast.
- **What to avoid**: roughly a third of meditation shots are now "AI meditation" concepts. Sage's edge is the opposite: human-curated, attributed, teachable wisdom.

## 3. Design direction: "Lamplight"

A quiet study at dusk. Sage green (the plant) and candle amber (the existing `#d4a373`) on a deep green-black ground. Dark-first, with a pale-sage light theme that is not a plain inversion.

**Tokens**

| Token | Dark | Light | Use |
|---|---|---|---|
| ground | `#0F1A17` | `#EEF1EA` | page |
| surface | `#16241F` | `#FFFFFF` | cards, sheets |
| ink | `#EDE7DA` | `#1C2622` | text |
| ink-2 | `#A8B3A6` | `#5B6B61` | secondary text |
| sage | `#8FA98F` | `#4F6B5A` | structure, icons, rings |
| amber | `#D4A373` | `#B8853F` | the one accent: play, love, progress |
| ember | `#E9B872` | `#D4A373` | glow / hover |

**Type.** Fraunces (variable serif, optical sizing and the "soft" axis) for wisdom lines and screen titles, set large and unhurried. Manrope stays for UI, labels and body. Tabular numerals for the timer.

**Layout.** Bottom tab bar replaces the sidebar on phones (Today · Paths · Garden · Still · You). Sidebar persists on desktop. One focal object per screen. Translucent surfaces only for the sheet that slides over video.

**Motion (all spring-based, all honoring `prefers-reduced-motion`).**
- *The Unfolding*: the one orchestrated moment. Ambient gradient breathes on a 6 s cycle; the wisdom line fades in word by word; the attribution settles beneath it; then the card lifts and the video slides up from below with a spring (stiffness 170, damping 26). This replaces the loader + play button + overlay sequence.
- *Breathing orb* on the Still screen: scales 1.0 → 1.18 over the inhale, holds, releases. Doubles as the timer progress ring.
- *Love*: the heart fills with amber, a single soft ripple, light haptic on native.
- *Garden growth*: saving wisdom adds a leaf; revisiting it opens the leaf into a bloom. Slow, never bouncy.
- Shared-element transitions between a card in Garden and its player.

## 4. Features that stay in the spirit

Principle: motivate without manipulating. No streak shame, no red badges, no infinite feed.

1. **Today's Sage.** One Short, its wisdom line, the thinker, and a single reflection prompt. Optional gentle reminder at a chosen time (local notification). Replaces random-first with ritual-first; random stays one tap away.
2. **"What do you need today?"** Four intents (calm, courage, clarity, comfort) map to categories and moods. Picks from the library instead of pure random.
3. **Paths.** Curated sequences of 5–7 Shorts with a question after each: *A Stoic Week*, *Sitting with Grief*, *Meaning in a Meaning Crisis* (Vervaeke), *Attention is a Moral Act*, *Beginning Again* (Buddhist), *Courage*. This is the "educator" half.
4. **Thinkers.** Browse by voice (Marcus Aurelius, Epictetus, Thích Nhất Hạnh, Alan Watts, John Vervaeke, Viktor Frankl, Seneca, Dr. K…). One-paragraph bio, which tradition they belong to, their Shorts in the library. Every video shows its creator and links to the source channel.
5. **The Garden** (Loved 2.0). Saved wisdom as a growing garden; notes become a reflection journal with a timeline and search. Ties the lotus logo and the existing "Garden Metaphor" video into the product.
6. **Still** (Meditate 2.0). Breathing patterns (box, 4-7-8, coherent), ambient soundscapes *during* the sit (rain, waves, wind, bowl), interval bells, a simple session log. Background audio on native.
7. **Wisdom cards.** Render the line + thinker as a typographic image and hand it to the native share sheet. Free growth loop and the only "social" feature.
8. **Weekly reflection.** "This week you sat with five ideas." Shows what was saved and written, offers one question. Count of practice days, never a streak.
9. **Offline wisdom.** Lines, prompts and journal work offline; video gracefully says it needs a connection.
10. **Content health + remote library.** A nightly script validates every video via oEmbed and the library ships as remote JSON, so new Shorts and dead-link fixes arrive without an app-store release.
11. **Accessibility.** Dynamic type, captions reminder, reduced motion, high-contrast variant, focus states, VoiceOver/TalkBack labels on every control.

## 5. Expanding the Shorts library

**Content pillars** (tag every video with all that apply): Stoicism · Buddhist practice · Existentialism & meaning · Cognitive science of wisdom · Modern psychology · Emotional life (grief, anger, loneliness) · Attention & stillness · Virtue & character · Mortality.

**New metadata per video:** `thinker`, `tradition`, `mood` (calm/courage/clarity/comfort), `prompt`, `creatorChannel`, `addedAt`, `verifiedAt`.

**Channels to mine next** (same calm, reflective, non-hustle register; vet each for Shorts output and tone before adding):
- Already in the library and deep: Daily Stoic, Philosophize This!, The School of Life, John Vervaeke Clips / Lectern, HealthyGamerGG, TEDx Talks.
- Not yet in the library: Einzelgänger, Pursuit of Wonder, Orion Philosophy, Sisyphus 55, Alan Watts Organization, Plum Village (Thích Nhất Hạnh), Love Serve Remember (Ram Dass), Tara Brach, Big Think, TED-Ed, Freedom in Thought, Aperture, Mini Philosophy (Jonny Thomson), Iain McGilchrist clips, Academy of Ideas (check tone video by video), The Stoic Mind.
- Keep out: hustle/grind motivation, manosphere stoicism, anything that needs a sales funnel.

**Curation rule of thumb:** under 90 s, a single idea, attributed, secular or pluralist, and it leaves the viewer with something to practice.

## 6. Can it go on the App Store and Google Play, free?

**Yes.** The practical route is a Capacitor 8 shell around the existing web build (bundled assets, not a remote URL), with a handful of native plugins. No rewrite.

**Costs and gates**

| | Apple App Store | Google Play |
|---|---|---|
| Developer fee | $99 / year (waiver only for nonprofits, accredited schools, government) | $25 one-time |
| Pre-launch gate | TestFlight (optional but wise) | Personal accounts created after 13 Nov 2023 must run a closed test with ≥12 testers opted in for 14 consecutive days before production access |
| Privacy | Privacy policy URL + privacy "nutrition label" required even with zero data collection | Privacy policy URL + Data safety form |
| Free app | No in-app purchases means the simplest review path | Same |

**Risks to design around**

1. **Apple Guideline 4.2 / 4.2.2** rejects apps that are a "repackaged website" or a "collection of links / content aggregator". A wrapper that only plays YouTube is exactly that. The 2.0 features (journal, Paths, breathing, notifications, share cards, offline wisdom, haptics) are what make it an app.
2. **Apple 5.2.2 / 5.2.3** require that third-party content is used within the provider's terms. YouTube's API Services policies permit the embedded player but require visible YouTube attribution, no overlays on the player (III.F.2, III.I.6), no ads on or around it (III.G.1), no rewards for watching (III.F.3.c), and "significant independent value" beyond YouTube itself (III.I.1). Move controls out of the player frame and keep the creator credit visible.
3. **YouTube "Error 153" inside iOS WKWebView.** Embeds that work in Safari can fail inside Capacitor because the referrer is missing. Mitigations, in order: `referrerpolicy="strict-origin-when-cross-origin"` on the iframe and `youtube-nocookie.com`; serve the player from a small page on your own domain; or use a Capacitor plugin that wraps the official iOS/Android YouTube player SDKs. **Do this spike first, on a real iPhone, before any other store work.**
4. **Google Play webview policy** is enforced more tightly since 2025; bundling assets plus real native features clears it.
5. **Content updates**: remote JSON for the library means new videos never wait on review.

**Native plugins needed:** Local Notifications, Haptics, Share, Filesystem (card export), App (background/foreground), Status Bar, Splash Screen, Keep Awake, and a native audio session for the timer.

**Alternative:** keep PWA-only. Zero fees, installable on both platforms, but no store discovery, weaker iOS notification support, and no "download it" credibility. Recommended as the fallback, not the plan.

## 7. Tech modernization (in service of the above)

- Vite 6+, React 19, TypeScript 5.x; `motion` v12 (framer-motion's successor); replace styled-components with CSS Modules + design tokens (CSS variables already exist in GlobalStyles).
- Replace redux-persist with a small Zustand store persisted to IndexedDB (journal, garden, sessions), with an export/import to JSON so people own their data.
- Library as `content/videos.json` with a schema (zod) validated in CI; a `scripts/check-videos.ts` oEmbed health check run nightly by GitHub Actions.
- Ship backgrounds as optimized local images (or generated gradients) instead of Unsplash hotlinks.
- Playwright smoke tests for the Unfolding and the timer.

## 8. Roadmap

| Phase | Weeks | Outcome |
|---|---|---|
| 0. Foundations | 1 | Dead-video purge, new schema + metadata, health-check script, **YouTube-in-WKWebView device spike** |
| 1. Design system | 1–2 | Tokens, type, components, motion primitives, bottom nav, both themes |
| 2. Core screens | 3–4 | Today, Paths, Garden (journal), Still (breathing + sounds), Thinkers |
| 3. Native shell | 2 | Capacitor 8, notifications, share cards, haptics, background audio; TestFlight + Play closed test (recruit 12 testers) |
| 4. Launch | 1–2 | Store assets, privacy policy, listing copy, first 3 Paths, 150+ verified Shorts |

## Sources

- Apple App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Apple Developer Program fee and waiver: https://developer.apple.com/programs/whats-included/
- Google Play closed-testing requirement: https://support.google.com/googleplay/android-developer/answer/14151465
- YouTube API Services Developer Policies: https://developers.google.com/youtube/terms/developer-policies
- Capacitor support policy (v8 active since Dec 2025): https://capacitorjs.com/docs/next/main/reference/support-policy
- YouTube Error 153 notes: https://til.simonwillison.net/youtube/fixing-153-embed and https://dev.to/davidvesely/fixing-youtube-error-153-in-ios-capacitor-apps-a-simple-proxy-solution-607
- Dribbble searches: https://dribbble.com/search/wisdom-quotes-app · https://dribbble.com/search/meditation-app · https://dribbble.com/search/reflection-journal-app
- Behance search: https://www.behance.net/search/projects?search=meditation%20app%20ui
- Trend write-ups: https://line25.com/articles/web-design-trends-2026/ · https://www.wavespace.agency/blog/ui-design-trends · https://www.pixelmatters.com/insights/7-UI-design-trends-to-watch-in-2026
