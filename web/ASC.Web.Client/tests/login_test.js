Feature("login");

const browser = process.env.profile || "chromium";

Scenario("Compare Login Page @visual-test", async ({ I }) => {
  I.amOnPage("/login");
  I.saveScreenshot(`login.desktop.${browser}.png`);
  I.seeVisualDiff(`login.desktop.${browser}.png`, {
    tolerance: 2,
    prepareBaseImage: false,
  });
});

Scenario("Test login error", ({ I }) => {
  I.amOnPage("/login");
  I.fillField("login", "fake.user@example.com");
  I.fillField("password", secret("0000000"));
  I.click("Sign In");
  I.see("user not found");
});
