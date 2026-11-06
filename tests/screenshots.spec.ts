import { test, expect } from "@playwright/test";

const PAGES = [
  { path: "/", name: "landing" },
  { path: "/auth/login", name: "auth-login" },
  { path: "/auth/register", name: "auth-register" },
  { path: "/campaigns", name: "campaigns-directory" },
  { path: "/campaigns/build-a-community-health-center", name: "campaign-detail" },
];

test.describe("screenshot all screens", () => {
  for (const entry of PAGES) {
    test(`desktop: ${entry.name}`, async ({ page }) => {
      await page.goto(entry.path, { waitUntil: "commit", timeout: 60000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.screenshot({
        path: `tests/screenshots/${entry.name}-desktop.png`,
        fullPage: true,
        caret: "hide",
        animations: "disabled",
      });
    });

    test(`mobile: ${entry.name}`, async ({ page }) => {
      await page.goto(entry.path, { waitUntil: "commit", timeout: 60000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.screenshot({
        path: `tests/screenshots/${entry.name}-mobile.png`,
        fullPage: true,
        caret: "hide",
        animations: "disabled",
      });
    });
  }
});
