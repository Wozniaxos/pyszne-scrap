const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

(async () => {
  puppeteer.use(StealthPlugin())
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.pyszne.pl/menu/zielona-krowa');
  await page.waitForSelector('[role="listitem"]');

  const meals = await page.evaluate(() => {
    const titleClass = document.evaluate(
      "//*[text() = 'Burger Classic']",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
      .singleNodeValue
      .className

    const descriptionClass = document.evaluate(
      "//*[text() = 'wołowina 100% z czerwoną cebulą, majonezem, sosem BBQ i sałatą']",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
      .singleNodeValue
      .className

    const additionalClass = document.evaluate(
      "//*[text() = 'Do wyboru: frytki lub sałatka.']",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
      .singleNodeValue
      .className

    const priceClass = document.evaluate(
      "//*[contains(text(), '27,90')]",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
      .singleNodeValue
      .className

    const elements = document.querySelectorAll('[role="listitem"]');

    return [...elements].map((el) => ({
      title: el.getElementsByClassName(titleClass)[0]?.textContent,
      description: el.getElementsByClassName(descriptionClass)[0]?.textContent,
      additional: el.getElementsByClassName(additionalClass)[0]?.textContent,
      price: el.getElementsByClassName(priceClass)[0]?.textContent,
    })).filter((el) => el.title)
  })

  console.log(meals);

  await browser.close();
})();