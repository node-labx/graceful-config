const fs = require('fs');
const test = require("ava");
const ConfigParser = require("../../lib/ConfigParser");

test.beforeEach(t => {
  process.env.NODE_ENV = undefined;
});

test('load javascript config file', (t) => {
  const paserdObj = ConfigParser.parse(process.cwd() + '/test/config-1/test.default.js', '');
  t.is(paserdObj.key, 'value');
});


test('load json config file', (t) => {
  const filepath = process.cwd() + '/test/config-2/test.default.json';
  const jsonContent = fs.readFileSync(filepath)
  const paserdObj = ConfigParser.parse(filepath, jsonContent);
  t.is(paserdObj.key, 'default value');
});
