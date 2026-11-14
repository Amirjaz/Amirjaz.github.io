// Screenshots a route of the running dev server at several scroll positions, using the
// installed Microsoft Edge. Prints console errors so broken pages are caught early.
//
//   node scripts/shot.mjs a1 <out-dir> [--steps=8] [--at=0,900,2400] [--mobile]
//                                         [--reduced-motion] [--light] [--hover=<css selector>]
//                                         [--move=x,y] [--wait=900]
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [routeArg = "", out = "shots", ...flags] = process.argv.slice(2);
// Pass the route without slashes ("a1", or "" for the home page): Git Bash rewrites "/a1/" into a Windows path.
const slug = routeArg.replace(/^.*[\/]Git[\/]?/, "").replace(/^[\/]+|[\/]+$/g, "");
const route = slug ? `/${slug}/` : "/";
const flag = (name) => flags.find((f) => f === `--${name}` || f.startsWith(`--${name}=`));
const value = (name, fallback) => (flag(name)?.includes("=") ? flag(name).split("=").slice(1).join("=") : fallback);

const base = process.env.BASE ?? "http://localhost:3000";
const mobile = Boolean(flag("mobile"));
const wait = Number(value("wait", 900));
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  isMobile: mobile,
  hasTouch: mobile,
  reducedMotion: flag("reduced-motion") ? "reduce" : "no-preference",
  colorScheme: flag("light") ? "light" : "dark",
});
const page = await context.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(base + route, { waitUntil: "networkidle" });
await page.waitForTimeout(Number(value("settle", 2500)));

const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
const steps = Number(value("steps", 8));
const positions = flag("at")
  ? value("at", "0").split(",").map(Number)
  : Array.from({ length: steps + 1 }, (_, i) => Math.round((max * i) / steps));

const tag = [mobile ? "m" : "d", flag("reduced-motion") ? "rm" : "", flag("light") ? "light" : ""].filter(Boolean).join("-");
for (const y of positions) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(wait);
  if (flag("move")) {
    const [x, yy] = value("move", "0,0").split(",").map(Number);
    await page.mouse.move(x, yy, { steps: 12 });
    await page.waitForTimeout(500);
  }
  if (flag("hover")) {
    await page.locator(value("hover", "body")).first().hover({ timeout: 3000 }).catch((e) => errors.push("hover: " + e.message));
    await page.waitForTimeout(600);
  }
  const file = join(out, `${tag}-${String(y).padStart(5, "0")}.jpg`);
  await page.screenshot({ path: file, type: "jpeg", quality: 72 });
  console.log(file);
}

const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log(`page height: ${max + (mobile ? 844 : 900)}px, horizontal overflow: ${overflow}px`);
console.log(errors.length ? `console errors (${errors.length}):\n` + [...new Set(errors)].join("\n") : "no console errors");
await browser.close();
