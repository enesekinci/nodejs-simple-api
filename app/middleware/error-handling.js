
module.exports = async (error, request, response) => {
    const code = error.statusCode
    const message = error.message
    const responseData = {
        status: false,
        statusCode: code,
        message: message,
    }

    if (error.validation) {
        let message = error.message
        let param = message.split('\'')
        param = param[1]
        response.status(422).send({
            status: false,
            statusCode: 422,
            message: param + ' is required'
        })
    }
    const fastify = require("fastify")()
    request.log.error("hata oluştu")

    response.status(code).send(responseData)
}

