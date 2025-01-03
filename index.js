const fs = require('fs');
const puppeteer = require('puppeteer');
const scrapeSunbelt = require('./sites/sunbelt.js');

(async () => {
  // Set headers for csv file
  let csv = `Realtor, Address, Price, Status \n`;

  // Initiate the browser
  const browser = await puppeteer.launch();

  // Create a new page with the default browser context
  const page = await browser.newPage();

  // Scrape site by site
  const sunbeltdata = await scrapeSunbelt(page);
  console.log({sunbeltdata})
  csv += sunbeltdata;
  // csv += await scrapeOtherRealtor(page);

  // Create file

  const filename = `output/market-${new Date().toISOString()}.csv`
  try {
    fs.writeFileSync(filename, csv, 'utf8');
  } catch (err) {
    console.log({ err })
  }



  // Debug frame detachment
  // page.on('framedetached', (frame) => {
  //   console.log(`Frame detached: ${frame.url()}`);
  // });

	// Closes the browser and all of its pages
  await browser.close();
})();




