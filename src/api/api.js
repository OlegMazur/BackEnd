// import { ApiPath } from "../common/enums/api/api-path.enum.js";
// import { initUsers } from "./users/users.api.js";
const ApiPath = require("../common/enums/api/api-path.enum.js");
const initUsers = require("./users/users.api.js");
const initTransactions = require("./transactions/transactions.js");
const initBets = require("./bets/bets.js");
const initEvents = require("./events/events.js");
const initHealth = require("./health/health.js");
const initStats = require("./stats/stats.js");
const initApi = (Router, db, statEmitter, stats) => {
   const apiRouter = Router();
   apiRouter.use(ApiPath.USERS, initUsers(Router, db, statEmitter));
   apiRouter.use(ApiPath.BETS, initBets(Router, db, statEmitter));
   apiRouter.use(ApiPath.EVENTS, initEvents(Router, db, statEmitter));
   apiRouter.use(ApiPath.STATS, initStats(Router, db, statEmitter, stats));
   apiRouter.use(ApiPath.TRANSACTION, initTransactions(Router, db, statEmitter));
   apiRouter.use(ApiPath.HEALTH, initHealth(Router, db, statEmitter));
   return apiRouter;
}
//export { initApi }
module.exports = initApi