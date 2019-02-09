/* yarn example/ */
import staticAnalysis from '../src'

(async () => {
  const res = await staticAnalysis({
    text: 'example',
  })
  console.log(res)
})()