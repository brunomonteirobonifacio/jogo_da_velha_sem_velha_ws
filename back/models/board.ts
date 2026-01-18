export class Board {
  private static readonly EMPTY_POSITION = '';
  
  private readonly positions: Array<Array<string>> = [
    [Board.EMPTY_POSITION, Board.EMPTY_POSITION, Board.EMPTY_POSITION],
    [Board.EMPTY_POSITION, Board.EMPTY_POSITION, Board.EMPTY_POSITION],
    [Board.EMPTY_POSITION, Board.EMPTY_POSITION, Board.EMPTY_POSITION]
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
    return this.get(position) == Board.EMPTY_POSITION;
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
    this.positions[row][column] = Board.EMPTY_POSITION;
  }

  public countAvailablePositions(): number {
    let availablePositions = 0;
    
    this.positions.forEach(line => {
      const availablePositionsLine = line.filter(pos => pos === Board.EMPTY_POSITION).length;
      availablePositions += availablePositionsLine;
    });

    return availablePositions;
  }

  public getPositionsMatrix(): Array<Array<string>> {
    return this.positions;
  }
}