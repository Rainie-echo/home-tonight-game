# UI Asset Index

These UI assets are production candidates for the current Canvas/HTML demo. Most images avoid baked Chinese text so runtime text can remain HTML/CSS and stay readable.

## Full-Screen Overlay Candidates

- `ui-start-overlay.png` -> `introOverlay`, formal start screen background/panel reference.
- `ui-reward-modal.png` -> `rewardOverlay`, stage reward popup background/panel reference.
- `ui-victory-home.png` -> `gameOverOverlay` victory state, warm home arrival result screen.
- `ui-game-over-vehicle.png` -> `gameOverOverlay` life/vehicle failure state.
- `ui-game-over-focus.png` -> `gameOverOverlay` focus collapse failure state.
- `ui-top-hud.png` -> `.hud-top`, top HUD skin/reference with health, timer, radar slots.

## In-Game Component Candidates

- `ui-radar-minimap.png` -> `radarCanvas` / `drawRadar()`, radar styling and point color reference.
- `generated-hud-icons-sheet-raw.png` -> new 2x2 generated HUD icon sheet source for missing top/side UI components.
- `generated-hud-icons-sheet-clean.png` -> chroma-keyed transparent version of the generated HUD icon sheet.
- `hud-icons/time-frame-icon.png` -> `.timer-card`, remaining-time icon/frame.
- `hud-icons/ai-energy-icon.png` -> `.energy-card`, AI energy / absorbed AI ability icon.
- `hud-icons/life-value-icon.png` -> `.life-card`, life value icon.
- `hud-icons/radar-frame-icon.png` -> `.radar-card`, radar outer frame icon.
- `hud-components/life-panel.png` -> `.life-card`, full generated life value panel skin with runtime fill overlay.
- `hud-components/timer-panel.png` -> `.timer-card`, full generated remaining-time panel skin with runtime timer text overlay.
- `hud-components/ai-energy-panel.png` -> `.energy-card`, full generated AI energy gauge skin with runtime percentage overlay.
- `hud-components/ai-energy-panel-empty.png` -> `.energy-card`, preferred empty AI energy gauge skin; runtime fill layer controls the visible energy amount.
- `hud-components/energy-arc-mask.png` -> `.energy-gauge`, runtime mask that aligns the AI energy fill to the generated semicircular slots.
- `hud-components/energy-user-slot-mask.png` -> `.energy-gauge`, final user-marked runtime mask extracted from the bright green annotated source image.
- `hud-components/radar-frame.png` -> `.radar-card`, full generated radar frame; `radarCanvas` draws realtime dots inside.
- `ui-skill-bar-qwer-states.png` -> `.hud-bottom`, Q/W/E/R button icon and state reference.
- `ui-skill-bar-qwer-icons-v2.png` -> `.hud-bottom`, more polished and humorous Q/W/E/R icon row.
- `ui-skill-icons-qwer-crop-v2.png` -> `.hud-bottom`, crop-friendly 2x2 refined icon pack; preferred source for final individual skill icons.
- `ui-skill-bar-qwer-icons-v2-letters.png` -> `.hud-bottom`, polished horizontal Q/W/E/R icon row with key labels.
- `ui-skill-icons-qwer-crop-v2-letters.png` -> `.hud-bottom`, crop-friendly 2x2 refined icon pack with Q/W/E/R key labels.
- `ui-energy-gauge.png` -> `.energy-card`, AI energy gauge reference.
- `ui-hint-toast.png` -> `.drive-note` / `aiHint`, compact car-system hint toast.
- `ui-disturbance-call-base.png` -> `.disturbance`, reusable black-red call popup base.

## Haunted Call Cards

- `call-cards/call-boss-overtime.png` -> 老板来电
- `call-cards/call-client-revision.png` -> 甲方来电
- `call-cards/call-long-hair-ghost.png` -> 长发女鬼来电
- `call-cards/call-paper-bride.png` -> 纸嫁衣新娘来电
- `call-cards/call-unknown-backseat.png` -> 未知号码
- `call-cards/call-home-landline.png` -> 家里座机
- `call-cards/call-haunted-navigation.png` -> 导航重算
- `call-cards/call-car-voice.png` -> 车机语音

## Haunted Call Card Cutouts

Use these alpha PNGs when placing call cards over gameplay. They keep the card, broken-frame figure, red glitches, cords, papers, and route lines while making the outside background transparent.

- `call-cards/cutouts/call-boss-overtime-cutout.png` -> 老板来电
- `call-cards/cutouts/call-client-revision-cutout.png` -> 甲方来电
- `call-cards/cutouts/call-long-hair-ghost-cutout.png` -> 长发女鬼来电
- `call-cards/cutouts/call-paper-bride-cutout.png` -> 纸嫁衣新娘来电
- `call-cards/cutouts/call-unknown-backseat-cutout.png` -> 未知号码
- `call-cards/cutouts/call-home-landline-cutout.png` -> 家里座机
- `call-cards/cutouts/call-haunted-navigation-cutout.png` -> 导航重算
- `call-cards/cutouts/call-car-voice-cutout.png` -> 车机语音

## Individual Skill Icons

- `skill-icons/q-radar-pulse.png` -> Q 雷达脉冲
- `skill-icons/w-horn-call.png` -> W 智能鸣笛
- `skill-icons/e-night-vision.png` -> E 夜视摄像头
- `skill-icons/r-silence-field.png` -> R AI静音场

## Runtime Notes

- Overlay images are normalized to `1280x720`.
- Call cards are portrait components and should be cropped/scaled into the right-side popup area.
- `hud-icons/prompt-used.txt` and `hud-icons/pipeline-meta.json` record the prompt and deterministic postprocess metadata for the four generated HUD icons.
- `hud-components/prompt-used.txt` and `hud-components/pipeline-meta.json` record the prompt and deterministic postprocess metadata for the four generated HUD component skins.
- Final Chinese copy should be rendered by HTML/CSS, not baked into the image.
- Call cards intentionally break out of their rectangular frame to increase horror pressure.
