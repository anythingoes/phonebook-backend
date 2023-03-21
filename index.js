require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("reqBody", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqBody"
  )
);

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

const getRandomId = () => {
  return Math.floor(Math.random() * 10000);
};

app.get("/api/info", (request, response) => {
  const date = new Date().toString();
  response.send(
    `<div>
      <p>There are a total of ${persons.length} entries in the phonebook</p>
      <p>${date}</p>
    </div>`
  );
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// app.get("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);
//   const person = persons.find((person) => person.id === id);

//   if (person) {
//     response.json(person);
//   } else {
//     response.status(404).end();
//   }
// });

// app.delete("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);

//   persons = persons.filter((person) => person.id !== id);
//   response.status(204).end();
// });

app.post("/api/persons", (request, response) => {
  const person = request.body;

  if (!(person.name && person.number)) {
    return response.status(400).json({
      error: "name and number are required",
    });
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });

  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  });

  // const duplicate = persons.find(
  //   (personOld) => personOld.name.toLowerCase() === person.name.toLowerCase()
  // );

  // if (duplicate) {
  //   return response.status(400).json({
  //     error: "person already in phonebook",
  //   });
  // }

  // person.id = getRandomId();

  // persons = persons.concat(person);
  // response.json(person);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
