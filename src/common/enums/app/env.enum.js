const { APP_PORT } = process.env;
const ENV = {
    APP: {
        API_PATH: '/',
        API_PORT: APP_PORT
    }
}
//export {ENV}
module.exports = ENV