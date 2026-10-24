# Verification record

24 October 2026. Performed by the AI development session on Windows. These are developer checks, not a trial with another person.

## Source and automated checks — passed

- `node --check script.js`: valid JavaScript.
- `node --test tests/interaction.test.cjs`: **9 tests passed** using Node's built-in runner and a simulated DOM/clock.
- Covered blank and literal HTML-like names, exact first-feed values, repeated-action locking, the second valid feed and third refused feed, all refusal thresholds and their allowed boundaries, eight-action completion, reset during a reaction, stale callbacks, reduced-motion drawing and visibility lifecycle.
- Different action drawings and changing frames were checked. This verifies draw commands, not their visual quality; browser screenshots were reviewed separately.
- No fixed Chinese text remains in HTML/CSS/JavaScript. IDs are unique and source asset references resolve. The font is a real bundled TTF with its full OFL license.

## Real browser checks — passed

Tested through localhost in the Codex in-app Chromium browser:

- Empty-name error and input focus; starting with Enter; `<b>Dog</b>` appears literally.
- First Feed: 10:00, 1/8 actions, Fullness/Mood/Energy/Cleanliness = **82/56/70/57**.
- An immediate second click during feeding did not spend another turn. Buttons unlocked after the reaction.
- Feeding displayed food and a bowl; Play showed a jumping dog and ball; Clean showed bubbles and a shake; Rest showed a sleeping pose, mat and Zzz. Two captured Play frames showed different dog/ball positions.
- Repeating Clean at Cleanliness 86 was refused in English without changing time or diary entries.
- Feed, Play, Clean, Rest repeated twice reached **17:00, 8 diary entries, final average 80/100**, with actions disabled after the last reaction.
- Escape canceled the reset dialog without changing the day. Confirmed reset during feeding returned to the welcome form; a new day started with fresh values and no old action.
- Enter/Space activation and Tab navigation worked. Tab after an action continued to the next care control.
- Desktop 1440px, tablet 768px and phone 390px viewport layouts were inspected. The phone browser's content width can be 375px with its scrollbar. No horizontal overflow was measured. The compact garden and controls were visible together during a phone action.
- No browser console warnings or errors were observed during these tested flows.

## Design review

The `design-taste-frontend` inspector checked the welcome page at 1440/768/390px. It measured Pixelify Sans throughout. With documented exceptions for the existing pixel shadows, cream palette, tagline, game title and reserved form-error space, it reported 0 failures and 0 warnings. This is not a claim of an unrestricted clean audit or an assignment grade.

Game-state screenshots were reviewed separately. The speech bubble was moved closer to the dog. Phone inspection exposed the off-screen reaction problem, leading to the compact sticky garden. The project screenshot shows the feeding state.

## Package checks — passed

- The self-contained `Puppy-Day.html` was opened separately over localhost. Its welcome screen, name entry, pixel font, first feeding response and exact values worked; no console warning or error was observed.
- The single file embeds the stylesheet, JavaScript, font, favicon and complete font license. Source inspection found no external runtime asset references in it.
- ZIP CRC verification and byte comparisons confirmed that the packaged source and standalone HTML match the delivery files. The ZIP also includes Chinese opening instructions.

## Limits

- Reduced-motion and tab-visibility branches passed simulated-clock tests; the operating-system preference and physical assistive technology were not tested.
- No physical phone/tablet, Safari or Firefox testing was performed.
- Direct `file://` opening was unavailable in the controlled browser, so browser verification used a local HTTP server. Local opening is the intended convenience path; use the documented server command if a browser restricts it.
- No independent human trial or Canvas submission is included in these checks. Record a real trial in `PROCESS.md` before submission.

## Public repository and online deployment — passed

Verified on 24 October 2026 after the local checks above:

- The public repository was accessible while signed out. All 16 uploaded files matched the delivery files by Git blob hash. A fresh clone passed the same 9 Node tests.
- GitHub Pages serves the root of `main` at https://sherryli919.github.io/puppy-day/.
- The live page opened without a GitHub account. Entering Biscuit and selecting Start our day started the game. Feed showed the food bowl and eating reaction, advanced to 10:00 and 1/8 actions, and produced the expected values **82/56/70/57**.
- The online screenshot showed the pixel font and action icons. No browser console warnings or errors were observed during this smoke test. This does not claim another complete regression run or a human trial.
