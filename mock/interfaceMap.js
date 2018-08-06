const tableList = require('./datas/tableList');
const login = require('./datas/login');
const userInfo = require('./datas/userInfo');
const serve = require('./datas/serveList');
const agent = require('./datas/agentList');
const intent = require('./datas/intentList');
const entity = require('./datas/entityList');
const corpus = require('./datas/corpus');

const suffix = '.json';

module.exports = {
  [`/login${suffix}`]: login,
  [`/userInfo${suffix}`]: userInfo,
  [`/tableList${suffix}`]: tableList,
  [`/serve${suffix}`]: serve,
  [`/agents${suffix}`]: agent,
  [`/intents${suffix}`]: intent,
  [`/parameters${suffix}`]: entity,
  [`/unknown-says${suffix}`]: corpus,
}
