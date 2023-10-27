const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

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
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateRandomId = () => {
  return Math.floor(Math.random() * 10000);
};

app.get("/api/persons/", (req, res) => {
  res.json(persons);
});

app.get("/info/", (req, res) => {
  res.send(
    `<div>
      <p>Phone book has info for ${persons.length} people</p>
      <p>${new Date().toString()}</p>  
      </div>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) {
    return res.status(404).end();
  }

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "incomplete phonebook entry",
    });
  }

  const duplicatePerson = persons.find(
    (person) => person.name.toLowerCase() === body.name.toLowerCase()
  );

  if (duplicatePerson) {
    return res.status(400).json({
      error: "name already in phonebook",
    });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateRandomId(),
  };

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
