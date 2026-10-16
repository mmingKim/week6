"use strict";

const socketIO = require("socket.io");
const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(port, () => {
  console.log("Listening on port: " + port);
});

const io = socketIO(server);

const roomState = {
  window: { x: 2, y: 60 },
  pictureOne: { x: 15, y: 62 },
  pictureTwo: { x: 25, y: 62 },
  rug: { x: 36, y: 62 },
  table: { x: 2, y: 80 },
  lamp: { x: 23, y: 76 },
  plant: { x: 32, y: 80 },
  chair: { x: 39, y: 79 },
  chairTwo: { x: 49, y: 79 },
  cat: { x: 63, y: 80 },
  dog: { x: 78, y: 80 }
};

io.on("connection", (socket) => {
  console.log("Participant connected: " + socket.id);

  socket.emit("room state", roomState);

  socket.on("move furniture", (data) => {
    if (!roomState[data.id]) {
      return;
    }

    if (typeof data.x !== "number" || typeof data.y !== "number") {
      return;
    }

    roomState[data.id] = {
      x: Math.max(0, Math.min(data.x, 100)),
      y: Math.max(0, Math.min(data.y, 100))
    };

    io.emit("room state", roomState);
  });

  socket.on("disconnect", () => {
    console.log("Participant disconnected: " + socket.id);
  });
});
