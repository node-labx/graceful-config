const fs = require('fs');
const path = require('path');

const { getEnv } = require('./util');
const { EXT_NAMES, ENV_ORDER } = require('./constant');

module.exports = class ConfigPathResolver {
  /**
   *
   * @param {Object} options
   * @param {string?} options.path config directory
   * @param {string} [options.prefix='config'] config file prefix
   */
  constructor(options = {}) {
    // @see https://node.green/#ESNEXT-candidate--stage-3--instance-class-fields
    this.extNames = EXT_NAMES;

    this.NODE_ENV = getEnv('NODE_ENV', 'development');
    let gracefuleConfigDir = options.path || getEnv('GRACEFUL_CONFIG_DIR', process.cwd());
    if (gracefuleConfigDir.indexOf('.') === 0) {
      gracefuleConfigDir = path.join(process.cwd(), gracefuleConfigDir);
    }
    this.path = gracefuleConfigDir;
    this.prefix = options.prefix || 'config';
  }

  /**
   * get all config file path match our rules
   *
   * TODO: de-duplicate: config.default.js or config.default.json
   * @returns {string[]}
   */
  getConfigPaths() {
    const configPaths = [];

    // read config directory
    const configPattern = new RegExp(
      `${this.prefix}.(default|${this.NODE_ENV})(${this.extNames.join('|')})$`
    );

    try {
      fs.readdirSync(this.path)
        .forEach(filepath => {
          if (configPattern.test(filepath)) {
            configPaths.push(path.join(this.path, filepath));
          }
        });
    } catch (e) {}

    // sort config file order
    const envPattern = new RegExp(`.(default|${this.NODE_ENV})(${this.extNames.join('|')})$`);
    configPaths.sort((a, b) => {
      const envA = a.match(envPattern)[1];
      const envB = b.match(envPattern)[1];
      return ENV_ORDER.indexOf(envA) - ENV_ORDER.indexOf(envB);
    });

    return configPaths;
  }

}
