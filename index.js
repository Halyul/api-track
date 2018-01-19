/**
 * Init Koa base
 */
const Koa = require('koa');
const app = new Koa();
app.proxy = true;
const jsonfile = require('jsonfile');
const config = jsonfile.readFileSync("./_config.json", {throws: false});

app.use(async ctx => {
  const request = ctx.request.query.request;
  const requestKey = ctx.request.query.key;
  const configKey = config.key;
  const apiName = ctx.request.query.api;
  if (requestKey === configKey) {
    const dataFile = './data.json';
    if (request === 'add' && apiName) {
      const addData = {
        ctx: ctx,
        dataFile: dataFile,
        api: apiName
      }
      add(addData);
    } else if (request === 'get') {
      const getData = {
        ctx: ctx,
        dataFile: dataFile,
        api: apiName
      }
      get(getData);
    } else {
      error(ctx, "Forbidden");
    };
  } else {
    error(ctx, "Forbidden");
  };
});

const port = config.port || 3000;
app.listen(port, function() {
  console.log('Server listening on', port);
  console.log('Server key is', config.key);
});

function add(addData) {
  const ctx = addData.ctx;
  const dataFile = addData.dataFile;
  const api = addData.api;
  const obj = jsonfile.readFileSync(dataFile, {throws: false});
  const succeededJson = {
    status: "Succeeded"
  };
  if (obj === null) {
    const obj = {};
    obj[api] = 1;
    jsonfile.writeFileSync(dataFile, obj, {spaces: 2});
    ctx.body = succeededJson;
  } else {
    if (typeof(obj[api]) === "undefined") {
      obj[api] = 1;
      jsonfile.writeFileSync(dataFile, obj, {spaces: 2});
      ctx.body = succeededJson;
    } else {
      obj[api]++;
      jsonfile.writeFileSync(dataFile, obj, {spaces: 2})
      ctx.body = succeededJson;
    };
  };
};

function get(getData){
  const ctx = getData.ctx;
  const dataFile = getData.dataFile;
  const api = getData.api;
  const obj = jsonfile.readFileSync(dataFile, {throws: false});
  const NFJson = {
    status: "Not Found"
  };
  if (typeof(api) === "undefined") {
    ctx.body = obj;
  } else {
    if (typeof(obj[api]) !== "undefined") {
      ctx.body = obj[api];
    } else {
      error(ctx, "Not Found");
    };
  };
};

function error(ctx, message) {
  const json = {
    status: message
  };
  ctx.body = json;
}
