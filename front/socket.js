import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

let playerId = localStorage.getItem("playerId");
let player;
const roomId = "sala1";

const socket = io("http://localhost:3000", {
  query: {
    playerId: playerId ?? ""
  }
})

socket.on("connect", () => {
  socket.emit("joinRoom", { name: roomId });

  socket.on("joined", playerJoined => {
    player = playerJoined;
    playerId = playerJoined.id

    setPlayerSymbolDisplay();
  });

  socket.on("update", state => {
    updateBoard(state.board);
    updateCurrentPlayerSymbolDisplay(state.currentPlayer);
  })
});

function sendMakeMoveRequest(position) {
  console.log(playerId)
  socket.emit("makeMove", { room: { name: roomId }, position, player: { id: playerId } })
}

function init() {
  document.querySelectorAll(".pos").forEach(positionContainer => {
    const button = positionContainer.children[0];
    button.addEventListener("click", () => sendMakeMoveRequest(button.id));
  })
}

function updateBoard(boardMatrix) {
  document.querySelectorAll('.pos').forEach(positionContainer => {
    const button = positionContainer.children[0];
    const position = button.id;
    
    const rowIndex = Math.floor((position - 1) / 3);
    const colIndex = Math.floor((position - 1) % 3);

    button.innerText = boardMatrix[rowIndex][colIndex];
  })
}

function setPlayerSymbolDisplay() {
  document.getElementById("playerSymbol").innerText = player.symbol;
}

function updateCurrentPlayerSymbolDisplay(currentPlayerSymbol) {
  document.getElementById("currentPlayer").innerText = currentPlayerSymbol;
}

function checkVictory(state) {
  
}

init();