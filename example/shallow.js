import staticAnalysis from '../src'

(async () => {
  const res = await staticAnalysis('example/source.js', {
    shallow: true,
  })
  console.log(res)
})()