import {expect,test} from "@playwright/test";

test("reconciles a fictional controlled-drug record and exposes math",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Run monthly reconciliation"}).click();
  await expect(page.getByRole("heading",{name:"Monthly count result"})).toBeVisible();
  await expect(page.getByText("-0.5 mL")).toBeVisible();
  await page.getByRole("button",{name:"Show ledger equation"}).click();
  await expect(page.getByText(/42 \+ 20/)).toBeVisible();
});

test("switches clinic and prepares a demo packet",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Harborview"}).click();
  await expect(page.getByLabel("Controlled substance")).toHaveValue("Ketamine 100 mg/mL");
  await page.getByRole("button",{name:"Run monthly reconciliation"}).click();
  await page.getByRole("button",{name:"Prepare demo audit packet"}).click();
  await expect(page.getByRole("button",{name:"Demo audit packet prepared"})).toBeVisible();
});

test("validates impossible outflow",async({page})=>{
  await page.goto("/");
  await page.getByLabel("Administered").fill("1000");
  await page.getByRole("button",{name:"Run monthly reconciliation"}).click();
  await expect(page.getByText(/Logged outflow exceeds available inventory/)).toBeVisible();
});

test("mobile layout has no horizontal overflow",async({page},testInfo)=>{
  test.skip(!testInfo.project.name.includes("mobile"),"mobile-only assertion");
  await page.goto("/");
  await page.getByRole("button",{name:"Run monthly reconciliation"}).click();
  await expect(page.getByRole("heading",{name:"Monthly count result"})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
