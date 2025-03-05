const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json()); //for parsing json requests
app.use(express.static("dist"));
/* app.use(cors()); */
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.req.body,
    ].join(" ");
  })
);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body ")
);

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

/* const requestLogger = (request, response, next) => {
  console.log("Method", request.method);
  console.log("Path", request.path);
  console.log("Body", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};
app.use(unknownEndpoint); */

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

let computers = [
  { id: "1", name: "Sony", isBroken: false },
  { id: "2", name: "Playstation", isBroken: false },
  { id: "3", name: "Not a computer", isBroken: true },
];

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => Number(note.id))) : 0;

  return String(maxId + 1);
};

const generateId2 = (data) => {
  const maxId =
    notes.length > 0 ? Math.max(...data.map((note) => Number(note.id))) : 0;

  return String(maxId + 1);
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.send(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };

  notes = notes.concat(note);
  console.log(note);
  response.json(note);
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

//get all notes
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

//get note by id
app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => note.id === id);
  if (!note) {
    response.status(404).end();
    response.send("<h1>Data does not exist</h1>");
  } else {
    response.json(note);
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.put("/api/notes/:id", (req, res) => {
  const body = req.body;
  console.log(body);
  body.important = !body.important;
  res.json(body);
});

//computer api

app.post("/api/computers", (request, response) => {
  const maxId =
    computers.length > 0
      ? Math.max(...computers.map((computer) => Number(computer.id)))
      : 0;

  const computer = request.body;
  computer.id = String(maxId + 1);

  computers = computers.concat(computer);
  response.json(computer);
});

app.get("/api/computers", (request, response) => {
  response.json(computers);
});

app.get("/api/computers/:id", (request, response) => {
  const id = request.params.id;
  const computer = computers.find((a) => a.id === id);

  if (computer) {
    response.json(computer);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/computers/:id", (request, response) => {
  const id = request.params.id;
  computers = computers.filter((computer) => computer.id !== id);
  response.status(204).end();
});

//persons api

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/info", (request, response) => {
  response.send(
    `Phonebooks has info for ${persons.length} people <br/> <br/> ${Date()}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((a) => a.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  persons = persons.filter((a) => a.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  if (person.name && person.number) {
    const isPersonExist = persons.find((a) => a.name === person.name);
    if (!isPersonExist) {
      person.id = Math.floor(Math.random() * 1000000).toString();

      persons = persons.concat(person);
      response.json(person);
    } else {
      response.status(400).json({ error: "name must be unique" });
    }
  } else {
    response.status(400).json({ error: "name or number is empty." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
