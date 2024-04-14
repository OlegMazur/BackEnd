const initHealth = (Router, db, statEmitter) => {
    const router = Router()
    router.get("/", (req, res) => {
        res.send("Hello World!");
    });
    return router
}
module.exports = initHealth