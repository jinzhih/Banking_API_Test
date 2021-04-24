function isType(type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`
  }
}

export const isObject = isType('Object');
export const isString = isType('String');
export const isArray = Array.isArray || isType('Array');
export const isFunction = isType('Function');

export const isValidURL = (str) => {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

export const isNaturalNumber = (n) => {
  if (typeof n !== 'number') return false;

  return (n >= 0.0) && (Math.floor(n) === n) && n !== Infinity;
}
