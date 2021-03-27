const config = require('dotenv').config().parsed
const mongoose = require('mongoose');

mongoose.connect(config.MONGO_DB_HOST + ':' + config.MONGO_DB_PORT + '/' + config.MONGO_DB_DATABASE, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log('db is running'))
    .catch(() => console.log('db is not running'));