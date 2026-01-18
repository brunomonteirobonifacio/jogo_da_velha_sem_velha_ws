const states = {
  STARTED: 'STARTED',
  FINISHED: 'FINISHED'
}

function createGame(board) {
  const players = {
    X: 'X',
    O: 'O'
  }

  let currentPlayer = players.X;
  let winner = null;
  let state = states.STARTED;
  const latestMoves = [];

  function makeMove(position) {
    checkValidGameState();

    board.put(position, currentPlayer);

    preventDraw(position);

    if (checkVictory()) {
      state = states.FINISHED;
      winner = currentPlayer;
      return;
    }

    currentPlayer = getNextPlayer(currentPlayer);
  }

  function checkValidGameState() {
    if (state == states.FINISHED) {
      throw new Error('O jogo já terminou lek');
    }
  }

  function checkVictory() {
    return (board.isPositionFilled(1) && board.get(1) == board.get(2) && board.get(2) == board.get(3))
        || (board.isPositionFilled(4) && board.get(4) == board.get(5) && board.get(5) == board.get(6))
        || (board.isPositionFilled(7) && board.get(7) == board.get(8) && board.get(8) == board.get(9))
        || (board.isPositionFilled(1) && board.get(1) == board.get(4) && board.get(4) == board.get(7))
        || (board.isPositionFilled(2) && board.get(2) == board.get(5) && board.get(5) == board.get(8))
        || (board.isPositionFilled(3) && board.get(3) == board.get(6) && board.get(6) == board.get(9))
        || (board.isPositionFilled(1) && board.get(1) == board.get(5) && board.get(5) == board.get(9))
        || (board.isPositionFilled(3) && board.get(3) == board.get(5) && board.get(5) == board.get(7))
  }

  function preventDraw(position) {
    latestMoves.push(position);
    if (isDrawAfterThreeMoves()) {
      discardOldestMove();
    }
  }

  function isDrawAfterThreeMoves() {
    return board.countAvailablePositions() < 3;
  }

  function discardOldestMove() {
    const positionToRemove = latestMoves.shift();
    try {
      board.remove(positionToRemove);
    } catch (err) {
      // put it back in the queue if it could not be removed
      latestMoves.unshift(positionToRemove);
      console.error(err);
    }
  }

  function getNextPlayer(currentPlayer) {
    return currentPlayer == players.X 
        ? players.O
        : players.X;
  }

  function getWinner() {
    return winner;
  }

  function getState() {
    return state;
  }

  return {
    makeMove,
    getWinner,
    getState
  }
}

function createBoard() {
  const EMPTY_POSITION = '';

  const positions = [
    [EMPTY_POSITION, EMPTY_POSITION, EMPTY_POSITION],
    [EMPTY_POSITION, EMPTY_POSITION, EMPTY_POSITION],
    [EMPTY_POSITION, EMPTY_POSITION, EMPTY_POSITION]
  ]

  function get(position) {
    if (!isValidPosition(position)) {
      throw new Error('Escolhe uma posição que existe burrão');
    }

    const { row, column } = toCoordinates(position);
    return positions[row][column];
  }

  function isValidPosition(position) {
    return position >= 1 && position <= 9;
  }

  function toCoordinates(position) {
    const rowIndex = Math.floor((position - 1) / 3);
    const colIndex = Math.floor((position - 1) % 3);

    return {
      row: rowIndex,
      column: colIndex
    }
  }

  function put(position, symbol) {
    validateMove(position);

    const { row, column } = toCoordinates(position);
    positions[row][column] = symbol;
  }

  function validateMove(position) {
    if (!isValidPosition(position)) {
      throw new Error('Vai estacionar no céu, bestalhão?')
    }

    if (isPositionFilled(position)) {
      throw new Error('Solidão, ela já tá com outro, amigo')
    }
  }

  function isPositionAvailable(position) {
    return get(position) == EMPTY_POSITION;
  }

  function isPositionFilled(position) {
    return !isPositionAvailable(position);
  }

  function remove(position) {
    if (!isValidPosition(position)) {
      throw new Error('Vai estacionar no céu, bestalhão?')
    }

    if (isPositionAvailable(position)) {
      throw new Error('Nem tem nada aqui seu maluco')
    }

    const { row, column } = toCoordinates(position);
    positions[row][column] = EMPTY_POSITION;
  }

  function countAvailablePositions() {
    let availablePositions = 0;
    positions.forEach(line => {
      const availablePositionsLine = line.filter(pos => pos === EMPTY_POSITION).length;
      availablePositions += availablePositionsLine;
    })

    return availablePositions;
  }

  return {
    get,
    put,
    remove,
    countAvailablePositions,
    isPositionFilled
  }
}

// run();
const board = createBoard();
const game = createGame(board); // should board be created inside game?
function makeMove(position = 0) {
  try {
    const positionInt = parseInt(position, 10)
    game.makeMove(positionInt);
    updateBoard(board);

    if (game.getState() === states.FINISHED) {
      updateBoard(board);
      setTimeout(() => alert(`Jogador ${game.getWinner()} venceu!`));
      history.go(0);
    }
  } catch (err) {
    if (err.name == 'Error') {
      alert(err.message);
    }

    console.error(err);
  }
}

function updateBoard(board) {
  document.querySelectorAll('.pos').forEach(positionContainer => {
    const button = positionContainer.children[0]
    button.innerText = board.get(parseInt(button.id, 10))
  })
}