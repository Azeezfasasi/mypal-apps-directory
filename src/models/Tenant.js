import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tenantCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TenantCategory',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema);

