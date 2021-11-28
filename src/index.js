const Koa = require('koa');
const logger = require('koa-logger')
const Router = require('@koa/router');
const cors = require('koa2-cors')
const swagger = require("swagger2");
const {
    ui
} = require("swagger2-koa");

const useCache = process.env.USE_CACHE === 'true'
console.log({
    useCache
})
const api = useCache ? require("./cachedApi") : require("./api");

const router = new Router();
const apiRouter = new Router();

router.get('/', async (ctx) => {
    ctx.body = {
        'version': 1,
        'api': 'JAV Heaven API',
        'doc': 'http://localhost:3000/swagger'
    }
})

apiRouter.get('/actress', async (ctx) => {
    const {
        name,
        offset,
        hits
    } = ctx.query

    const result = await api.findActress(name, offset, hits)
    ctx.body = result
})
apiRouter.get('/actress/:actressId', async (ctx) => {
    const actressId = ctx.params.actressId
    const actress = await api.findActressByID(actressId)
    ctx.body = actress
})
apiRouter.get('/videos/:actressId', async (ctx) => {
    const actressId = ctx.params.actressId
    const {
        offset,
        hits
    } = ctx.query;

    const videos = await api.findVideos(actressId, offset, hits)
    ctx.body = videos
})

router.use('/api', apiRouter.routes(), apiRouter.allowedMethods())

const app = new Koa();
const swaggerDocument = swagger.loadDocumentSync(__dirname + "/../api.yaml");
app
    .use(logger())
    .use(cors())
    .use(ui(swaggerDocument, "/swagger"))
    .use(router.routes())
    .use(router.allowedMethods())

    .listen(3000);