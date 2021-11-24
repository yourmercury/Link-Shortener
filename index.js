const app = require('express')();
const mongoose = require('mongoose');
const controller = require("./controllers/controller");
const PORT = process.env.PORT || 3100;

//Uri to MongoDB
const uri = process.env.MONGO_DB_CREDENTIAL;

    //This IIFE connects to MongoDB and Makes sure that only after a succesfull connection will the Routes in the Controller be open.
(async function () {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        mongoose.connection.on('error', err => {
            console.log(err);
        });

        mongoose.connection.on('open', () => {
            console.log("connected to the database");
        });

        //Initiating Express Routes
        controller(app);

    }
    catch (error) {
        console.log(error);
    }
}());


//Server starts Listening
app.listen(PORT, () => {
    console.log("Server is listening at port " + PORT);
})