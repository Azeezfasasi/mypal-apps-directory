import mongoose, { Schema, Model } from 'mongoose';

interface IApp {
  name: string;
  description?: string;
  tenantId: mongoose.Types.ObjectId;
  link?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const appSchema = new Schema<IApp>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  link: {
    type: String,
  },
}, {
  timestamps: true,
});

const App: Model<IApp> = mongoose.models.App || mongoose.model<IApp>('App', appSchema);

export default App;
