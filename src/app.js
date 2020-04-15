const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function getIndex(request, response, next) {
  const { id } = request.params;

  const index = repositories.findIndex((r) => r.id === id);

  if (index >= 0) {
    request.index = index;
  } else {
    return response.status(400).json({ message: "repository not found" });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", getIndex, (request, response) => {
  const { id } = request.params;
  const { index } = request;
  const { title, url, techs } = request.body;

  repositories[index] = { ...repositories[index], title, url, techs };
  return response.json(repositories[index]);
});

app.delete("/repositories/:id", getIndex, (request, response) => {
  const { id } = request.params;
  const { index } = request;

  repositories.splice(index, 1);
  return response.status(204).json({ message: "repository deleted" });
});

app.post("/repositories/:id/like", getIndex, (request, response) => {
  const { id } = request.params;
  const { index } = request;

  let { likes } = repositories[index];
  repositories[index] = { ...repositories[index], likes: likes + 1 };
  return response.json(repositories[index]);
});

module.exports = app;
