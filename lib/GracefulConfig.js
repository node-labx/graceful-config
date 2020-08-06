
const fs = require('fs');
const { merge, cloneDeep } = require("lodash");
const debug = require('debug')('graceful-config');

const ConfigPathResolver = require("./ConfigPathResolver");
const ConfigParser = require("./ConfigParser");

const CONFIG_STORAGE = Symbol('GracefulConfig#ConfigStorage');

class GracefulConfig {
  /**
   * Creates an instance of GracefulConfig.
   * @param {Object} [options={}]
   * @param {String} options.path config diretory path
   * @param {String|String[]} options.prefix config file prefix
   * @memberof GracefulConfig
   */
  constructor(options = {}) {
    this[CONFIG_STORAGE] = {};
    this.options = options;
    debug('GracefulConfig options %s', options);
    this.loadConfigFile();
  }

  /**
   * get config value by key
   * @public
   * @param {String} key target key. eg: foo[0], foo[0][1], foo[0].bar, foo.bar[0]
   * @returns {object|undefined} return all config if key is undefined; return undefined if key doesn't exsit
   */
  getConfig(key) {
    // filter empty string
    const properties = (key || '').split(/[\.\[\]]/).filter(Boolean);

    let value = this[CONFIG_STORAGE];
    for(let i = 0; i < properties.length; i++) {
      const key = properties[i];
      value = value[key];

      if (value === null || typeof value == 'undefined') {
        break;
      }
    }

    return value;
  }

  /**
   * merge anther GracefulConfig
   * @public
   * @param {GracefulConfig} otherConfig
   * @returns {GracefulConfig}
   */
  merge(otherConfig) {
    if (!(otherConfig instanceof GracefulConfig)) {
      throw new TypeError('Only class GracefulConfig could merge');
    }
    this[CONFIG_STORAGE] =  cloneDeep(this[CONFIG_STORAGE]);
    otherConfig[CONFIG_STORAGE] = cloneDeep(otherConfig[CONFIG_STORAGE]);

    this.mergeConfig(otherConfig[CONFIG_STORAGE]);

    this.freezeConfig();

    return this;
  }

  /**
   * load config fron disk
   *
   * @private
   * @memberof GracefulConfig
   */
  loadConfigFile() {
    const resolver = new ConfigPathResolver(this.options);
    const configPaths = resolver.getConfigPaths();
    debug("Resolved config paths %s", configPaths);

    configPaths.forEach((filepath) => {
      const configObj = this.parseFile(filepath);
      debug('filepath: %s, current config Object %s', filepath, configObj);
      this.mergeConfig(configObj);
    });
    debug("Final Config Object %s", this[CONFIG_STORAGE]);

    // deep freeze config
    this.freezeConfig();
  }

  /**
   * @private
   * @param {string} filepath
   * @returns {object}
   * @memberof GracefulConfig
   */
  parseFile(filepath) {
    let fileContent = '';
    try {
      fileContent = fs.readFileSync(filepath)
                          // remove whitespace char such as '\uFEFF'
                          .toString().trim();
      debug("filepath: %s, fileContent: %s", filepath, fileContent)
    } catch (err) {
      return null;
    }
    return ConfigParser.parse(filepath, fileContent);
  }

  /**
   * @private
   * @param {object} source
   * @memberof GracefulConfig
   */
  mergeConfig(source) {
    return merge(this[CONFIG_STORAGE], source);
  }

  /**
   *
   * @private
   * @memberof GracefulConfig
   */
  freezeConfig() {
    const hasOwnProp = Object.prototype.hasOwnProperty;
    function deepFreeze(o) {
      Object.freeze(o);
      Object.getOwnPropertyNames(o).forEach(prop => {
        if(hasOwnProp.call(o, prop)
          && o[prop] !== null
          && (typeof o[prop] === 'object')
          && !Object.isFrozen(o[prop])
        ) {
          deepFreeze(o[prop]);
        }
      });
      return o;
    }
    const config = this[CONFIG_STORAGE];
    if (config !== null && typeof config === 'object') {
      deepFreeze(config);
    }
  }
}

module.exports = GracefulConfig;
