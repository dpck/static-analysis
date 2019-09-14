const { _staticAnalysis, _sort } = require('./depack')

/**
 * @methodType {_staticAnalysis.staticAnalysis}
 */
function staticAnalysis(path, config) {
  return _staticAnalysis(path, config)
}

/**
 * @methodType {_staticAnalysis.sort}
 */
function sort(detected) {
  return _sort(detected)
}

module.exports = staticAnalysis
module.exports.sort = sort

/* typal types/index.xml namespace */
