import { makeTestSuite } from 'zoroaster'
import Context from '../context'
import staticAnalysis from '../../src'

const ts = makeTestSuite('test/result', {
  async getResults(input) {
    const res = await staticAnalysis({
      text: input,
    })
    return res
  },
  context: Context,
})

// export default ts
