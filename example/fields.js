import staticAnalysis from '../src'

(async () => {
  const res = await staticAnalysis('example/source', {
    fields: ['license', 'homepage'],
    shallow: true,
  })
  console.log(res)
})()