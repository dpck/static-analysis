const { dirname, join } = require('path');
const { builtinModules } = require('module');
let read = require('@wrote/read'); if (read && read.__esModule) read = read.default;
let resolveDependency = require('resolve-dependency'); if (resolveDependency && resolveDependency.__esModule) resolveDependency = resolveDependency.default;
let getMatches = require('@depack/detect'); if (getMatches && getMatches.__esModule) getMatches = getMatches.default;
let split = require('@depack/split'); if (split && split.__esModule) split = split.default;
let findPackageJson = require('fpj'); if (findPackageJson && findPackageJson.__esModule) findPackageJson = findPackageJson.default;
let mismatch = require('mismatch'); if (mismatch && mismatch.__esModule) mismatch = mismatch.default;
let erotic = require('erotic'); if (erotic && erotic.__esModule) erotic = erotic.default;

       const checkIfLib = modName => /^[./]/.test(modName)

/**
 * Expands the dependency match to include `package.json` and entry paths.
 * @param {string} path The path to the file.
 * @param {Array<string>} matches The matches.
 * @param {boolean} [soft] Whether to throw when a dependency's package.json is not found.
 * @param {!Array<string>} [fields] What additional fields to fetch from package.json.
 * @returns {Promise<!Array<{internal?: string, packageJson?: string, entry?: string, package?: string}>>}
 */
const getDependencyMeta = async (path, matches, soft, fields, pckg = null) => {
  const e = erotic()
  const dir = dirname(path)
  const proms = matches.map(async (name) => {
    const internal = builtinModules.includes(name)
    if (internal) return { internal: name }
    const isLib = checkIfLib(name)
    if (isLib) {
      try {
        const { path: entry } = await resolveDependency(name, path)
        return { entry, package: pckg }
      } catch (err) { /*
        maybe a local package with package.json
      */}
    } else {
      const { name: n, paths } = split(name)
      if (paths) {
        const { packageJson, packageName } = await findPackageJson(dir, n)
        const d = dirname(packageJson)
        const { path: entry } = await resolveDependency(join(d, paths))
        return { entry, package: packageName }
      }
    }
    try {
      const {
        entry, packageJson, version, packageName, hasMain, ...rest
      } = await findPackageJson(dir, name, { fields })
      if (packageName == pckg) {
        console.warn('[static-analysis] Skipping package %s that imports itself in %s', packageName, path)
        return null
      }
      return {
        entry, packageJson, version, name: packageName,
        ...(hasMain ? { hasMain } : {}),
        ...rest }
    } catch (err) {
      if (soft) return null
      throw e(err)
    }
  })
  return (await Promise.all(proms)).filter(Boolean)
}

/**
 * Detects the imports.
 * @param {string} path
 * @param {Object} cache
 * @returns {Promise<Array<Detection>>}
 */
       const detect = async (path, cache = {}, {
  nodeModules = true, shallow = false, soft = false, fields = [],
  package: pckg } = {}) => {
  if (path in cache) return []
  cache[path] = 1
  const source = await read(path)
  const matches = getMatches(source)
  const requireMatches = getRequireMatches(source)
  const fm = nodeModules ? matches : matches.filter(checkIfLib)
  const fr = nodeModules ? requireMatches : requireMatches.filter(checkIfLib)

  let deps
  try {
    const dm = await getDependencyMeta(path, fm, soft, fields, pckg)
    const rm = await getDependencyMeta(path, fr, soft, fields, pckg)
    rm.forEach((val) => {
      val.required = true
    })
    deps = [...dm, ...rm]
  } catch (err) {
    err.message = `${path}\n [!] ${err.message}`
    throw err
  }
  const d = deps.map(o => ({ ...o, from: path }))
  const entries = deps
    .filter(({ entry }) => entry && !(entry in cache))
  const discovered = await entries
    .reduce(async (acc, {
      entry, hasMain, packageJson, name, package: p }) => {
      if (packageJson && shallow) return acc
      const accRes = await acc
      const res = await detect(entry, cache, { nodeModules, shallow, soft, fields, package: name || p })
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

       const getRequireMatches = (source) => {
  const m = mismatch(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, source, ['q', 'from'])
  const res = m.map(a => a['from'])
  return res
}


module.exports.checkIfLib = checkIfLib
module.exports.detect = detect
module.exports.getRequireMatches = getRequireMatches