import mongoose from "mongoose";

const stampSchema = new mongoose.Schema({
  id: { type: String, required: true },
  clockIn: { type: Date, required: true },
  clockOut: { type: Date},
  lastUpdated : {type : Date, required : true} // New boolean flag
},{collection : 'Stamps'});

const Stamp = mongoose.models.Stamp || mongoose.model("Stamp", stampSchema);

export default Stamp;
