
module.exports = async (error, request, response) => {
    // console.log('SUBMODULE ERROR HANDLER')
    // console.log(error.statusCode);
    // console.log(error.code);
    // console.log(error.message);
    // console.log(request.body);
    // response.status(500)

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
}

