import resolveDependency from 'resolve-dependency'
import erotic from 'erotic'
import { detect } from './lib'

/**
 * Detects all dependencies in a file and their dependencies recursively.
 * @param {string} path The path to the file in which to detect dependencies.
 * @param {StaticAnalysisConfig} [config] The configuration for staticAnalysis.
 * @param {boolean} [config.nodeModules=true] Whether to include packages from `node_modules` in the output. Default `true`.
 * @param {boolean} [config.shallow=false] Only report on the entries of `node_module` dependencies, without analysing their own dependencies. Default `false`.
 * @param {boolean} [config.soft=false] Do not throw an error when the dependency cannot be found in `node_modules`. Default `false`.
 * @param {Array<string>} [config.fields] Any additional fields from `package.json` files to return.
 * @return {Promise<Array<Detection>>} The array with detections.
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
 * @typedef {Object} StaticAnalysisConfig The configuration for staticAnalysis.
 * @prop {boolean} [nodeModules=true] Whether to include packages from `node_modules` in the output. Default `true`.
 * @prop {boolean} [shallow=false] Only report on the entries of `node_module` dependencies, without analysing their own dependencies. Default `false`.
 * @prop {boolean} [soft=false] Do not throw an error when the dependency cannot be found in `node_modules`. Default `false`.
 * @prop {Array<string>} [fields] Any additional fields from `package.json` files to return.
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
