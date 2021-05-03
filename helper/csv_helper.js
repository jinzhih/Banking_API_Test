import csv from 'csvtojson';

export const getStandardProducts = async () => {
  const standardProducts = await csv({
    noheader: false,
    headers: [
      'productId',
      'effectiveFrom',
      'effectiveTo',
      'lastUpdated',
      'productCategory',
      'name',
      'description',
      'brand',
      'brandName',
      'applicationUri',
      'isTailored',
      'Additionalinformation_Overviewuri',
      'Additionalinformation_Termsuri',
      'Additionalinformation_Eligibilityuri',
      'Additionalinformation_Feesandpricinguri',
      'Additionalinformation_Bundleuri',
    ],
    colParser: {
      'isTailored': (item) => {
        return item === 'TRUE';
      },
    },
  })
    .fromFile('csv/Product.csv')
    .subscribe((obj) => {
      // 'null' -> null
      Object.keys(obj).forEach(function (key) {
        if (this[key] === 'null') this[key] = null;
      }, obj);

      obj.additionalInformation = {
        overviewUri: obj.Additionalinformation_Overviewuri,
        termsUri: obj.Additionalinformation_Termsuri,
        eligibilityUri: obj.Additionalinformation_Eligibilityuri,
        feesAndPricingUri: obj.Additionalinformation_Feesandpricinguri,
        bundleUri: obj.Additionalinformation_Bundleuri,
      };
      obj.cardArt = obj.Cardart ? obj.Cardart : [];

      delete obj.Additionalinformation_Overviewuri;
      delete obj.Additionalinformation_Termsuri;
      delete obj.Additionalinformation_Eligibilityuri;
      delete obj.Additionalinformation_Feesandpricinguri;
      delete obj.Additionalinformation_Bundleuri;
    });
  return standardProducts;
}

export const getStandardProductsDetail = async () => {
  const standardProductsDetail = await csv({
    noheader: false,
    headers: ['id', 'productId', 'name', 'description', 'additionalInfo', 'additionalInfoUri', 'productIds'],
    colParser: {
      'id': 'omit',
      'name': (item) => {
        console.log(item)
        return item;
      },
    },
  })
    .fromFile('csv/Bundle.csv')
    .subscribe((obj) => {
      console.log(obj)
    });
  return standardProductsDetail;
}
