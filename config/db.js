const mongoose = require('mongoose');
const Config = require('./config.json');

const connectDB = async () => {
    console.log(Config.mongoUri);
    try {
        const conn = await mongoose.connect(Config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;
