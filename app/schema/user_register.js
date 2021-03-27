module.exports = {
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
        },
        required: ['name', 'username', 'email', 'password']
    }
}

