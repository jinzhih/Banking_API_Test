/* eslint max-len: ["error", { "ignoreRegExpLiterals": true }] */
export const ASCIIStringRegex = /^[\x00-\x7F]*$/;
export const DateTimeStringRegex = /^([0-9]+)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])[Tt]([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(([Zz])|([\+|\-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;
