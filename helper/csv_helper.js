import csv from 'csvtojson';

export const getStandardProducts = async () => {
  const standardProducts = await csv()
    .fromFile('./Product.csv')
    .subscribe((obj) => {
      // 'null' -> null
      Object.keys(obj).forEach(function (key) {
        if (this[key] === 'null') this[key] = null;
      }, obj);

      obj.productId = obj.ProductID;
      obj.effectiveFrom = obj.Effectivefrom;
      obj.effectiveTo = obj.Effectiveto;
      obj.lastUpdated = obj.LastUpdated;
      obj.productCategory = obj.Productcategory;
      obj.name = obj.Name;
      obj.description = obj.Description;
      obj.brand = obj.Brand;
      obj.brandName = obj.Brandname;
      obj.applicationUri = obj.Applicationuri;
      obj.isTailored = obj.Istailored === 'TRUE';
      obj.additionalInformation = {
        overviewUri: obj.Additionalinformation_Overviewuri,
        termsUri: obj.Additionalinformation_Termsuri,
        eligibilityUri: obj.Additionalinformation_Eligibilityuri,
        feesAndPricingUri: obj.Additionalinformation_Feesandpricinguri,
        bundleUri: obj.Additionalinformation_Bundleuri,
      };
      obj.cardArt = obj.Cardart ? obj.Cardart : [];

      delete obj.ProductID;
      delete obj.Effectivefrom;
      delete obj.Effectiveto;
      delete obj.LastUpdated;
      delete obj.Productcategory;
      delete obj.Name;
      delete obj.Description;
      delete obj.Brand;
      delete obj.Brandname;
      delete obj.Applicationuri;
      delete obj.Istailored;
      delete obj.Additionalinformation_Overviewuri;
      delete obj.Additionalinformation_Termsuri;
      delete obj.Additionalinformation_Eligibilityuri;
      delete obj.Additionalinformation_Feesandpricinguri;
      delete obj.Additionalinformation_Bundleuri;
    });
  return standardProducts;
}
