
module.exports = async (error, request, response) => {
    console.log(error)
    const code = error.statusCode || 500
    const message = error.message
    const responseData = {
        status: false,
        statusCode: code,
        message: message,
    }

    if (error.code === 11000)
        response.send({
            status: false,
            statusCode: 400,
            message: Object.values(error.keyValue) + ' Daha Önce kullanılmış',
        })

    if (error.code === 66)
        response.send({
            status: false,
            statusCode: 400,
            message: 'Id Alanına Müdahale Edilemez'
        });

    if (error.validation) {
        let message = error.message
        console.log("error validation")
        console.log(error.message)
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

