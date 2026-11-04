// Passport imports UUID 3's private LDAP formatter. Keep its byte layout,
// including non-RFC identifiers, without retaining the old UUID generator.
module.exports = function bytesToUuid(bytes, offset = 0) {
  const hex = Array.from({ length: 16 }, (_, index) => {
    const byte = bytes[offset + index];
    return Number.isInteger(byte) && byte >= 0 && byte <= 255
      ? byte.toString(16).padStart(2, '0')
      : 'undefined';
  });
  return [
    hex.slice(0, 4),
    hex.slice(4, 6),
    hex.slice(6, 8),
    hex.slice(8, 10),
    hex.slice(10, 16)
  ]
    .map(part => part.join(''))
    .join('-');
};
