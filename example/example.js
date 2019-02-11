/* yarn example/ */
import staticAnalysis from '../src'

(async () => {
  const res = await staticAnalysis('example/source.js')
  console.log(res)
})()