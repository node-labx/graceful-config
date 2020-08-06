function getEnv(key, defaultValue) {
  return process.env[key] || defaultValue;
}

module.exports = {
  getEnv,
}
