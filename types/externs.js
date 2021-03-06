/**
 * @fileoverview
 * @externs
 */
/* typal types/index.xml */
/** @const */
var _staticAnalysis = {}
/**
 * The configuration options for `staticAnalysis`.
 * @typedef {{ nodeModules: (boolean|undefined), shallow: (boolean|undefined), soft: (boolean|undefined), mergeSameNodeModules: (boolean|undefined), fields: ((!Array<string>)|undefined) }}
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
/**
 * The return of the sort function.
 * @record
 */
_staticAnalysis.SortReturn
/**
 * @type {!Array<string>}
 */
_staticAnalysis.SortReturn.prototype.packageJsons
/**
 * @type {!Array<string>}
 */
_staticAnalysis.SortReturn.prototype.commonJsPackageJsons
/**
 * @type {!Array<string>}
 */
_staticAnalysis.SortReturn.prototype.commonJs
/**
 * @type {!Array<string>}
 */
_staticAnalysis.SortReturn.prototype.js
/**
 * @type {!Array<string>}
 */
_staticAnalysis.SortReturn.prototype.internals
/**
 * @type {!Array<string>}
 */
_staticAnalysis.SortReturn.prototype.deps
