let idio = require('@idio/core'); if (idio && idio.__esModule) idio = idio.default;
let initRoutes = require('@idio/router'); const { watchRoutes } = initRoutes; if (initRoutes && initRoutes.__esModule) initRoutes = initRoutes.default;

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