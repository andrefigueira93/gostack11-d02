const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Middlewares
function validateUuid(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({
      error: "Invalid ID"
    })
  }

  return next();
}

// Accessors
app.use('/repositories/:id', validateUuid);

// Repository Routes
app.get("/repositories", (request, response) => {
  
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  }
  
  repositories.push(repository);

  return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({
      error: "Repository not found 😕"
    })
  }
  const repo = repositories[repoIndex];
  const repository = {
    id,
    url,
    title,
    techs,
    likes: repo.likes
  }

  repositories[repoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({
      error: "Repository not found 😕"
    })
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({
      error: "Repository not found 😕"
    })
  }

  repositories[repoIndex].likes += 1;
  
  return response.json(repositories[repoIndex])

});

module.exports = app;
