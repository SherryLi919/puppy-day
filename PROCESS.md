# Puppy Day — process record

## Record status

Revision date: 24 October 2026. This record describes the supplied prototype and the changes made with AI assistance in this editing session. The student's own contributions and reflection remain to be added in their own words. A real user trial has **not** been carried out in this session.

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

The student's own explanation of the actual code: **to be added**.

## Publication and development history

The supplied ZIP contained no Git history. This repository begins with an import of the reviewed local revision on 24 October 2026. Upload commits record the actual addition of source, fonts, screenshots and tests; they do not recreate earlier development or claim a human trial. Record further real changes and trial improvements as they happen. A hosted live site and Canvas submission are separate from publishing the repository and are not claimed here.
