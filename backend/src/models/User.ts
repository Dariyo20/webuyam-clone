import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserBase {
  name: string;
  email: string;
  passwordHash: string;
}

export interface IUserDocument extends IUserBase, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
  },
  { timestamps: true }
);

// Never expose passwordHash in JSON responses
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as { passwordHash?: string })['passwordHash'];
    return ret;
  },
});

export const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
  'User',
  userSchema
);
