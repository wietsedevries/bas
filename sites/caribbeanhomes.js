const { convertToTableRow } = require('../utils');

const scrapeSite = async (page) => {

  // Visit website
  await page.goto('https://caribbeanhomesbonaire.com/for-sale/');

  // Get the number of pagination buttons
  const pages = await page.$$('.pagination-button');
  const pageCount = Array(pages)[0].length;

  let promises = [];

  // lLoop trough all pages
  for (let i = 1; i <= pageCount; i++) {

    // Click on pagination button and wait for navigation (skip for 1st page)
    if (i !== 1) {
      await Promise.all([
        page.waitForNavigation(),
        page.click(`.pagination-button[data-page="${i}"]`),
      ]);
    }

    // Find listings
    const listings = await page.$$('#property-');
    const promise = listings.map(async (listing) => {
      let price;
      let address;
      let status;
      const listingData = await page.evaluate(el => {
        price = el.getElementsByClassName("price")?.[0]?.innerText || 'N/A';
        address = el.getElementsByTagName("h4")?.[0]?.innerText || 'N/A';
        status = el.getElementsByClassName('featured-tag-2')?.[0]?.innerText || 'For sale';
        return { price, address, status };
      }, listing);
      const row = await convertToTableRow({ realtor: 'Caribbean Homes', ...listingData });
      return row;
    });

    // Add promise to array of promises
    promises = [...promises, ...promise];
  }

  const response = Promise.all(promises).then((values) => {
    return values.join('')
  });

  return response;
}
module.exports = scrapeSite;
