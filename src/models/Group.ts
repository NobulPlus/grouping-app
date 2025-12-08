import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  color: string;
  colorCode: string;
  description?: string;
  maxCapacity?: number;
  currentCount: number;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

// ADD THIS — interface for statics on the model
export interface IGroupModel extends Model<IGroup> {
  initializeGroups(): Promise<void>;
}

const GroupSchema: Schema<IGroup> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ['Orange', 'Blue', 'Green', 'Black']
    },
    color: {
      type: String,
      required: true,
      unique: true
    },
    colorCode: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    maxCapacity: {
      type: Number,
      default: null // null means no limit
    },
    currentCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// ✔ Add static method with correct typing
GroupSchema.statics.initializeGroups = async function () {
  const count = await this.countDocuments();
  if (count === 0) {
    const groups = [
      { name: 'Orange', color: 'orange', colorCode: '#FF6B35', order: 1 },
      { name: 'Blue', color: 'blue', colorCode: '#2563EB', order: 2 },
      { name: 'Green', color: 'green', colorCode: '#10B981', order: 3 },
      { name: 'Black', color: 'purple', colorCode: '#1F2937', order: 4 }
    ];
    await this.insertMany(groups);
    console.log('✅ Groups initialized with vibrant colors');
  }
};

// ✔ Export model WITH the static interface applied
export default mongoose.model<IGroup, IGroupModel>('Group', GroupSchema);
