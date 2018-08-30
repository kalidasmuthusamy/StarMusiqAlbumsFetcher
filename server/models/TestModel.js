import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TestModelSchema = new Schema({
  a_string: { type: String, default: 'Dass Mk' },
  a_date: { type: Date, default: Date.now },
});

const TestModel = mongoose.model('TestModel', TestModelSchema)

export default TestModel;
