import { Player } from "../types/player";
import { Board } from "./board";
import { Game } from "./game";

export class Session {
  private readonly playersById: Map<string, Player> = new Map();
  private readonly game: Game;
  private readonly board: Board;

  constructor() {
    this.board = new Board();
    this.game = new Game(this.board);
  }

  public isFull(): boolean {
    return this.playersById.size >= 2;
  }

  public addPlayer(playerId: string): Player {
    const symbol = this.playersById.size == 0 ? "X" : "O";
    const player: Player = { id: playerId, symbol }
    
    this.playersById.set(playerId, player);
    return player;
  }

  public makeMove(playerId: string, position: number) {
    // TODO: verificar se o jogador é o mesmo

    const player = this.playersById.get(playerId);
    if (player == null) {
      throw new Error("porra burrão do caralho");
    }
    
    if (player.symbol !== this.game.getCurrentPlayer()) {
      throw new Error("\"Quer furar fila vai no SUS\" -LAVAN, Jhoni")
    }

    this.game.makeMove(position);

    console.log(this.board.countAvailablePositions());
  }

  public getPlayerById(playerId: string): Player | undefined {
    return this.playersById.get(playerId);
  }

  public hasPlayer(playerId: string) {
    return this.playersById.has(playerId);
  }

  public getGameState() {
    return {
      board: this.board.getPositionsMatrix(),
      status: this.game.getStatusDescription(),
      currentPlayer: this.game.getCurrentPlayer(),
      winner: this.game.getWinner()
    };
  }
}