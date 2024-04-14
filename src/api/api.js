// import { ApiPath } from "../common/enums/api/api-path.enum.js";
// import { initUsers } from "./users/users.api.js";
const ApiPath = require("../common/enums/api/api-path.enum.js");
const initUsers = require("./users/users.api.js")

const initApi = (Router,db,statEmitter) => {
   const apiRouter = Router();
   apiRouter.use(ApiPath.USERS, initUsers(Router,db,statEmitter))
   return apiRouter;
}
//export { initApi }
module.exports=initApi