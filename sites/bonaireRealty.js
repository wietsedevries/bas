const { convertToTableRow } = require('../utils');

const scrapeSite = async (page) => {

  // Visit website
  await page.goto('https://www.bonairerealty.com/nl/villa-kopen');

  // Find listings
  const listings = await page.$$('li.isotope-element');
  const rows = listings.map(async (listing) => {
    let price;
    let address;
    let status;
    const listingData = await page.evaluate(el => {
      price = el.getElementsByClassName("apprice")?.[0]?.innerText || 'N/A';
      address = el.getElementsByTagName("h2")?.[0]?.getElementsByTagName("a")?.[0]?.innerText || 'N/A';
      status = el.getElementsByClassName('feature-on-views')?.[0]?.innerText || 'For sale';
      return { price, address, status };
    }, listing);
    const row = await convertToTableRow({ realtor: 'Bonaire Realty', ...listingData });
    return row;
  })

  const response = Promise.all(rows).then((values) => {
    return values.join('')
  });

  return response;
}
module.exports = scrapeSite;
