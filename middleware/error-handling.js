
module.exports = async (error, request, response) => {
    const code = error.statusCode
    const message = error.message
    const responseData = {
        status: false,
        statusCode: code,
        message: message,
    }

    console.log(error);

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

    response.status(code).send(responseData)
}

