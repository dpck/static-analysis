const { dirname } = require('path');
const { builtinModules } = require('module');
const { read } = require('@wrote/wrote');
let mismatch = require('mismatch'); if (mismatch && mismatch.__esModule) mismatch = mismatch.default;
let resolveDependency = require('resolve-dependency'); if (resolveDependency && resolveDependency.__esModule) resolveDependency = resolveDependency.default;
let getMatches = require('@depack/detect'); if (getMatches && getMatches.__esModule) getMatches = getMatches.default;
let findPackageJson = require('fpj'); if (findPackageJson && findPackageJson.__esModule) findPackageJson = findPackageJson.default;

       const checkIfLib = modName => /^[./]/.test(modName)

/**
 * Detects all dependencies in a file and their dependencies recursively.
 * @param {string} path The path to the file in which to detect dependencies.
 */
const staticAnalysis = async (path) => {
  const detected = await detect(path)
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
      .filter(({ internal: i, entry: e }) => {
        if (internal) return internal == i
        if (entry) return entry == e
      })
      .map(({ from }) => from)
      .filter((el, i, a) => a.indexOf(el) == i)
    const newF =  { ...ff, from: froms }
    return newF
  })
  return f
}

/**
 * Detects the imports.
 * @param {string} path
 * @param {Object} cache
 * @returns {Array<Detection>}
 */
       const detect = async (path, cache = {}) => {
  if (path in cache) return []
  cache[path] = 1
  const source = await read(path)
  const matches = getMatches(source)
  const requireMatches = getRequireMatches(source)
  const allMatches = [...matches, ...requireMatches]

  let deps
  try {
    deps = await calculateDependencies(path, allMatches)
  } catch (err) {
    err.message = `${path}\n [!] ${err.message}`
    throw err
  }
  const d = deps.map(o => ({ ...o, from: path }))
  const entries = deps
    .filter(({ entry }) => entry && !(entry in cache))
  const discovered = await entries
    .reduce(async (acc, { entry, hasMain }) => {
      const accRes = await acc
      const res = await detect(entry, cache)
      const r = res
        .map(o => ({
          ...o,
          from: o.from ? o.from : entry,
          ...(!o.packageJson && hasMain ? { hasMain } : {}),
        }))
      return [...accRes, ...r]
    }, d)
  return discovered
}

/**
 * Expands the dependency match to include `package.json` and entry paths.
 * @param {string} path The path to the file.
 * @param {Array<string>} matches The matches.
 * @returns {Array<Promise<{internal?: string, packageJson?: string, entry?: string}>}
 */
const calculateDependencies = async (path, matches) => {
  const dir = dirname(path)
  const proms = matches.map(async (name) => {
    const internal = builtinModules.includes(name)
    if (internal) return { internal: name }
    const isLib = checkIfLib(name)
    if (isLib) {
      try {
        const { path: entry } = await resolveDependency(name, path)
        return { entry }
      } catch (err) { /*
        a local package with package.json
      */}
    }
    const {
      entry, packageJson, version, packageName, hasMain,
    } = await findPackageJson(dir, name)
    return { entry, packageJson, version, name: packageName, ...(hasMain ? { hasMain } : {}) }
  })
  return await Promise.all(proms)
}

       const getRequireMatches = (source) => {
  const m = mismatch(/(?:^|\s+)require\((['"])(.+?)\1\)/gm, source, ['q', 'from'])
  const res = m.map(a => a['from'])
  return res
}

/**
 * Sorts the detected dependencies into commonJS modules, packageJsons and internals.
 * @param {Array<Detection>} detected The detected matches
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
 * @typedef {Object} Detection The module detection result.
 * @prop {string} [entry] The path to the JavaScript file to be required. If an internal Node.js package is required, it's name is found in the `internal` field.
 * @prop {Array<string>} from The file in which the dependency was found.
 * @prop {string} [packageJson] The path to the `package.json` file of the dependency if it's a module.
 * @prop {string} [name] The name of the package.
 * @prop {string} [version] The version of the package.
 * @prop {string} [internal] If it's an internal NodeJS dependency, such as `fs` or `path`, contains its name.
 * @prop {boolean} [hasMain] Whether the entry from the package was specified via the `main` field and not `module` field.
 */


module.exports.checkIfLib = checkIfLib
module.exports.detect = detect
module.exports.getRequireMatches = getRequireMatches
module.exports.sort = sort