const assert = require('assert');
const {Given, When, Then, AfterAll} = require('@cucumber/cucumber');
const {Builder, By, Capabilities, Key, until} = require('selenium-webdriver');
const {expect} = require('chai');
const {symlinkSync} = require('fs');

require('chromedriver');

// driver setup
const capabilities = Capabilities.chrome();
capabilities.set('chromeOptions', {'w3c': false});
const driver = new Builder().withCapabilities(capabilities).build();

Given('I am on the home page.', async function() {
  // Write code here that turns the phrase above into concrete actions
  await driver.get('http://localhost:3000/');
});

Given('I am on the portfolio page.', async function() {
  // Write code here that turns the phrase above into concrete actions
  await driver.get('http://localhost:3000/portfolio');
});


Then('the {string} should appear in {float} seconds.', async function(string, float) {
  await driver.wait(() => until.elementLocated(By.xpath(string)), float*1000);
});

Given('I log in.', async function() {
  // Figure out how to get the MFA code without
  // learning how to automate Google mail.
  await driver.wait(()=>until.elementLocated(By.css('//*[@id="loginButton"]')));
  loginbutton = await driver.findElement(By.xpath('//*[@id="loginButton"]')).catch(()=>{});
  console.log(JSON.stringify(loginbutton));

  if (loginbutton) {
    // loginbutton.click();
    await driver.get('http://localhost:3000/login');

    let test = driver.wait(()=>until.elementLocated(By.xpath('//*[@id="okta-sign-in"]')));
    await test;
    console.log('Login page loaded '+JSON.stringify(test));
    test = driver.wait(()=>until.elementLocated(By.id('okta-signin-username')));
    await test;
    console.log('Username input located');
    username = await driver.findElement(By.id('okta-signin-username'));// #okta-signin-username
    username.sendKeys('malignantlymalicious@gmail.com');
    password = await driver.findElement(By.id('okta-signin-password'));
    password.sendKeys('FunkyFish');

    console.log('Login Complete');

    await driver.wait(()=> until.elementLocated(By.xpath('//*[@id="form9"]')));
    driver.findElement(
        By.xpath('/html/body/div[2]/div/main/div[2]/div/div/form/div[2]/input'))
        .click();

    console.log('Email Verification code requested');
    // Store the ID of the original window
    const originalWindow = await driver.getWindowHandle();

    // Opens a new window and switches to new window
    await driver.switchTo().newWindow('window');
    const emailWindow = await driver.getWindowHandle();

    await driver.get('https://mail.google.com/mail/u/0/#inbox');
    console.log('Opened Email');

    driver.findElement(By.linkText('One-time verification code')).click();
    verificationCode = driver.findElement(By.xpath('//*[@id="m_1516731610261672672verification-code"]')).getText();
    console.log(verificationCode);
    // Close the tab or window
    await driver.close();

    // Switch back to the old tab or window
    await driver.switchTo().window(originalWindow);
    await driver.findElement(By.xpath('//*[@id="input23"]')).sendKeys(verificationCode);
  } else {
    console.log(' Already Logged in');
  }
});

Then('the buy and sell buttons should appear.', function() {
  // Write code here that turns the phrase above into concrete actions
  driver.findElement(By.xpath('//*[@id="BuyButton"]'))
      .catch(() => {
        console.log('Buy Button was not visible as expected.');
        expect(false).to.be.true;
      });
  driver.findElement(By.xpath('//*[@id="SellButton"]'))
      .catch(() => {
        console.log('Sell Button was not visible as expected.');
        expect(false).to.be.true;
      });
});

Given('I click the buy button.', function() {
  driver.findElement(By.xpath('//*[@id="BuyButton"]')).click()
      .catch(() => {
        console.log('Buy Button was not clicked as expected.');
        expect(false).to.be.true;
      });
});

Given('I click the profile button.', function() {
  console.log('Clicking portfolio button');
  driver.findElement(By.xpath('//*[@id="portfolioButton"]')).click();
});

AfterAll( async function() {
  await driver.quit();
});
