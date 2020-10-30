const browser = process.env.profile || "chromium";
const deviceType = process.env.DEVICE_TYPE || "desktop";
const login = process.env.login || "user4test@example.com";
const password = process.env.password || "11111111";

Feature(`Login Page on '${browser}' with '${deviceType}' dimension`);

Scenario("Compare Login Page @visual-test", async ({ I }) => {
  I.amOnPage("/login");
  I.see("Web Office");
  I.saveScreenshot(`login.${browser}.${deviceType}.png`);
  I.seeVisualDiff(`login.${browser}.${deviceType}.png`, {
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

Scenario("Test login success", ({ I }) => {
  I.amOnPage("/login");
  I.fillField("login", login);
  I.fillField("password", secret(password));
  I.click("Sign In");
  I.amOnPage("/");
});
