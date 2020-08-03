/**
 * config.default.js / config.default.json
 * config.qa.js / config.qa.json
 * config.pre.js / config.pre.json
 * config.prod.js / config.prod.json
 * config.development.js / config.development.json
 *
 * pattern: /^matrix\.(default|qa|pre|prod|development)\.(js|json)$/
 *
 * Examples:
 * const config = new GracefulConfig({
 *  path: './config/',
 *  prefix: 'matrix',
 *  defaultConfig: {}
 * });
 *
 * 1.不传任何参数，获取所有配置
 * config.getConfig()
 *
 * 2.根据 key 获取配置，key 支持点语法
 * config.getConfig('foo')
 * config.getConfig('foo.bar')
 * config.getConfig('foo[0].name')
 *
 * 冻结配置
 */
const { merge } = require("lodash");

class GracefulConfig {
  constructor(options = {}) {
    this.options = options;
  }

  getConfig(key) {}
}

module.exports = GracefulConfig;
