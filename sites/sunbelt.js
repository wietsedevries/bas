const { convertToTableRow } = require('../utils');

const scrapeSite = async (page) => {

  // Visit website
  await page.goto('https://www.sunbeltbonaire.com/en/properties/buy-real-estate/');

  // Find listings
  const listings = await page.$$('.map-item');
  const rows = listings.map(async (listing) => {
    let price;
    let address;
    let status;
    const listingData = await page.evaluate(el => {
      price = el.getElementsByClassName("price")[0].innerText || 'N/A';
      address = el.getElementsByTagName("h3")[0].innerText || 'N/A';
      status = el.getElementsByClassName('object-status')[0].innerText || 'For sale';
      return { price, address, status };
    }, listing);
    const row = await convertToTableRow({ realtor: 'Sunbelt', ...listingData });
    return row;
  })

  const response = Promise.all(rows).then((values) => {
    return values.join('')
  });

  return response;
}
module.exports = scrapeSite;
