import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

let playerId = localStorage.getItem("playerId");
const roomId = "sala1";

const socket = io("http://localhost:3000", {
  query: {
    playerId: playerId ?? ""
  }
})

socket.on("connect", () => {
  socket.emit("joinRoom", { name: roomId });

  socket.on("joined", player => {
    localStorage.setItem("playerId", player.id);
    playerId = player.id
    console.log("entramo porra", player);
  });

});

function sendMakeMoveRequest(position) {
  console.log(playerId)
  socket.emit("makeMove", { room: roomId, position, player: { id: playerId } })
}

function init() {
  document.querySelectorAll(".pos").forEach(positionContainer => {
    const button = positionContainer.children[0];
    button.addEventListener("click", () => sendMakeMoveRequest(button.id));
  })
}

init();