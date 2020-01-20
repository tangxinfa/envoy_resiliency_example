"use strict";

const os = require("os");
const util = require("util");
const dns = require("dns");
const logger = require("koa-logger");
const router = require("koa-router")();
const Koa = require("koa");
const app = (module.exports = new Koa());

app.use(logger());
router
  .get("/service/stable_hello", stable_hello)
  .get("/service/unstable_hello", unstable_hello)
  .get("/service/inject_fault/:seconds", inject_fault);

app.use(router.routes());
app.listen(80);

var fault_seconds = 0.0;

function sleep(delayms) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, delayms);
  });
}

async function message(type) {
  let instance = process.env["INSTANCE_NAME"];
  let hostname = os.hostname();
  let lookup = util.promisify(dns.lookup, dns);
  let address = await lookup(hostname);
  return `${type} from behind Envoy instance(${instance}). hostname(${hostname}) address(${
    address.address
  }) fault(${fault_seconds})
`;
}

async function stable_hello(ctx) {
  ctx.body = await message("Stable hello");
}

async function unstable_hello(ctx) {
  await sleep(fault_seconds * 1000);
  ctx.body = await message("Unstable hello");
}

async function inject_fault(ctx) {
  fault_seconds = parseFloat(ctx.params.seconds);
  ctx.body = await message("Inject fault");
}
