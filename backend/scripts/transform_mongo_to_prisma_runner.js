const transform = require('./transform_mongo_to_prisma');
const fs = require('fs');

module.exports = function(collection, inputFile) {
  const code = fs.readFileSync(inputFile, 'utf8').trim();
  let docs;
  try { docs = JSON.parse(code); } catch (e) {
    docs = code.split(/\r?\n/).filter(Boolean).map(l => JSON.parse(l));
  }
  // call transform function exported by transform_mongo_to_prisma.js
  // We'll require the module and call the internal mapping function via child process style
  const script = require('./transform_mongo_to_prisma');
  return docs.map(d => script._transform(collection, d)).filter(Boolean);
};
