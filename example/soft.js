import staticAnalysis from '../src'

(async () => {
  try {
    const res = await staticAnalysis('example/missing-dep')
    console.log(res)
  } catch (err) {
    console.log(err)
  }
})()

;(async () => {
  const res = await staticAnalysis('example/missing-dep', {
    soft: true,
  })
  console.log('Soft mode on: %s', res)
})()