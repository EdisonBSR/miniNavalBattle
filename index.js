import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { emit } from "node:process";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  let player1 = "";
  let player2 = "";
  let board1 = [];
  let board2 = [];
  const ID_BOAT = "bs";
  // emit.io("game", player1, player2);
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
  socket.on("game", (user, row, column) => {
    if (player1 == user) {
      let ponit = 1;
      if (board2[row][column] == ID_BOAT) {
        io.emit("response attack", player1, ponit, row, column);
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
