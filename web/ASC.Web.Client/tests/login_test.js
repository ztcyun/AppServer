const browser = process.env.profile || "chromium";
const deviceType = process.env.DEVICE_TYPE || "desktop";

Feature(`Login Page on '${browser}' with '${deviceType}' dimension`);

Scenario("Compare Login Page @visual-test", async ({ I }) => {
  I.amOnPage("/login");
  I.see("Web Office");
  I.saveScreenshot(`login.${browser}.${deviceType}.png`);
  I.seeVisualDiff(`login.${browser}.${deviceType}.png`, {
    tolerance: 2,
    prepareBaseImage: true,
  });
});

Scenario("Test login error", ({ I }) => {
  I.amOnPage("/login");
  I.fillField("login", "fake.user@example.com");
  I.fillField("password", secret("0000000"));
  I.click("Sign In");
  I.see("user not found");
});
