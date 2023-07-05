const mongoose = require('mongoose');
const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    phone: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);