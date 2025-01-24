/*Chessboard and Game variables*/
let board, game = new Chess();
let $board = $('#myBoard')
let $status = $('#status')
let $fen = $('#fen')
const whiteSquareGrey = '#a9a9a9'
const blackSquareGrey = '#696969'
const rstButton = document.getElementById('rstButton');
const undoButton = document.getElementById('undoButton');
const submitNameButton = document.getElementById('submit-name');
const namePrompt = document.getElementById('name-prompt');
const winnerNameInput = document.getElementById('winner-name');
const minimaxWinnersList = document.getElementById('minimax-winners-list');
const stockfishWinnersList = document.getElementById('stockfish-winners-list');
let minimaxWinners = [];
let stockfishWinners = [];
/*End of Chessboard and Game variables*/

/* Board Evalulation */
function evaluateBoard(board) {
  let totalEvaluation = 0;
  for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
          totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
      }
  }
  return totalEvaluation;
};

function reverseArray(array) {
  return array.slice().reverse();
};

const pawnEvalWhite =
  [
      [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
      [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
      [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
      [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
      [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
      [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
      [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
      [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
  ];

const pawnEvalBlack = reverseArray(pawnEvalWhite);

const knightEval =
  [
      [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
      [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
      [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
      [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
      [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
      [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
      [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
      [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
  ];

const bishopEvalWhite = [
  [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
  [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
  [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
  [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
  [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
  [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
  [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

const bishopEvalBlack = reverseArray(bishopEvalWhite);

const rookEvalWhite = [
  [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
  [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

const rookEvalBlack = reverseArray(rookEvalWhite);

const evalQueen =
  [
  [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
  [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
  [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
  [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
  [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
  [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
  [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

const kingEvalWhite = [

  [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
  [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

const kingEvalBlack = reverseArray(kingEvalWhite);
/* End of Board Evalulation */

/* Piece Evalulation */
function getPieceValue (piece, x, y) {
  if (piece === null) {
      return 0;
  }
  function getAbsoluteValue (piece, isWhite, x ,y) {
      if (piece.type === 'p') {
          return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
      } else if (piece.type === 'r') {
          return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
      } else if (piece.type === 'n') {
          return 30 + knightEval[y][x];
      } else if (piece.type === 'b') {
          return 30 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
      } else if (piece.type === 'q') {
          return 90 + evalQueen[y][x];
      } else if (piece.type === 'k') {
          return 900 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
      }
      throw "Unknown piece type: " + piece.type;
  };

  let absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
  return piece.color === 'w' ? absoluteValue : -absoluteValue;
};
/* End of Piece Evalulation */

/*Movement Calculations Start here*/
function minimaxRoot(depth, game, isMaximisingPlayer) {

  let newGameMoves = game.ugly_moves();
  let bestMove = -9999;
  let bestMoveFound;

  for(let i = 0; i < newGameMoves.length; i++) {
      let newGameMove = newGameMoves[i]
      game.ugly_move(newGameMove);
      let value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
      game.undo();
      if(value >= bestMove) {
          bestMove = value;
          bestMoveFound = newGameMove;
      }
  }
  return bestMoveFound;
};

function minimax(depth, game, alpha, beta, isMaximisingPlayer) {
  if (depth === 0) {
      return -evaluateBoard(game.board());
  }

  let newGameMoves = game.ugly_moves();

  if (isMaximisingPlayer) {
      let bestMove = -9999;
      for (let i = 0; i < newGameMoves.length; i++) {
          game.ugly_move(newGameMoves[i]);
          bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
          game.undo();
          alpha = Math.max(alpha, bestMove);
          if (beta <= alpha) {
              return bestMove;
          }
      }
      return bestMove;
  } else {
      let bestMove = 9999;
      for (var i = 0; i < newGameMoves.length; i++) {
          game.ugly_move(newGameMoves[i]);
          bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
          game.undo();
          beta = Math.min(beta, bestMove);
          if (beta <= alpha) {
              return bestMove;
          }
      }
      return bestMove;
  }
};
/*movement calculations end here*/

/*Get and make best move based on min max algorithm*/
function getBestMove (game) {
  updateStatus();
  const depth = 3;
  let bestMove = minimaxRoot(depth, game, true);
  return bestMove;
};

async function makeBestMove() {
  if (game.turn() === 'b') {
    let possibleMoves = game.moves({ verbose: true });
    
    // Game over
    if (possibleMoves.length === 0) return;

    let bestMove;

    // Get the selected difficulty from the dropdown
    const difficulty = document.getElementById('difficulty').value;

    if (difficulty === '1') {
      // Use minimax algorithm for difficulty 1
      console.log("DECISION TREE MOVING")
      bestMove = getBestMove(game);
      game.ugly_move(bestMove);
    } else if (difficulty === '2') {
      // Use Stockfish API for difficulty 2
      console.log("STOCKFISH IS MOVING")
      $status.html("Waiting For Stockfish API Response")

      bestMove = await getBestMoveFromAPI(game.fen());
      if (bestMove === null) {
        $status.html("Error: Unable to fetch best move from Stockfish API");
        return;
      }
      const bestMoveString = bestMove.split(' ')[1];
      const from = bestMoveString.slice(0, 2);  // 'f6'
      const to = bestMoveString.slice(2, 4);    // 'g8'
      const promotion = bestMoveString[4];      // Optional promotion character
      const move = { from, to };
      if (promotion) move.promotion = promotion; // Handle promotion if needed
      game.move(move);  // Perform the move in chess.js
    }

    // Update the board to the new position
    board.position(game.fen());
    updateStatus();
  }
}
/*End of get and make best move*/


/*Chessboard and Game setup*/
function greySquare(square) {
  let $square = $('#myBoard .square-' + square)

  let background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function removeGreySquares() {
  $('#myBoard .square-55d63').css('background', '')
}

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false

  if (game.turn() === 'w' && piece.search(/^b/) !== -1) {
    return false
  }

  if (game.turn() === 'b' && piece.search(/^b/) !== -1) {
    return false
  }
}

function onDrop(source, target) {
  removeGreySquares()

  let move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  })

  if (move === null) return 'snapback'

  updateStatus()
  window.setTimeout(makeBestMove, 250)
}

function onMouseoverSquare(square, piece) {
  let moves = game.moves({
    square: square,
    verbose: true
  })

  if (moves.length === 0 || piece.search(/^b/) !== -1) return

  greySquare(square)

  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

function onMouseoutSquare(square, piece) {
  removeGreySquares()
}

function onSnapEnd() {
  board.position(game.fen())
}

rstButton.addEventListener('click', function() {
  game.reset();
  board.position(game.fen());
  updateStatus();

});

undoButton.addEventListener('click', function() {
  if (game.turn() === 'w') {
    game.undo();
    game.undo();
  } else if (game.turn() === 'b') {
    game.undo();
  }
  board.position(game.fen());
  updateStatus();
});

submitNameButton.addEventListener('click', function() {
  const name = winnerNameInput.value.trim();
  if (name && !isOffensive(name)) {
    const difficulty = document.getElementById('difficulty').value;
    if (difficulty === '1') {
      minimaxWinners.push(name);
    } else if (difficulty === '2') {
      stockfishWinners.push(name);
    }
    updateWinnersList();
    namePrompt.classList.add('hidden');
  }
});

function updateStatus() {
  let status = ''

  let moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
    if (moveColor === 'Black') {
      namePrompt.classList.remove('hidden');
    }
  }

  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
}

function getBestMoveFromAPI(fenString) {
  const url = `https://stockfish.online/api/s/v2.php?fen=${fenString}&depth=7`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data.bestmove;
    })
    .catch(error => {
      console.error('Error fetching best move from API:', error);
      $status.html("ERROR WITH STOCKFISH API RESPONSE")
      return null;
    });
}

function isOffensive(name) {
  const offensiveWords = ['badword1', 'badword2', 'badword3']; // Add more offensive words as needed
  const lowerCaseName = name.toLowerCase();
  return offensiveWords.some(word => lowerCaseName.includes(word));
}

function updateWinnersList() {
  minimaxWinnersList.innerHTML = '';
  stockfishWinnersList.innerHTML = '';
  minimaxWinners.forEach(winner => {
    const li = document.createElement('li');
    li.textContent = winner;
    minimaxWinnersList.appendChild(li);
  });
  stockfishWinners.forEach(winner => {
    const li = document.createElement('li');
    li.textContent = winner;
    stockfishWinnersList.appendChild(li);
  });
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
}

board = Chessboard('myBoard', config)

updateStatus()

window.addEventListener('resize', function() {
  board.resize();
});
/*End of Chessboard and Game setup*/
