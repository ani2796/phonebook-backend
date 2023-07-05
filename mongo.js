const mongoose = require('mongoose');

let option;
switch(process.argv.length) {
    case 2: option = "no_password";
            break;
    case 3: option = "fetch_all";
            break;
    case 4: option = "no_phone";
            break;
    case 5: option = "append";
            break;
}

if(option === "no_password" || option === "no_phone") {
    console.log(`Error: ${option}`);
    process.exit(1);
}

const password = process.argv[2];
// console.log("Args: ");
// process.argv.forEach(arg => console.log(arg));
const url = 
    `mongodb+srv://anirudhsriram96:${password}@cluster0.g4kqdc2.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    phone: String
});

const Person = mongoose.model('Person', personSchema);

if(option === "fetch_all") {
    Person.find({}).then(result => {
        console.log("All persons:");
        result.forEach(person => {
            console.log(person);
        });
        mongoose.connection.close();
    })
}

if(option === "append") {
    const person = new Person({
        name: process.argv[3],
        phone: process.argv[4]
    });

    console.log("Saving contact...", person)
    person.save().then(result => {
        console.log("Contact saved, result: ", result);
        mongoose.connection.close();
    })
}