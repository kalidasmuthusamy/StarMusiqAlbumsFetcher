import mongoose from 'mongoose';

const mongoDBConfig = 'mongodb://localhost/new_tamil_albums';

mongoose.connect(mongoDBConfig);
mongoose.Promise = global.Promise;

const db = mongoose.connection;

export default db;
