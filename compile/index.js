const { _staticAnalysis, _sort } = require('./depack')

/**
 * Detects all dependencies in a file and their dependencies recursively. Returns the array with detections.
 * @param {string|!Array<string>} path The path to the file in which to detect dependencies.
 * @param {!_staticAnalysis.Config} config The configuration options for `staticAnalysis`.
 * @param {boolean} [config.nodeModules=true] Whether to include packages from `node_modules` in the output. Default `true`.
 * @param {boolean} [config.shallow=false] Only report on the entries of `node_module` dependencies, without analysing their own dependencies. Default `false`.
 * @param {boolean} [config.soft=false] Do not throw an error when the dependency cannot be found in `node_modules`. Default `false`.
 * @param {boolean} [config.mergeSameNodeModules=true] For situation when inner node_modules contain already referenced node_modules, this will ensure that only the top-level ones with the same version are matched. For example, there can be `node_modules/a`, `node_modules/b` packages, and the later one can contain `node_modules/b/node_modules/a` of the same version (e.g., if the structure wasn't flattened by something like `yarn upgrade`). In this case, only the top one is returned. Default `true`.
 * @param {!Array<string>} [config.fields] Any additional fields from `package.json` files to return.
 * @return {Promise<!Array<!_staticAnalysis.Detection>>}
 */
function staticAnalysis(path, config) {
  return _staticAnalysis(path, config)
}

/**
 * Sorts the detected dependencies into commonJS modules, packageJsons and internals.
 * @param {!Array<!_staticAnalysis.Detection>} detected The detected matches.
 * @return {_staticAnalysis.SortReturn}
 */
function sort(detected) {
  return _sort(detected)
}

module.exports = staticAnalysis
module.exports.sort = sort

/* typal types/index.xml namespace */
/**
 * @typedef {_staticAnalysis.Config} Config The configuration options for `staticAnalysis`.
 * @typedef {Object} _staticAnalysis.Config The configuration options for `staticAnalysis`.
 * @prop {boolean} [nodeModules=true] Whether to include packages from `node_modules` in the output. Default `true`.
 * @prop {boolean} [shallow=false] Only report on the entries of `node_module` dependencies, without analysing their own dependencies. Default `false`.
 * @prop {boolean} [soft=false] Do not throw an error when the dependency cannot be found in `node_modules`. Default `false`.
 * @prop {boolean} [mergeSameNodeModules=true] For situation when inner node_modules contain already referenced node_modules, this will ensure that only the top-level ones with the same version are matched. For example, there can be `node_modules/a`, `node_modules/b` packages, and the later one can contain `node_modules/b/node_modules/a` of the same version (e.g., if the structure wasn't flattened by something like `yarn upgrade`). In this case, only the top one is returned. Default `true`.
 * @prop {!Array<string>} [fields] Any additional fields from `package.json` files to return.
 * @typedef {_staticAnalysis.Detection} Detection The module detection result.
 * @typedef {Object} _staticAnalysis.Detection The module detection result.
 * @prop {string} [entry] The path to the JavaScript file to be required. If an internal Node.js package is required, it's name is found in the `internal` field.
 * @prop {!Array<string>} from The file in which the dependency was found.
 * @prop {string} [packageJson] The path to the `package.json` file of the dependency if it's a module.
 * @prop {string} [name] The name of the package.
 * @prop {string} [version] The version of the package.
 * @prop {string} [internal] If it's an internal NodeJS dependency, such as `fs` or `path`, contains its name.
 * @prop {boolean} [hasMain] Whether the entry from the package was specified via the `main` field and not `module` field.
 * @prop {string} [package] If the entry is a library file withing a package, this field contains its name. Same as the `name` field for the _main/module_ entries.
 * @prop {boolean} [required] Whether the package was required using the `require` statement.
 * @typedef {_staticAnalysis.DependencyMeta} DependencyMeta
 * @typedef {Object} _staticAnalysis.DependencyMeta
 * @prop {string} [internal] The name of the internal Node.JS package.
 * @prop {string} [packageJson] The location of the _package.json_ file.
 * @prop {string} [entry] The entry to the package (module or main fields).
 * @prop {string} [package] The package the entry belongs to.
 * @prop {boolean} [hasMain] Whether the dependency has main field.
 * @prop {boolean} [required] Whether the dependency was required.
 * @typedef {_staticAnalysis.SortReturn} SortReturn `＠record` The return of the sort function.
 * @typedef {Object} _staticAnalysis.SortReturn `＠record` The return of the sort function.
 * @prop {!Array<string>} packageJsons
 * @prop {!Array<string>} commonJsPackageJsons
 * @prop {!Array<string>} commonJs
 * @prop {!Array<string>} js
 * @prop {!Array<string>} internals
 * @prop {!Array<string>} deps
 */
