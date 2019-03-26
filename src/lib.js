import { dirname } from 'path'
import { builtinModules } from 'module'
import read from '@wrote/read'
import resolveDependency from 'resolve-dependency'
import getMatches from '@depack/detect'
import findPackageJson from 'fpj'
import mismatch from 'mismatch'

export const checkIfLib = modName => /^[./]/.test(modName)

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

/**
 * Detects the imports.
 * @param {string} path
 * @param {Object} cache
 * @returns {Array<Detection>}
 */
export const detect = async (path, cache = {}, {
  nodeModules = true, shallow = false } = {}) => {
  if (path in cache) return []
  cache[path] = 1
  const source = await read(path)
  const matches = getMatches(source)
  const requireMatches = getRequireMatches(source)
  const allMatches = [...matches, ...requireMatches]
  const m = nodeModules ? allMatches : allMatches.filter(checkIfLib)

  let deps
  try {
    deps = await calculateDependencies(path, m)
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
      const res = await detect(entry, cache, nodeModules)
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
  const m = mismatch(/(?:^|\s+)require\((['"])(.+?)\1\)/gm, source, ['q', 'from'])
  const res = m.map(a => a['from'])
  return res
}
