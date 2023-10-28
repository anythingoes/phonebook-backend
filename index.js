require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.static("dist")); //middleware used to serve the static index.html file from the dist directory which containts frontend react code
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary",
    number: "39-23-6423122",
  },
];

const generateRandomId = () => {
  return Math.floor(Math.random() * 10000);
};

app.get("/api/persons/", (req, res) => {
  Person.find({}).then((result) => res.json(result));
});

app.get("/info/", (req, res) => {
  res.send(
    `<div>
      <p>Phone book has info for ${persons.length} people</p>
      <p>${new Date().toString()}</p>  
      </div>`
  );
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id).then((result) =>
    res.status(204).end()
  );
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "incomplete phonebook entry",
    });
  }

  // const duplicatePerson = persons.find(
  //   (person) => person.name.toLowerCase() === body.name.toLowerCase()
  // );

  // if (duplicatePerson) {
  //   return res.status(400).json({
  //     error: "name already in phonebook",
  //   });
  // }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((result) => res.json(result));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const updatedPerson = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true })
    .then((returnedPerson) => {
      if (returnedPerson) {
        res.json(returnedPerson);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(404).send({ error: "malformatted id" });
  }
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
