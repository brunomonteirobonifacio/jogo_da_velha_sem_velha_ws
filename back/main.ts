import { Server, Socket } from "socket.io";
import { randomUUID } from "node:crypto"
import { Player, Session } from "./game";

const io = new Server({
  cors: {
    origin: "*"
  }
})

const sessionByRoom: Map<string, Session> = new Map();

io.on("connection", socket => {
  let playerId = socket.handshake.query.playerId as string || randomUUID()

  socket.on("joinRoom", room => {
    let session = sessionByRoom.get(room.name);
    if (session == null) {
      session = new Session();
      sessionByRoom.set(room.name, session);
    }

    let player = session.getPlayerById(playerId);
    if (player != null){
      joinRoom(socket, room.name, player);
    } else if (!session.isFull()) {
      player = session.addPlayer(playerId);
      joinRoom(socket, room.name, player);
    }
  });

  socket.on("makeMove", event => {
    console.log(event);
    const session = sessionByRoom.get(event.room)
    if (session == null) {
      throw new Error("vai toma no cu");
    }

    session.makeMove(event.player.id, event.position)
  })

  socket.on("disconnect", event => console.log("E morreu"));
});

function joinRoom(socket: Socket, roomId: string, player: Player) {
  socket.join(roomId);
  socket.emit("joined", player);
  console.log(`O jogador [${player.id}] entrou na sala ${roomId} como ${player.symbol}`);
}

io.listen(3000);