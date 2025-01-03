const { convertToTableRow } = require('../utils');

const scrapeSite = async (page) => {

  // Visit website
  await page.goto('https://harbourtownbonaire.com/en/sale/?limit=1000&wplpage=1');

  // Find listings
  const listings = await page.$$('.wpl-column');
  const rows = listings.map(async (listing) => {
    let price;
    let address;
    let status;
    const listingData = await page.evaluate(el => {
      price = el.getElementsByClassName("price_box")?.[0]?.innerText || 'N/A';
      address = el.getElementsByTagName("h3")?.[0]?.innerText || 'N/A';
      status = el.getElementsByClassName('wpl-listing-tag')?.[0]?.innerText || 'For sale';
      return { price, address, status };
    }, listing);
    const row = await convertToTableRow({ realtor: 'Harbourtown', ...listingData });
    return row;
  })

  const response = Promise.all(rows).then((values) => {
    return values.join('')
  });

  return response;
}
module.exports = scrapeSite;
