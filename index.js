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
let board1 = [];
let board2 = [];
const ID_BOAT = "bs";
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  socket.on("load player", (user) => {
    console, log(user);
    if (player1 == "") {
      player1 = user;
      io.emit("load player", player1);
    } else if (player2 == "") {
      player2 = user;
      io.emit("load player", user);
    } else {
      console.log(`Jugador 1 ${player1} - Jugador 2 ${player2}`);
    }
  });
  //VOLVER A ANALIZAR, EN BASE A LOS CAMBIOS REALIZADOS HTML Y NOMBRADO DE COMUNICACION SOCKET.
  socket.on("start battle", (user, boardPlayer) => {
    if (player1 == "") {
      player1 = user;
      board1 = boardPlayer;
      console.log("tablero 1");
      console.log(board1);
    } else if (player2 == "") {
      player2 = user;
      console.log("tablero 2");
      board2 = boardPlayer;
      console.log(board2);
    } else {
      console.log(
        "emitir mensaje que no puede jugar por el momento y emitir el juego"
      );
    }
  });
  //ELIMINAR BUTTON POR QUE LA IDEA ES MANEJAR FILA Y COLUMNA CON UN 1 AL INICIO.
  socket.on("game", (user, row, column, BUTTON) => {
    if (player1 == user) {
      let ponit = 1;
      if (board2[row][column] == ID_BOAT) {
        io.emit("response attack", player1, ponit, row, column, BUTTON);
      } else {
        ponit = 0;
        io.emit("response attack", player1, ponit, row, column);
      }
    } else if (player2 == user) {
      let ponit = 1;
      if (board1[row][column] == ID_BOAT) {
        io.emit("response attack", player2, ponit, row, column);
      } else {
        ponit = 0;
        io.emit("response attack", player2, ponit, row, column);
      }
    }
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
