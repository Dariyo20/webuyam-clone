import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// Cart item is an embedded subdocument — no separate collection needed at this scale
export interface ICartItemBase {
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICartItemDocument extends ICartItemBase, Document {}

export interface ICartBase {
  userId: Types.ObjectId;
  items: Types.DocumentArray<ICartItemDocument>;
}

export interface ICartDocument extends ICartBase, Document {
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItemDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
  },
  { _id: true }
);

const cartSchema = new Schema<ICartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true, // one cart per user
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export const Cart: Model<ICartDocument> = mongoose.model<ICartDocument>(
  'Cart',
  cartSchema
);
