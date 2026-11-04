// Gatsby 4 calls the old async method names; preserve them with the patched parser.
const engine = () => import('file-type-engine');
exports.fromBuffer = async (...args) =>
  (await engine()).fileTypeFromBuffer(...args);
exports.fromFile = async (...args) =>
  (await engine()).fileTypeFromFile(...args);
exports.fromStream = async (...args) =>
  (await engine()).fileTypeFromStream(...args);
exports.stream = async (...args) => (await engine()).fileTypeStream(...args);
