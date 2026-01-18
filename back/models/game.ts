import { Board } from "./board";

enum Status {
  STARTED,
  FINISHED
}

const players = {
  X: "X",
  O: "O"
}

export class Game {
  constructor(
    private readonly board: any
  ) {}

  currentPlayer: string = players.X;
  winner: string | null = null;
  status = Status.STARTED;
  latestMoves: Array<number> = [];

  public makeMove(position: number): void {
    this.checkValidGameState();

    this.board.put(position, this.currentPlayer);

    this.preventDraw(position);

    if (this.checkVictory()) {
      this.status = Status.FINISHED;
      this.winner = this.currentPlayer;
      return;
    }

    this.currentPlayer = this.getNextPlayer();
  }

  private checkValidGameState(): void {
    if (this.status === Status.FINISHED) {
      throw new Error('O jogo já terminou lek');
    }
  }

  private checkVictory(): boolean {
    return (this.board.isPositionFilled(1) && this.board.get(1) == this.board.get(2) && this.board.get(2) == this.board.get(3))
        || (this.board.isPositionFilled(4) && this.board.get(4) == this.board.get(5) && this.board.get(5) == this.board.get(6))
        || (this.board.isPositionFilled(7) && this.board.get(7) == this.board.get(8) && this.board.get(8) == this.board.get(9))
        || (this.board.isPositionFilled(1) && this.board.get(1) == this.board.get(4) && this.board.get(4) == this.board.get(7))
        || (this.board.isPositionFilled(2) && this.board.get(2) == this.board.get(5) && this.board.get(5) == this.board.get(8))
        || (this.board.isPositionFilled(3) && this.board.get(3) == this.board.get(6) && this.board.get(6) == this.board.get(9))
        || (this.board.isPositionFilled(1) && this.board.get(1) == this.board.get(5) && this.board.get(5) == this.board.get(9))
        || (this.board.isPositionFilled(3) && this.board.get(3) == this.board.get(5) && this.board.get(5) == this.board.get(7))
  }

  private preventDraw(position: number): void {
    this.latestMoves.push(position);
    if (this.isDrawAfterThreeMoves()) {
      this.discardOldestMove();
    }
  }

  private isDrawAfterThreeMoves(): boolean {
    return this.board.countAvailablePositions() < 3;
  }

  private discardOldestMove(): void {
    const positionToRemove = this.latestMoves.shift();
    if (positionToRemove == null) {
      return;
    }
    
    try {
      this.board.remove(positionToRemove);
    } catch (err) {
      // put it back in the queue if it could not be removed
      this.latestMoves.unshift(positionToRemove);
      console.error(err);
    }
  }

  private getNextPlayer(): string {
    return this.currentPlayer == players.X 
        ? players.O
        : players.X;
  }

  public getCurrentPlayer(): string {
    return this.currentPlayer;
  }

  public getWinner(): string | null {
    return this.winner;
  }

  public getStatusDescription(): string {
    return this.status === Status.STARTED ? "STARTED" : "FINISHED";
  }
}

