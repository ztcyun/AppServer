Feature("login");

Scenario("Test login error", ({ I }) => {
  I.amOnPage("/login");
  I.fillField("login", "fake.user@example.com");
  I.fillField("password", secret("0000000"));
  I.click("Sign In");
  I.see("user not found");
});
