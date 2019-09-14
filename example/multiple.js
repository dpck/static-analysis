import staticAnalysis from '../src'

(async () => {
  /* start example */
  const res = await staticAnalysis([
    'test/fixture/multiple/a.js',
    'test/fixture/multiple/b.js',
  ])
  console.log(res)
  /* end example */
})()