import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import staticAnalysis from '../../src'

export default makeTestSuite('test/result', {
  context: TempContext,
  /**
   * @param {TempContext} t
   */
  async getResults({ write }) {
    const f = await write('test.js', this.input)
    const res = await staticAnalysis(f, this.options)
    return res // JSON.stringify(res, null, 2)
  },
  jsonProps: [
    'expected',
    'options',
  ],
})