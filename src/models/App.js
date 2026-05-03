import mongoose from 'mongoose';

const appSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  link: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.App || mongoose.model('App', appSchema);

