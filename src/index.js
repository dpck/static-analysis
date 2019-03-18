import { detect } from './lib'

/**
 * Detects all dependencies in a file and their dependencies recursively.
 * @param {string} path The path to the file in which to detect dependencies.
 * @param {Config} config The configuration for staticAnalysis.
 * @param {boolean} [config.nodeModules=true] Whether to include packages from `node_modules` in the output. Default `true`.
 */
const staticAnalysis = async (path, config = {}) => {
  const { nodeModules = true } = config
  const detected = await detect(path, {}, nodeModules)
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
 * Sorts the detected dependencies into commonJS modules, packageJsons and internals.
 * @param {Array<Detection>} detected The detected matches
 */
export const sort = (detected) => {
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

export default staticAnalysis

/* documentary types/index.xml */
/**
 * @typedef {Object} Config The configuration for staticAnalysis.
 * @prop {boolean} [nodeModules=true] Whether to include packages from `node_modules` in the output. Default `true`.
 *
 * @typedef {Object} Detection The module detection result.
 * @prop {string} [entry] The path to the JavaScript file to be required. If an internal Node.js package is required, it's name is found in the `internal` field.
 * @prop {Array<string>} from The file in which the dependency was found.
 * @prop {string} [packageJson] The path to the `package.json` file of the dependency if it's a module.
 * @prop {string} [name] The name of the package.
 * @prop {string} [version] The version of the package.
 * @prop {string} [internal] If it's an internal NodeJS dependency, such as `fs` or `path`, contains its name.
 * @prop {boolean} [hasMain] Whether the entry from the package was specified via the `main` field and not `module` field.
 */
