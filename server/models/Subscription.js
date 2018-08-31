import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
  payload: {
    type: 'Map',
    required: true,
  }
});

const SubscriptionModel = mongoose.model('Subscription', SubscriptionSchema)
export default SubscriptionModel;
