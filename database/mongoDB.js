const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/restful_api', { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('db is running'))
    .catch(() => console.log('db is not running'));