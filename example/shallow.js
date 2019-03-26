import staticAnalysis from '../src'

(async () => {
  const res = await staticAnalysis('example/source.js', {
    shallowNodeModules: true,
  })
  console.log(res)
})()