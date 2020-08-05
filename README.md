# Graceful Config

## Install

```sh
npm i graceful-config --save
```

## Usage

Fisrt, make some config files like below:

```
├──config
  ├── application.daily.json
  ├── application.default.json
  ├── application.development.json
  ├── application.pre.js
  ├── application.prod.js
  └── application.qa.js
```

Graceful Config support `*.js` and `*.json`.

Then, write a script to load configs.

```js
// demo.js
const GracefulConfig = require('graceful-config');

const config = new GracefultConfig({
  path: './config',
  prefix: 'application',
});

// get all config
config.getConfig();

// get specific config
config.getConfig('foo')
config.getConfig('foo.bar')
config.getConfig('foo[0].name')
```

Finally, run this script!

```sh
NODE_ENV=qa node ./demo.js
```

Graceful Config will load `config.default.json` and `config.qa.json` and merge 2 config files.

## Class: GracefulConfig

### new GracefultConfig(options)

+ options {object}
  + `path` `{string}` config diretory path, you can also modify config directory by setting env variable `GRACEFUL_CONFIG_DIR`. default is `process.cwd()`
  + `prefix` `{string}` config file prefix, default `config`

### gracefultConfig.getConfig([key])

+ `key` `{string}` config key. return all config if key is undefined; return undefined if key doesn't exsit
+ returns: config value

### gracefultConfig.merge(antherConfig)

+ `antherConfig` `{GracefulConfig}` source objects. Only class GracefulConfig instance can be merged
+ returns: `this` GracefultConfig


## Contributing

- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3

## License

[MIT](LICENSE)
