# Testing and user trial

## Developer regression checklist

Run the game in a fresh browser tab. These are expected results, not fabricated trial observations. The checks actually performed for this revision are in `CHECKS.md`.

| Task | Expected result |
| --- | --- |
| Start with an empty or all-space name | English error; welcome form remains visible; focus returns to the name input |
| Enter a name such as `<b>Pup</b>` | The name appears as literal text, not HTML |
| Start a new game | 09:00, 0/8 actions, Fullness/Mood/Energy/Cleanliness = 60/60/70/65 |
| Feed once | Bowl and food appear, dog reacts; 10:00 and 82/56/70/57; one diary entry |
| Double-click an action rapidly | Only one action is accepted during the reaction |
| Wait for the reaction | Buttons become usable and the puppy returns to idle |
| Feed twice, waiting each time; try a third time | First two accepted; third rejected at Fullness 100; no time or diary change |
| Play three times, waiting each time; try a fourth | Energy reaches 10; next Play refused without consuming time |
| Use Clean | Cleaning prop/bubbles and a dog reaction; correct numeric costs |
| Use Rest | Lowered sleeping puppy, closed eyes and Zzz; correct numeric changes |
| Feed, Play, Clean, Rest, Feed, Play, Clean, Rest | 17:00, eight diary entries, summary, actions disabled |
| Start over, then Keep playing or Escape | Name, stats and diary remain |
| Confirm Start over while a reaction is running | Clean welcome screen; new game contains no old props or callbacks |
| Change the system setting to reduce motion | Actions still show relevant props/text; movement is suppressed |
| Refresh | Welcome screen returns, no saved progress |
| Use Tab, Enter and Space | Main controls remain usable with a visible focus indicator |
| Open at 390px and 768px widths | No horizontal page overflow; all controls and text remain readable |
| Open extracted folder while offline | Local font, icons and game assets are available; no CDN dependency |

## Real user trial — pending

Invite at least one other person to try the game **before explaining the controls**. Do not record their name or personal information. A browser automation run or AI review is not this trial.

Ask them to name a puppy, care for it, explain what changed after an action, handle a refusal and finish a day. Observe whether they notice the dog reaction, whether the props make the action clear, and whether the temporarily unavailable buttons make sense.

| Date/device | What the person attempted | Hesitation or exact observation | Design decision | Retest result |
| --- | --- | --- | --- | --- |
| Pending | Pending | Pending | Pending | Pending |

Make one improvement based on the observation, or explain why you kept the design. Record the actual observation and decision in `PROCESS.md`. Do not fill this table with invented feedback.
