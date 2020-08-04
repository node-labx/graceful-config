
/**
 * 读取目标文件夹的配置
 *
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
 * 3. merge 方法
 * 4. 冻结配置
 */

const GracefulConfig = require('./lib/GracefulConfig');

module.exports = GracefulConfig;
