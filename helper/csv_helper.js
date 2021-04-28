import csv from 'csvtojson';

export const getStandardProducts = async () => {
  const standardProducts = await csv().fromFile('./Product.csv');
  return standardProducts;
}
