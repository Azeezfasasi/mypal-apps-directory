import mongoose, { Schema, Model } from 'mongoose';

interface ITenantCategory {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const tenantCategorySchema = new Schema<ITenantCategory>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

const TenantCategory: Model<ITenantCategory> = mongoose.models.TenantCategory || mongoose.model<ITenantCategory>('TenantCategory', tenantCategorySchema);

export default TenantCategory;
