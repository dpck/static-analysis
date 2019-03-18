import staticAnalysis from '../src'

(async () => {
  const res = await staticAnalysis('example/source.js', {
    nodeModules: false,
  })
  console.log(res)
})()