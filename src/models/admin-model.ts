import { Schema, model } from 'mongoose';
import { TAdmin } from '#types/admin-types';

const adminSchema = new Schema<TAdmin>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'admins',
  },
);

export const Admin = model<TAdmin>('Admin', adminSchema);
