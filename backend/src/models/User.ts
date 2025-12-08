import mongoose, { Schema, Document } from 'mongoose';
import { IGroup } from './Group';

export interface IUser extends Document {
  surname: string;
  firstName: string;
  middleName: string;
  email?: string;
  phone?: string;
  group: IGroup['_id'];
  groupName: string;
  groupColor: string;
  groupColorCode?: string;
  uniqueIdentifier: string; // surname-firstName-middleName lowercase
  registrationDate: Date;
  lastActive: Date;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    device?: string;
  };
}

const UserSchema: Schema = new Schema({
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    trim: true,
    maxlength: [50, 'Surname cannot exceed 50 characters']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  middleName: {
    type: String,
    required: [true, 'Middle name is required'],
    trim: true,
    maxlength: [50, 'Middle name cannot exceed 50 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  groupName: {
    type: String,
    required: true
  },
  groupColor: {
    type: String,
    required: true
  },
  groupColorCode: {
    type: String,
    required: false
  },
  uniqueIdentifier: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    device: String
  }
}, {
  timestamps: true
});

// Create unique identifier and update lastActive before saving
UserSchema.pre('save', async function(this: any) {
  // Generate unique identifier
  this.uniqueIdentifier = `${this.surname.toLowerCase()}-${this.firstName.toLowerCase()}-${this.middleName.toLowerCase()}`;
  // Update lastActive timestamp
  this.lastActive = new Date();
  // return implicitly resolves the middleware
});

export default mongoose.model<IUser>('User', UserSchema);