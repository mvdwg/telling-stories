var logger = require('heimdalljs-logger')('telling-stories-parser');

module.exports = extractMetadata;

// Copied from QUnit
function goodEnoughId(module, testName) {
  var str = module + "\x1C" + testName;
  var hash = 0;

  for (var i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  // Convert the possibly negative integer hash code into an 8 character hex string, which isn't
  // strictly necessary but increases user understanding that the id is a SHA-like hash
  var hex = (0x100000000 + hash).toString(16);
  if (hex.length < 8) {
    hex = "0000000" + hex;
  }

  return hex.slice(-8);
}

// I'm using functions to create a new instance each time the regexp is used.
// This is to avoid the state change provoked by the `.exec` method. Note that
// moduleTextRegexp doesn't uses the `g` modifier so it shouldn't have any
// problem but we might need to use the `g` modifier in the future so...
function moduleTextRegexp() {
  return /moduleForAcceptance\((['"`])((?:.|\\')+)\1/;
}

function testRegexp() {
  return /test\((['"`])((?:.|\\')+)\1.+\)/g
}

function extractMetadata(content, meta) {
  var matches = moduleTextRegexp().exec(content);
  var record;
  var tests;
  var re = testRegexp();

  if (!matches) {
    if (/moduleForAcceptance/.test(content)) {
      logger.error("Wow, we couldn't parse the file " + meta.fileName + " correctly. We have a bug in the regexp");
    }
  } else if (matches[2]) {
    record = {
      module: matches[2],
      tests: []
    };

    while ((matches = re.exec(content)) !== null) {
      if (matches[2]) {
        record.tests.push({
          id: goodEnoughId(record.module, matches[2]),
          name: matches[2]
        });
      }
    }

    return record;
  }
}
