const cookieParser = require('cookie-parser')
const router = require('./router.js')
export function mock(opts) {
  return {
    name: 'vite:mock',
    load(id) {
      // 在钩子逻辑中可以通过闭包访问外部的 options 传参
    },
    config(config){
    },
    options(options){
      return options
    },
    async configResolved(resolvedConfig){
      await router.init(resolvedConfig)
    },
    transform(code,id){
    },
    configureServer(server) {
      let app = server.middlewares
      app.use(cookieParser())
      app.use(router);
      // setTimeout(() => {
      //   process.kill(process.pid, 'SIGTERM');
      // }, 3000)
      return () => {
        app.use((req, res, next) => {
          next()
        })
      }
    },
    transformIndexHtml(html){
      return html
    },
    async handleHotUpdate(ctx) {},
    async buildStart() {},
    async buildEnd() { await router.dispose() },
    async closeBundle() {}
  }
}