import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  image: String,
  role: { type: String, required: true, default: "Instuctor" },
  onboarded: { type: Boolean, default: false },
  pay : {type : Number, default : 0},
  verified: { type: Boolean, default: false }, 
  location : {type : String, required : true},
},{collection : 'users'});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
