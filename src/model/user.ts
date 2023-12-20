import mongoose from 'mongoose';
import { EMAIL_REGEX } from '../constant/regex';
import { TUserSchema } from '../types/schema/user.schema.types';

const { Schema } = mongoose;

const userSchema = new Schema<TUserSchema>({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [EMAIL_REGEX, 'Email format is invalid'],
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    select: false,
  },
  avatar: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
});

const UserModel = mongoose.model<TUserSchema>('User', userSchema, 'User');

export default UserModel;
