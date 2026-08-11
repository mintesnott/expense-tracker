import mongoose from 'mongoose';

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema (
    {
        fullName: { type: String, required: true},
        email: { type: String, required: true, unique: true},
        password: { type: String, required: true },
        profileImageUrl: { type:String, default: null},
        isVerified: { type: Boolean, default: false, },
        emailVerificationToken: {type: String, default: null,},
        emailVerificationExpires: {type: Date, default: null,},
        tokenVersion: { type: Number, default: 0, },
    },
    {timestamps: true}
);


//hash password before saving 
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return ;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password
UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

//creating a jwt token
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { 
    id: this._id,
    fullName: this.fullName,
    tokenVersion: this.tokenVersion,
    },
    
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};


const User = mongoose.model('User', UserSchema);
export default User;
