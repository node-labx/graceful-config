class JsConfigParser {
  static parse(filepath, fileContent) {
    return require(filepath);
  }
}

class JsonConfigParser {
  static parse(filepath, fileContent) {
    return JSON.parse(fileContent);
  }
}

const ParserContext = {
  js: JsConfigParser,
  json: JsonConfigParser,
}

module.exports = class ConfigParser {
  /**
   *
   * @param {string} filepath abosulte config filepath
   */
  static parse(filepath, fileContent) {
    const extName = filepath.substring(filepath.lastIndexOf('.') + 1);
    const parser = ParserContext[extName];
    if (parser && typeof parser.parse == 'function') {
      return parser.parse(filepath, fileContent);
    }
  }
}
