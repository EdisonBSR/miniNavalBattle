import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { log } from "node:console";

const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));
let player1 = "";
let player2 = "";
let boardPlayer1 = [];
let boardPlayer2 = [];
let playerAttack = "";
const ID_BOAT = "bs";
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  socket.on("load player", (user) => {
    console, log(user);
    if (player1 == "") {
      player1 = user;
      playerAttack = player1;
      io.emit("load player", player1);
    } else if (player2 == "") {
      player2 = user;
      io.emit("load player", player2);
    } else {
      console.log(`Jugador 1 ${player1} - Jugador 2 ${player2}`);
      //AVISO YA EXISTEN LOS 2 JUGADORES...S
    }
  });
  socket.on("start battle", (user, boardPlayer) => {
    if (player1 == user) {
      console.log("tablero 1");
      boardPlayer1 = boardPlayer;
      console.log(boardPlayer1);
    } else if (player2 == user) {
      console.log("tablero 2");
      boardPlayer2 = boardPlayer;
      console.log(boardPlayer2);
    }
  });
  socket.on("attack", (user, point, row, column) => {
    if (user == playerAttack) {
      if (player1 == user) {
        if (boardPlayer2[row][column] == ID_BOAT) {
          point = 1;
          playerAttack = player2;
          io.emit("attack", player1, point, row, column);
        } else {
          point = 0;
          playerAttack = player2;
          io.emit("attack", player1, point, row, column);
        }
      } else if (player2 == user) {
        if (boardPlayer1[row][column] == ID_BOAT) {
          point = 1;
          playerAttack = player1;
          io.emit("attack", player2, point, row, column);
        } else {
          point = 0;
          playerAttack = player1;
          io.emit("attack", player2, point, row, column);
        }
      }
    }
  });
  socket.on("winner", (user) => {
    player1 = "";
    player2 = "";
    boardPlayer1 = [];
    boardPlayer2 = [];
    playerAttack = "";
    socket.broadcast.emit("winner", user);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
