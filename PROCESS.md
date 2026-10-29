# Puppy Day — process record

## Record status

Latest revision: 29 October 2026. The original revision was made on 24 October. This record describes the supplied prototype, the changes made with AI assistance, and a later AI-simulated usability review. The student's own contributions and reflection remain to be added in their own words. A real user trial has **not** been carried out in these sessions.

## Starting idea

The supplied prototype is an eight-action pet-care game. A player names a dog and chooses between feeding, playing, cleaning and resting. Each action changes several needs, so there is a trade-off rather than a single score to maximize. Each valid action advances one hour; there is no real-time pressure.

The original prototype credits Codex for its initial code, pixel dog and documents. This revision starts from that source; it does not recreate or invent its earlier development history.

## Feedback that led to this revision

The project owner asked for pixel-style typography, English interface text and icons on the care controls. They also reported that actions changed numbers while the dog on the left appeared unresponsive, and specifically wanted food to appear after feeding.

This is project-owner feedback. It is not a substitute for the assignment's trial with another person who uses the experience before an explanation.

## Design and code changes

1. Replaced mixed system typography with a locally bundled Pixelify Sans font. The title, body, buttons, form and status text use the same pixel family. The font and its license travel with the project.
2. Converted fixed user-facing content to English, including input errors, action refusals, diary entries and the day summary. User-entered names are rendered as literal text.
3. Added four original pixel SVG control icons. The written labels remain visible so the icons do not have to carry meaning alone.
4. Extended the original Canvas dog into action-specific scenes: a food bowl and eating reaction, a ball and play reaction, bubbles and cleaning reaction, and a sleeping pose with Zzz. The numerical rules remain the same.
5. Added a short action lock so a reaction has time to be seen and rapid clicks do not accidentally spend several turns. Reset cancels the reaction lifecycle. Reduced-motion mode still gives the relevant props and text feedback.
6. Preserved the supplied garden, cream-and-green palette, square controls and hard pixel-style borders. The requested change was to improve the existing experience.
7. Browser inspection found that on a phone, scrolling down to an action hid the dog above the viewport. A compact sticky garden now keeps the dog visible while the player uses the buttons on taller narrow screens. Short landscape screens retain ordinary scrolling.

## AI tools and decisions

- OpenAI Codex (GPT-6 session): inspected the supplied source and implemented the English interface, local font, icons, Canvas reactions, callback cleanup and focused tests. It performed the checks listed in `CHECKS.md`.
- The `design-taste-frontend` skill guided the existing-interface styling and screenshot review. Generic marketing-page preferences were adapted to preserve this pixel game's supplied aesthetic. Inspection led to a lower speech bubble and the narrow-screen garden adjustment described above.
- A Grok Build worker was requested as Grok 4.7 with medium reasoning through Magpie for the animation module. It timed out after 360 seconds without changing either assigned file. Its process was confirmed stopped before the main Codex session took over. It contributed no code; the requested upstream identity was not independently verified.
- Kept from the earlier AI-assisted prototype: the simple eight-action day and deterministic care trade-offs, because they are small enough to explain and test.
- Changed from the earlier AI-assisted prototype: updating only the static drawing and numerical feedback. Following the owner's observation, the revision adds a visible prop and pose change for the chosen action.
- No AI model is called by the finished game. No AI-generated claim about a real participant is included.

## Real user trial — still pending

The separate [AI simulation and feedback](AI_FEEDBACK.md) is complete. It is kept separate from the real trial below.

Use the tasks in `TESTING.md`. Ask at least one other person to try the game before explaining how it works.

- Date, device and browser: **to be recorded**.
- What they tried first: **to be recorded**.
- Where they hesitated: **to be recorded**.
- Whether they connected the dog reaction to their choice: **to be recorded**.
- One observed issue and the change made, or a reason to keep the design: **to be recorded**.
- Retest result: **to be recorded**.

Do not turn these prompts into invented observations. Automated development checks and project-owner comments have different roles from the required trial.

## Explain one input-to-response connection

Trace the Feed button's `data-action` through the click handler and `act`. Check its refusal condition, apply the feeding effect and hourly costs once, append the diary entry, and start the food-bowl reaction. Explain how the transient reaction state differs from the pet's lasting need values.

### AI-assisted explanation to verify and put into your own words

The buttons carry a `data-action` value such as `feed`. The action-group click handler finds the clicked button and calls `act(button.dataset.action)` only when the button is enabled. `act` first rejects an ongoing reaction, a completed day, or an unsuitable choice such as Feed when Fullness is above 85. A refusal updates the feedback text and returns before the hour or history changes.

For an accepted Feed, `effects.feed` adds 30 Fullness and subtracts 5 Cleanliness. The shared hourly cost then subtracts 8 Fullness, 4 Mood and 3 Cleanliness, after which values are limited to 0–100. From the initial values, the result is 82/56/70/57. The hour advances once and the actual differences are written to the diary. `beginReaction('feed')` creates temporary reaction state; `drawDog` uses it to draw the bowl, food and eating pose. When the reaction ends, the props disappear and the buttons unlock, but the needs and diary remain. Confirmed reset cancels the reaction before restoring the starting state.

This explanation was prepared with AI. The student should check it against `script.js` and be able to explain the connection independently; it is not a claim about what the student has already learned or contributed.

## AI-simulated review and iteration — 29 October 2026

An independent Grok 4.7 review through Magpie examined the supplied source and screenshot as a hypothetical first-time player. It did not operate a browser or observe a participant. The coordinating Codex session separately tested the public game, including an empty name, rapid repeat input, a refused third Feed, reset/cancel, eight-action completion and refresh. Details and limits are in `AI_FEEDBACK.md` and `CHECKS.md`.

Two suggestions were kept: clarify that button values precede hourly costs, and reverse the diary numbering so the latest action's number matches its order in the day. Both are small feedback improvements; the numerical care rules remain unchanged. The suggestion to add every refusal threshold to every control was not adopted: the current refusal explains the reason without spending time, and extra text would increase the reading load. The short animation lock was retained because it prevents rapid clicks from using several turns. A real trial is still needed to judge these choices with a person.

This later Grok text/visual review completed successfully (gateway reported `grok-4.7-build`). It is distinct from the unsuccessful 24 October coding-worker attempt described above. Codex integrated the review, made the small HTML changes and performed the browser verification.

## Publication and development history

The supplied ZIP contained no Git history. This repository begins with an import of the reviewed local revision on 24 October 2026. Upload commits record the actual addition of source, fonts, screenshots and tests; they do not recreate earlier development or claim a human trial. Record further real changes and trial improvements as they happen.

GitHub Pages was enabled on 24 October 2026 to give visitors a direct playable entry point. The README now opens with a Play online link, since browsing an HTML file in the source repository does not launch the game. The public live page was opened without a GitHub login and its name-entry and feeding flow were checked. This is a deployment check, not the required independent user trial. Canvas submission remains the student's responsibility.
