import staticAnalysis, { sort } from '../src'

(async () => {
  const d = await staticAnalysis('example/source.js')
  const sorted = sort(d)
  console.log(sorted)
})()