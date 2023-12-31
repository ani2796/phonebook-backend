require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors());
// app.use(express.static('build'));
app.use(express.json());

// morgan logging

morgan.token('body', (req, res) => {
    console.log("request body: ", req.body);
    return JSON.stringify(req.body);
});

app.use(morgan('tiny', {
    skip: (req) => (req.method === "POST")
}));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: (req, res) => {
        return (req.method !== "POST");
    }
}))


// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "phone": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace",
//       "phone": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "phone": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "phone": "39-23-6423122"
//     }
// ]

// let personIds = new Set();

const Person = require('./models/person');

app.get("/api/persons", (request, response) => {
    console.log("GET request for /api/persons");
    Person.find({}).then(persons => {
        console.log("All persons: ", persons);
        response.json(persons);
    }).catch(error => {
        console.log("Error on GET /api/persons", error);
    });
});

app.get("/api/info", (request, response) => {
    const now = new Date();
    Person.count({}).then(count => {
        const responseString = 
        `<p> Phonebook has info for ${count} people. </p>
        <p> ${now} </p>`;

        response.send(responseString);
    }).catch(error => {
        console.log("Error on GET /api/info", error);
    });
})

app.get("/api/persons/:id", (request, response) => {
    // console.log("Searching for person: ", request.params.id);
    const id = request.params.id;
    // const person = persons.find(p => p.id === id);

    Person.findById(id).then(person => {
        console.log("GET person: ", person);
        if(person) {
            response.json(person);
        } else {
            response.status(404).end();
        }
    }).catch(error => {
        console.log("Error on GET /api/persons/", id, error);
    });
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    console.log("Deleting person", id);
    // persons = persons.filter(person => person.id !== id);

    console.log("Deleting person");
    Person.findByIdAndDelete(id).then(person => {
        console.log("Deleting person, promise success");
        // console.log("Deleted ", person);
        response.status(204).end();
    }).catch(error => {
        console.log("Error on DELETE /api/persons/", id, error);
    });
})

// const generateId = () => {
//     while(true) {
//         const newId = Math.floor(Math.random() * 1_000_000);
//         if(!personIds.has(newId)) {
//             personIds.add(newId);
//             return newId;
//         }
//     }
// }

app.post("/api/persons", (request, response) => {
    const name = request.body.name;
    const phone = request.body.phone;

    // Name and number must be present
    console.log("body.name: ", name);
    console.log("body.phone: ", phone);

    if(!(name && phone)) {
        response.status(400).json({
            error: "info missingno",
            nameMissing: Boolean(name),
            phoneMissing: Boolean(phone),
        });
        return;
    }

    // Name must not already exist
    Person.find({ name }).then(result => {
        if(result.length > 0) {
            console.log("Name already exists, must be unique", result);
            response.status(400).json({
                error: "Name already exists, must be unique"
            });
        } else {
            const newPerson = new Person({
                name: name,
                phone: phone,
            });
        
            newPerson.save().then(newPerson => {
                console.log("Person added: ", newPerson);
                response.json(newPerson);
            });
        }
    }).catch(error => {
        console.log("Error on POST /api/persons", error);
    });
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});