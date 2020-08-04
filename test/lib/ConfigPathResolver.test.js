const test = require("ava");
const ConfigPathResolver = require("../../lib/ConfigPathResolver");

test.afterEach(t => {
  process.env.NODE_ENV = undefined;
});

test('resolve relative config dir', (t) => {
  process.env.NODE_ENV = 'qa';

  const resovler = new ConfigPathResolver({
    path: "./test/config-1",
    prefix: 'test',
  });
  const configPath = resovler.getConfigPaths();

  t.is(configPath.length, 2);
  t.regex(configPath[0], /test\/config-1\/test.default.js$/);
  t.regex(configPath[1], /test\/config-1\/test.qa.js$/);
});

test('resolve abasolute config dir', (t) => {
  process.env.NODE_ENV = 'qa';

  const resovler = new ConfigPathResolver({
    path: __dirname + "/../config-1",
    prefix: 'test',
   });
  const configPath = resovler.getConfigPaths();

  t.is(configPath.length, 2);
  t.regex(configPath[0], /test\/config-1\/test.default.js$/);
  t.regex(configPath[1], /test\/config-1\/test.qa.js$/);
});

test('config directory doesn\'t exsit', (t) => {
  process.env.NODE_ENV = 'qa';

  const resovler = new ConfigPathResolver({
    path: "./not-exsit-config-dir",
    prefix: 'test',
   });
  const configPath = resovler.getConfigPaths();

  t.is(configPath.length, 0);
});


test('read both *.js and *.json', (t) => {
  process.env.NODE_ENV = 'qa';

  const resovler = new ConfigPathResolver({
    path: './test/config-2',
    prefix: 'test',
  });
  const configPath = resovler.getConfigPaths();

  t.is(configPath.length, 3);
});


test('get config path from env variable GRACEFUL_CONFIG_DIR', (t) => {
  process.env.NODE_ENV = 'qa';
  process.env.GRACEFUL_CONFIG_DIR = './test/config-1';

  const resovler = new ConfigPathResolver({
    prefix: 'test',
   });
  const configPath = resovler.getConfigPaths();

  t.is(configPath.length, 2);

  process.env.GRACEFUL_CONFIG_DIR = undefined;
});

test('default config prefix config', (t) => {
  process.env.NODE_ENV = 'pre';

  const resovler = new ConfigPathResolver({
    path: "./test/config-3",
   });
  const configPath = resovler.getConfigPaths();

  t.is(configPath.length, 2);
});


test('default config path process.cwd()', (t) => {
  process.env.NODE_ENV = 'qa';

  const resovler = new ConfigPathResolver({
    prefix: 'test',
   });
  const configPath = resovler.getConfigPaths();

  t.is(configPath.length, 0);
});
