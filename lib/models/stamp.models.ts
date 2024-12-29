import mongoose from "mongoose";

const stampSchema = new mongoose.Schema({
  id: { type: String, required: true },
  clockIn: { type: Date, required: true },
  clockOut: { type: Date},
  isValid : { type : Boolean, default : true},
  lastUpdated : {type : Date, required : true} // New boolean flag
},{collection : 'stamps'});

const Stamp = mongoose.models.Stamp || mongoose.model("Stamp", stampSchema);

export default Stamp;
