let resolveDependency = require('resolve-dependency'); if (resolveDependency && resolveDependency.__esModule) resolveDependency = resolveDependency.default;
let erotic = require('erotic'); if (erotic && erotic.__esModule) erotic = erotic.default;
const { detect } = require('./lib');

/**
 * Detects all dependencies in a file and their dependencies recursively.
 * @param {string} path The path to the file in which to detect dependencies.
 * @param {!_staticAnalysis.Config} [config] The configuration options for `staticAnalysis`.
 * @param {boolean} [config.nodeModules=true] Whether to include packages from `node_modules` in the output. Default `true`.
 * @param {boolean} [config.shallow=false] Only report on the entries of `node_module` dependencies, without analysing their own dependencies. Default `false`.
 * @param {boolean} [config.soft=false] Do not throw an error when the dependency cannot be found in `node_modules`. Default `false`.
 * @param {!Array<string>} [config.fields] Any additional fields from `package.json` files to return.
 * @return {Promise<!Array<!_staticAnalysis.Detection>>} The array with detections.
 */
const staticAnalysis = async (path, config = {}) => {
  const e = erotic()
  const { path: p } = await resolveDependency(path)
  const {
    nodeModules = true,
    shallow = false,
    soft = false,
    fields = [],
  } = config
  let detected
  try {
    detected = await detect(p, {}, {
      nodeModules, shallow, soft, fields })
  } catch (err) {
    throw e(err)
  }
  const filtered = detected.filter(({ internal, entry }, i) => {
    if (internal) {
      const fi = detected.findIndex(({ internal: ii }) => {
        return ii == internal
      })
      return fi == i
    }
    const ei = detected.findIndex(({ entry: ee }) => {
      return entry == ee
    })
    return ei == i
  })
  const f = filtered.map((ff) => {
    const { entry, internal } = ff
    const froms = detected
      .filter(({ internal: i, entry: ee }) => {
        if (internal) return internal == i
        if (entry) return entry == ee
      })
      .map(({ from }) => from)
      .filter((el, i, a) => a.indexOf(el) == i)
    const newF =  { ...ff, from: froms }
    return newF
  })
    .map(({ package: pckg, ...props }) => {
      if (pckg) return { package: pckg, ...props }
      return props
    })
  return f
}

/**
 * Sorts the detected dependencies into commonJS modules, packageJsons and internals.
 * @param {!Array<!_staticAnalysis.Detection>} detected The detected matches
 */
       const sort = (detected) => {
  const packageJsons = []
  const commonJsPackageJsons = []
  const commonJs = []
  const js = []
  const internals = []
  const deps = []
  detected
    .forEach(({ packageJson, hasMain, name, entry, internal }) => {
      if (internal) return internals.push(internal)

      if (packageJson && hasMain)
        commonJsPackageJsons.push(packageJson)
      else if (packageJson) packageJsons.push(packageJson)
      if (entry && hasMain) commonJs.push(entry)
      else if (entry) js.push(entry)
      if (name) deps.push(name)
    })
  return { commonJsPackageJsons,
    packageJsons, commonJs, js, internals, deps }
}

module.exports=staticAnalysis

/* documentary types/index.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_staticAnalysis.Config} Config The configuration options for `staticAnalysis`.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _staticAnalysis.Config The configuration options for `staticAnalysis`.
 * @prop {boolean} [nodeModules=true] Whether to include packages from `node_modules` in the output. Default `true`.
 * @prop {boolean} [shallow=false] Only report on the entries of `node_module` dependencies, without analysing their own dependencies. Default `false`.
 * @prop {boolean} [soft=false] Do not throw an error when the dependency cannot be found in `node_modules`. Default `false`.
 * @prop {!Array<string>} [fields] Any additional fields from `package.json` files to return.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_staticAnalysis.Detection} Detection The module detection result.
 */
/**
 * @suppress {nonStandardJsDocs}
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
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_staticAnalysis.DependencyMeta} DependencyMeta
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _staticAnalysis.DependencyMeta
 * @prop {string} [internal] The name of the internal Node.JS package.
 * @prop {string} [packageJson] The location of the _package.json_ file.
 * @prop {string} [entry] The entry to the package (module or main fields).
 * @prop {string} [package] The package the entry belongs to.
 * @prop {boolean} [hasMain] Whether the dependency has main field.
 */


module.exports.sort = sort