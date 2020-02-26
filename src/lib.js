import { dirname, join } from 'path'
import { builtinModules } from 'module'
import read from '@wrote/read'
import resolveDependency from 'resolve-dependency'
import getMatches from '@depack/detect'
import split from '@depack/split'
import findPackageJson from 'fpj'
import mismatch from 'mismatch'
import erotic from 'erotic'

export const checkIfLib = modName => /^[./]/.test(modName)

/**
 * Expands the dependency match to include `package.json` and entry paths.
 * @param {string} path The path to the file.
 * @param {!Array<string>} matches The matches.
 * @param {boolean} [soft] Whether to throw when a dependency's package.json is not found.
 * @param {!Array<string>} [fields] What additional fields to fetch from package.json.
 * @returns {!Promise<!Array<!_staticAnalysis.DependencyMeta>>}
 */
const getDependenciesMeta = async (path, matches, soft, fields, pckg = null) => {
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
      let [v] = process.version.split('.')
      v = parseInt(v.replace('v', ''), 10)
      if (v >= 12) throw err
      throw e(err)
    }
  })
  return (await Promise.all(proms)).filter(Boolean)
}

/**
 * Detects the imports.
 * @param {string} path
 * @param {Object} cache
 * @returns {!Promise<!Array<!_staticAnalysis.Detection>>}
 */
export const detect = async (path, cache = {}, {
  nodeModules = true, shallow = false, soft = false, fields = [],
  node_modules_cache = {},
  mergeSameNodeModules = true,
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
    const dm = await getDependenciesMeta(path, fm, soft, fields, pckg)
    const rm = await getDependenciesMeta(path, fr, soft, fields, pckg)
    rm.forEach((val) => {
      val.required = true
    })
    deps = [...dm, ...rm]
  } catch (err) {
    err.message = `${path}\n [!] ${err.message}`
    throw err
  }
  const Deps = mergeSameNodeModules ? deps.map(o => {
    const { name, version, required } = o
    if (name && version) {
      // for non-flattened node_modules structure, e.g., when linking
      // to prevent multiple same packages like
      // depA, node_modules/depB/node_modules/depA
      const n = `${name}:${version}${required ? '-required' : ''}`
      const existing = node_modules_cache[n]
      if (existing) return existing

      node_modules_cache[n] = o
    }
    return o
  }) : deps
  const d = Deps.map(o => ({ ...o, from: path }))
  const entries = Deps
    .filter(({ entry }) => {
      return entry && !(entry in cache)
    })
  const discovered = await entries
    .reduce(async (acc, {
      entry, hasMain, packageJson, name, package: p }) => {
      if (packageJson && shallow) return acc
      const accRes = await acc
      const res = await detect(entry, cache, {
        nodeModules, shallow, soft, fields, package: name || p,
        node_modules_cache, mergeSameNodeModules,
      })
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

export const getRequireMatches = (source) => {
  const m = mismatch(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, source, ['q', 'from'])
  const res = m.map(a => a['from'])
  return res
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').Detection} _staticAnalysis.Detection
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').DependencyMeta} _staticAnalysis.DependencyMeta
 */