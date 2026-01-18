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
    let session = findOrCreateSession(room.name);

    let player = session.getPlayerById(playerId);
    if (player != null){
      joinRoom(socket, session, room.name, player);
    } else if (!session.isFull()) {
      player = session.addPlayer(playerId);
      joinRoom(socket, session, room.name, player);
    }
  });

  socket.on("makeMove", event => {
    const { room, player, position } = event;

    try {
      const session = sessionByRoom.get(room.name);
      if (session == null) {
        throw new Error("Sessão não existe");
      }

      session.makeMove(player.id, position);
      io.to(room.name).emit("update", session.getGameState());
    } catch (err: any) {
      socket.emit("error", {
        message: err.message
      });

      console.error(err);
    }
  });

  socket.on("disconnect", event => console.log("E morreu"));
});

function findOrCreateSession(roomId: string): Session {
  let session = sessionByRoom.get(roomId);
  if (session == null) {
    session = new Session();
    sessionByRoom.set(roomId, session);
  }

  return session;
}

function joinRoom(socket: Socket, session: Session, roomId: string, player: Player) {
  socket.join(roomId);
  socket.emit("joined", player);
  socket.emit("update", session.getGameState());
  console.log(`O jogador [${player.id}] entrou na sala ${roomId} como ${player.symbol}`);
}

io.listen(3000);