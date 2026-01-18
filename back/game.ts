enum State {
  STARTED,
  FINISHED
}

const players = {
  X: "X",
  O: "O"
}

class Game {
  constructor(
    private readonly board: any
  ) {}

  currentPlayer: string = players.X;
  winner: string | null = null;
  state = State.STARTED;
  latestMoves: Array<number> = [];

  public makeMove(position: number): void {
    this.checkValidGameState();

    this.board.put(position, this.currentPlayer);

    this.preventDraw(position);

    if (this.checkVictory()) {
      this.state = State.FINISHED;
      this.winner = this.currentPlayer;
      return;
    }

    this.currentPlayer = this.getNextPlayer();
  }

  private checkValidGameState(): void {
    if (this.state === State.FINISHED) {
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

  public getState(): State {
    return this.state;
  }
}

class Board {
  private readonly EMPTY_POSITION = '';

  constructor() {

  }
  
  private readonly positions: Array<Array<string>> = [
    [this.EMPTY_POSITION, this.EMPTY_POSITION, this.EMPTY_POSITION],
    [this.EMPTY_POSITION, this.EMPTY_POSITION, this.EMPTY_POSITION],
    [this.EMPTY_POSITION, this.EMPTY_POSITION, this.EMPTY_POSITION]
  ]

  public get(position: number): string {
    if (!this.isValidPosition(position)) {
      throw new Error('Escolhe uma posição que existe burrão');
    }

    const { row, column } = this.toCoordinates(position);
    return this.positions[row][column];
  }

  private isValidPosition(position: number) {
    return position >= 1 && position <= 9;
  }

  private toCoordinates(position: number): { row: number, column: number } {
    const rowIndex = Math.floor((position - 1) / 3);
    const colIndex = Math.floor((position - 1) % 3);

    return {
      row: rowIndex,
      column: colIndex
    }
  }

  public put(position: number, symbol: string): void {
    this.validateMove(position);

    const { row, column } = this.toCoordinates(position);
    this.positions[row][column] = symbol;
  }

  validateMove(position: number): void {
    if (!this.isValidPosition(position)) {
      throw new Error('Vai estacionar no céu, bestalhão?')
    }

    if (this.isPositionFilled(position)) {
      throw new Error('Solidão, ela já tá com outro, amigo')
    }
  }

  public isPositionAvailable(position: number): boolean {
    return this.get(position) == this.EMPTY_POSITION;
  }

  public isPositionFilled(position: number): boolean {
    return !this.isPositionAvailable(position);
  }

  public remove(position: number): void {
    if (!this.isValidPosition(position)) {
      throw new Error('Vai estacionar no céu, bestalhão?')
    }

    if (this.isPositionAvailable(position)) {
      throw new Error('Nem tem nada aqui seu maluco')
    }

    const { row, column } = this.toCoordinates(position);
    this.positions[row][column] = this.EMPTY_POSITION;
  }

  public countAvailablePositions(): number {
    let availablePositions = 0;
    this.positions.forEach(line => {
      const availablePositionsLine = line.filter(pos => pos === this.EMPTY_POSITION).length;
      availablePositions += availablePositionsLine;
    })

    return availablePositions;
  }
}

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
}

export type Player = {
  id: string,
  symbol: string
}