import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import staticAnalysis from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof staticAnalysis, 'function')
  },
  async 'calls package without error'() {
    await staticAnalysis()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await staticAnalysis({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T