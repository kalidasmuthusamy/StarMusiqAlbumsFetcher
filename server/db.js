import mongoose from 'mongoose';

const mongoDBConfig = process.env.DB_CONN_URL;

mongoose.connect(mongoDBConfig, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;

export default db;
