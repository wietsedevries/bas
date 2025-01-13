const { convertToTableRow } = require('../utils');

const scrapeSite = async (page) => {

  // Visit website
  await page.goto('https://www.bonairehomes.com/publiclistinglist.aspx');
  await page.waitForNavigation();

  // Find listings
  const listings = await page.$$('.gallery-item-container');
  const rows = listings.map(async (listing) => {
    let price;
    let address;
    let status;
    const listingData = await page.evaluate(el => {
      price = el.getElementsByClassName("proplist_price")?.[0]?.innerText || 'N/A';
      address = el.getElementsByClassName("gallery-title")?.[0]?.innerText || 'N/A';
      status = el.getElementsByClassName('card-trans-type')?.[0]?.innerText || 'For sale';
      return { price, address, status };
    }, listing);
    const row = await convertToTableRow({ realtor: 'Remax', ...listingData });
    return row;
  })

  const response = Promise.all(rows).then((values) => {
    return values.join('')
  });

  return response;
}
module.exports = scrapeSite;
