import resolveDependency from 'resolve-dependency'
import erotic from 'erotic'
import { detect } from './lib'

/**
 * Detects all dependencies in a file and their dependencies recursively.
 * @param {!Array<string>|string} path The path to the file in which to detect dependencies.
 * @param {!_staticAnalysis.Config} [config] The configuration options for `staticAnalysis`.
 * @return {!Promise<!Array<_staticAnalysis.Detection>>}
 */
const staticAnalysis = async (path, config = {}) => {
  const e = erotic()
  let paths = Array.isArray(path) ? path : [path]
  paths = await Promise.all(paths.map(async p => {
    const { path: pp } = await resolveDependency(p)
    return pp
  }))

  const {
    nodeModules = true,
    shallow = false,
    soft = false,
    fields = [],
    mergeSameNodeModules = true,
  } = config
  let detected
  try {
    const cache = {}

    detected = await paths.reduce(async (acc, p) => {
      acc = await acc
      const res = await detect(p, cache, {
        nodeModules, shallow, soft, fields, mergeSameNodeModules })
      acc.push(...res)
      return acc
    }, [])
  } catch (err) {
    let [v] = process.version.split('.')
    v = parseInt(v.replace('v', ''), 10)
    if (v >= 12) throw err
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
 * @return {_staticAnalysis.SortReturn}
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

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../').Config} _staticAnalysis.Config
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../').SortReturn} _staticAnalysis.SortReturn
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../').Detection} _staticAnalysis.Detection
 */