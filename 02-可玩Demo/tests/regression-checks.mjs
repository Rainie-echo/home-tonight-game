import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const demoDir = resolve(__dirname, "..");
const css = readFileSync(resolve(demoDir, "styles.css"), "utf8");
const game = readFileSync(resolve(demoDir, "game.js"), "utf8");

const manualLayoutRule = css.indexOf(".cockpit.layout-manual .hud-top");
const coverManualRule = css.indexOf(".cockpit.cover-active.layout-manual .hud-top");
assert.ok(manualLayoutRule >= 0, "manual layout HUD rule should exist");
assert.ok(
  coverManualRule > manualLayoutRule,
  "cover/manual HUD hiding rule must come after the manual layout display rule"
);

const topYMatch = game.match(/const topY = boxY \+ boxH \* ([0-9.]+);/);
const activeBottomYMatch = game.match(/const activeBottomY = Math\.min\(h, boxY \+ boxH \* ([0-9.]+)\);/);
assert.ok(topYMatch, "calibrated car-front hitbox should define an early topY");
assert.ok(activeBottomYMatch, "calibrated car-front hitbox should clamp activeBottomY to canvas height");

const box = { x: 441, y: 510, w: 420, h: 190 };
const topY = box.y + box.h * Number(topYMatch[1]);
const activeBottomY = Math.min(720, box.y + box.h * Number(activeBottomYMatch[1]));

assert.ok(topY <= 565, `car-front collision should start near the hood, got ${topY}`);
assert.ok(activeBottomY >= 705, `car-front collision should continue through the hood, got ${activeBottomY}`);
