const getmac = require('getmac')
const { getUserAgent } = require("universal-user-agent");

module.exports = function (request, response, done) {
    const userAgent = getUserAgent()
    const macAddress = getmac.default()

    request.device = userAgent
    request.macAddress = macAddress

    done()
}