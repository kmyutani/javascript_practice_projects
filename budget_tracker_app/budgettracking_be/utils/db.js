

const mongoose = require('mongoose');

module.exports = mongoose.connect(
    process.env.DB_CONN,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
)
.then(()=> console.log("Connected to database"))
.catch((err)=> console.log(err.message));