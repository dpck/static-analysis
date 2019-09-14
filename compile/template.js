const { _staticAnalysis } = require('./depack')

/**
 * @methodType {_staticAnalysis.staticAnalysis}
 */
function staticAnalysis(path, config) {
  return _staticAnalysis(path, config)
}

module.exports = staticAnalysis

/* typal types/index.xml namespace */
