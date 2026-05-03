import mongoose, { Schema, Model } from 'mongoose';

interface ITenant {
  name: string;
  description: string;
  tenantCategoryId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const tenantSchema = new Schema<ITenant>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tenantCategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'TenantCategory',
    required: true,
  },
}, {
  timestamps: true,
});

const Tenant: Model<ITenant> = mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', tenantSchema);

export default Tenant;
