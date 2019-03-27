import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import staticAnalysis from '../../src'

export default makeTestSuite('test/result', {
  context: TempContext,
  /**
   * @param {string} input
   * @param {TempContext} t
   */
  async getResults(input, { write }) {
    const f = await write('test.js', input)
    const res = await staticAnalysis(f)
    return res
  },
  jsonProps: ['expected'],
})