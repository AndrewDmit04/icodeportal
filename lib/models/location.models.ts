import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
}, { collection: 'locations' });

const Location = mongoose.models.Location || mongoose.model('Location', LocationSchema);

export default Location;
