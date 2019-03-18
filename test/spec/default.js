import SnapshotContext from 'snapshot-context'
import staticAnalysis from '../../src'
import { detect } from '../../src/lib'

/** @type {Object.<string, (c: SnapshotContext)} */
const TS = {
  context: SnapshotContext,
  async '!detects the matches'({ test }) {
    const res = await detect('test/fixture/detect.js')
    await test('detect.json', res)
    // const packages = res.reduce((acc, current) => {
    //   const { internal, version, name } = current
    //   if (internal) return acc
    //   const key = `${name}-${version}`
    //   if (!(key in acc)) acc[key] = []
    //   acc[key].push(current)
    //   return acc
    // }, {})
  },
  async 'filters duplicates'({ test }) {
    const res = await staticAnalysis('test/fixture/detect.js')
    await test('detect-filtered.json', res)
  },
  async 'has main'({ test }) {
    const res = await staticAnalysis('test/fixture/lib/has-main.js')
    await test('detect-hasmain.json', res)
  },
  async 'read with dot'({ test }) {
    const res = await staticAnalysis('test/fixture/dot/dot.js')
    await test('detect-dot.json', res)
  },
}

export default TS