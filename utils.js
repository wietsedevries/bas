/**
 * returns a tabel row for the csv file
 * e.g. `Realtor 1, Kaya something 2, 400.00, for sale \n`
 */
const convertToTableRow = ({ realtor, address, price, status }) => {
  // clean data to prevent broken file
  const cleanData = [realtor, address, price, status].map(value => value.replace(',', '-'));
  const row = cleanData.join(',') + '\n';
  return row;
}

module.exports = {
  convertToTableRow,
}