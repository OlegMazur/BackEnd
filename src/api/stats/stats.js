const joi = require('joi');
var jwt = require("jsonwebtoken");
const initStats = (Router, db, statEmitter, stats) => {
    const router = Router();
    router.get("/", (req, res) => {
        try {
            let token = req.headers['authorization'];
            if (!token) {
                return res.status(401).send({ error: 'Not Authorized' });
            }
            token = token.replace('Bearer ', '');
            try {
                var tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
                if (tokenPayload.type != 'admin') {
                    throw new Error();
                }
            } catch (err) {
                return res.status(401).send({ error: 'Not Authorized' });
            }
            res.send(stats);
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        }
    });
    return router
}
module.exports = initStats