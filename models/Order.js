import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  items: { type: Array, default: [] },
  customer: { type: Object, default: {} },
  subtotal: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: 'placed' },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
