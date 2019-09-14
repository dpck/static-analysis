import idio from '@idio/idio'
import initRoutes, { watchRoutes } from '@idio/router'

(async () => {
  const { url, app, router } = await idio()
  const w = await initRoutes(router, 'routes')
  await watchRoutes(w)
  app.use(router.routes())
  // Object.assign(app.context, { staticAnalysis: res,
  //   relative: '../depack',
  // })
  console.log(url)
})()