const test = require("ava");
const GracefulConfig = require("../..");

test.afterEach(t => {
  process.env.NODE_ENV = undefined;
});

test('new a instance', (t) => {
  process.env.NODE_ENV = 'qa';

  const gracefultConfig = new GracefulConfig({
    path: './test/config-2',
    prefix: 'test',
  });

  t.deepEqual(gracefultConfig.getConfig(), {key: 'qa value'});
  t.is(gracefultConfig.getConfig('key'), 'qa value');
  t.is(gracefultConfig.getConfig('not-exsit-key.bala[1]'), undefined);
});

test('deep freeze config', t => {
  process.env.NODE_ENV = 'pre';

  const gracefultConfig = new GracefulConfig({
    path: './test/config-1',
    prefix: 'test',
  });

  const config = gracefultConfig.getConfig();

  config.deepFreeze.array = [];
  t.deepEqual(config.deepFreeze.array, [ 1, '2', { key: 'value' } ])
  config.deepFreeze.num = 2;
  t.is(config.deepFreeze.num, 1);
  config.deepFreeze.obj.key = 'changed';
  t.is(config.deepFreeze.obj.key, 'value');
});

test('config file *.json overwrite config *.js', (t) => {
  process.env.NODE_ENV = 'qa';

  const gracefultConfig = new GracefulConfig({
    path: './test/config-2',
    prefix: 'test',
  });

  t.is(gracefultConfig.getConfig('key'), 'qa value');
});

test('merge configs', (t) => {
  process.env.NODE_ENV = 'qa';

  const gracefultConfig1 = new GracefulConfig({
    path: './test/config-1',
    prefix: 'test',
  });

  const gracefultConfig2 = new GracefulConfig({
    path: './test/config-2',
    prefix: 'test',
  });

  gracefultConfig1.merge(gracefultConfig2);

  t.is(gracefultConfig1.getConfig('key'), 'qa value');
});

test('merge plain object', (t) => {
  process.env.NODE_ENV = 'qa';

  const gracefultConfig = new GracefulConfig({
    path: './test/config-1',
    prefix: 'test',
  });

  t.throws(() => {
    gracefultConfig.merge({ key: 'plain value' });
  }, {
    instanceOf: TypeError,
    message: 'Only class GracefulConfig could merge'
  });
});

test('no right to read file', (t) => {
  process.env.NODE_ENV = 'qa';

  const gracefultConfig = new GracefulConfig({
    path: './test/config-3',
    prefix: 'config',
  });

  t.is(gracefultConfig.getConfig('key'), 'default value');
});
