# Puppy Day — AI-simulated usability feedback

**Date: 29 October 2026.** This is an AI cognitive walkthrough plus browser checks performed by an AI agent. It is **not a human user trial**, a participant interview or an assignment grade. No participant, quotation or measured hesitation is invented.

## Method

An independent Grok 4.7 review, requested at medium reasoning through Magpie, examined the supplied interface source, README, process notes and feeding screenshot. The gateway reported `grok-4.7-build`. That reviewer had no browser or execution tools. Its hypothetical persona was a first-time player looking for a short, calm game; predictions about that player's thoughts are hypotheses.

The coordinating Codex session separately operated the public game in Chromium, compared the review with actual results, and checked the small revision locally. The starting repository revision was `6cb1bed`. Browser automation is development evidence, not evidence of a real person's experience.

## Tasks and observed results

| Task performed by the AI browser agent | Actual result |
| --- | --- |
| Open the public game and submit an empty name | English error appeared and focus returned to the name field. |
| Enter Mochi and start | 09:00, 0/8 actions; needs 60/60/70/65. |
| Rapidly double-click Feed | Only one action was recorded: 10:00, 1/8, needs 82/56/70/57. |
| Feed again, then attempt a third Feed | Second feed reached Fullness 100. The third was refused with “No time used”; clock and diary stayed at two actions. |
| Open Start over and choose Keep playing | Existing day remained. Confirming a later reset returned to the name form. |
| Start again; Feed, Play, Clean, Rest, repeated twice | Reached 17:00 with eight entries and final needs 56/88/80/97. The summary average was 80/100; controls stayed disabled after the last reaction. |
| Refresh the finished day | Returned to the welcome form, consistent with the no-save notice. |

No console warnings or errors were observed in this flow. The existing nine Node regression tests also passed. Physical mobile devices, Safari, Firefox and a new operating-system reduced-motion test were outside this round.

## Feedback and response

### 1. Explain why +30 becomes +22 — changed

**Evidence:** Feed advertises Fullness +30, but the first action moves 60 to 82. The code also subtracts the hourly cost of 8. The diary correctly records the net +22.

**Hypothesis:** a new player might think the button promise and result disagree, especially if they miss the cost sentence.

**Decision:** keep the care rules and add “Button values are before hourly costs” and “The diary shows the final change” beside the controls. Dynamic net-value labels were not added: the existing short labels remain readable, while the diary reports the exact result after costs and the 0–100 limit.

### 2. Match diary numbers to action order — changed

**Evidence:** entries appear newest first, but the original ordered list numbered the latest action as 1. After two actions, the 11:00 entry appeared above 10:00 while its number suggested it was the first action.

**Hypothesis:** the numbering could confuse a player reviewing their choices.

**Decision:** retain newest-first reading and use a reversed ordered list. After two actions the newest is numbered 2 and the older one 1; at the end the numbers run from 8 down to 1. Timestamps remain visible.

### 3. Keep forgiving refusals — retained

**Evidence:** a full puppy can still be offered Feed, but the program explains the refusal and spends no time. Play's energy requirement is also stated beside the controls.

**Hypothesis:** showing every cutoff in advance might help some players, but would add text to four small controls.

**Decision:** retain the current explanation-on-click behavior for this small experience. Ask a real participant whether the refusal is understandable before adding more labels. This is a reasoned design choice, not proof that people prefer it.

### 4. Keep the short reaction lock — retained

**Evidence:** all care buttons temporarily disable while the puppy reacts, then unlock. The double-click check spent only one action.

**Hypothesis:** someone looking away from the puppy might briefly interpret disabled controls as a stall.

**Decision:** keep the lock, reaction props and status messages to prevent accidental extra turns. A real trial should check whether the pause feels clear; no timing preference is attributed to a person here.

## Remaining assignment work

- Ask at least one other person to play **before explaining the controls**. Record the actual observation and design decision in `PROCESS.md`.
- Review the AI-assisted code explanation in `PROCESS.md`; add the student's own contribution and reflection in their own words.
- Submit the public repository URL on Canvas by **1 November 2026, 23:59 Hong Kong time**.

AI feedback adds useful evidence but does not complete these personal and human-trial requirements.
