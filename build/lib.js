const { dirname, join } = require('path');
const { builtinModules } = require('module');
let read = require('@wrote/read'); if (read && read.__esModule) read = read.default;
let resolveDependency = require('resolve-dependency'); if (resolveDependency && resolveDependency.__esModule) resolveDependency = resolveDependency.default;
let getMatches = require('@depack/detect'); if (getMatches && getMatches.__esModule) getMatches = getMatches.default;
let findPackageJson = require('fpj'); if (findPackageJson && findPackageJson.__esModule) findPackageJson = findPackageJson.default;
let mismatch = require('mismatch'); if (mismatch && mismatch.__esModule) mismatch = mismatch.default;
let erotic = require('erotic'); if (erotic && erotic.__esModule) erotic = erotic.default;

       const checkIfLib = modName => /^[./]/.test(modName)

// https://github.com/idiocc/frontend/blob/master/src/lib/index.js#L7
       const splitFrom = (from) => {
  let [scope, name, ...paths] = from.split('/')
  if (!scope.startsWith('@') && name) {
    paths = [name, ...paths]
    name = scope
  } else if (!scope.startsWith('@')) {
    name = scope
  } else {
    name = `${scope}/${name}`
  }
  return { name, paths: paths.join('/') }
}

/**
 * Expands the dependency match to include `package.json` and entry paths.
 * @param {string} path The path to the file.
 * @param {Array<string>} matches The matches.
 * @param {boolean} [soft] Whether to throw when a dependency's package.json is not found.
 * @returns {Array<Promise<{internal?: string, packageJson?: string, entry?: string}>}
 */
const calculateDependencies = async (path, matches, soft) => {
  const e = erotic()
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
        maybe a local package with package.json
      */}
    } else {
      const { name: n, paths } = splitFrom(name)
      if (paths) {
        const { packageJson } = await findPackageJson(dir, n)
        const d = dirname(packageJson)
        const { path: entry } = await resolveDependency(join(d, paths))
        return { entry }
      }
    }
    try {
      const {
        entry, packageJson, version, packageName, hasMain,
      } = await findPackageJson(dir, name)
      return { entry, packageJson, version, name: packageName, ...(hasMain ? { hasMain } : {}) }
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
  nodeModules = true, shallow = false, soft = false } = {}) => {
  if (path in cache) return []
  cache[path] = 1
  const source = await read(path)
  const matches = getMatches(source)
  const requireMatches = getRequireMatches(source)
  const allMatches = [...matches, ...requireMatches]
  const m = nodeModules ? allMatches : allMatches.filter(checkIfLib)

  let deps
  try {
    deps = await calculateDependencies(path, m, soft)
  } catch (err) {
    err.message = `${path}\n [!] ${err.message}`
    throw err
  }
  const d = deps.map(o => ({ ...o, from: path }))
  const entries = deps
    .filter(({ entry }) => entry && !(entry in cache))
  const discovered = await entries
    .reduce(async (acc, { entry, hasMain, packageJson }) => {
      if (packageJson && shallow) return acc
      const accRes = await acc
      const res = await detect(entry, cache, { nodeModules, shallow, soft })
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
  const m = mismatch(/(?:^|\s+)require\((['"])(.+?)\1\)/gm, source, ['q', 'from'])
  const res = m.map(a => a['from'])
  return res
}


module.exports.checkIfLib = checkIfLib
module.exports.splitFrom = splitFrom
module.exports.detect = detect
module.exports.getRequireMatches = getRequireMatches