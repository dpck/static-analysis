/* typal types/index.xml */
/** @const */
var _staticAnalysis = {}
/**
 * The configuration options for `staticAnalysis`.
 * @typedef {{ nodeModules: (boolean|undefined), shallow: (boolean|undefined), soft: (boolean|undefined), fields: (!Array<string>|undefined) }}
 */
_staticAnalysis.Config
/**
 * The module detection result.
 * @typedef {{ entry: (string|undefined), from: !Array<string>, packageJson: (string|undefined), name: (string|undefined), version: (string|undefined), internal: (string|undefined), hasMain: (boolean|undefined), package: (string|undefined), required: (boolean|undefined) }}
 */
_staticAnalysis.Detection
/**
 * @typedef {{ internal: (string|undefined), packageJson: (string|undefined), entry: (string|undefined), package: (string|undefined), hasMain: (boolean|undefined), required: (boolean|undefined) }}
 */
_staticAnalysis.DependencyMeta
