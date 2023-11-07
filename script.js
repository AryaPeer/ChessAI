var board = null
var $board = $('#myBoard')
var game = new Chess()
var squareToHighlight = null
var squareClass = 'square-55d63'
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

function removeHighlights(color) {
  $board.find('.' + squareClass)
    .removeClass('highlight-' + color)
}

function removeGreySquares() {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare(square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}


function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for White
  if (game.turn() === 'w' && piece.search(/^b/) !== -1) {
    return false
  }
}


function getBestMove(game) {
  var newGameMoves = game.ugly_moves();
  var bestMove = null;
  //use any negative large number
  var bestValue = -9999;

  for (var i = 0; i < newGameMoves.length; i++) {
      var newGameMove = newGameMoves[i];
      game.ugly_move(newGameMove);

      //take the negative as AI plays as black
      var boardValue = -evaluateBoard(game.board())
      game.undo();
      if (boardValue > bestValue) {
          bestValue = boardValue;
          bestMove = newGameMove
      }
  }

  return bestMove;
};

function makeBestMove() {
  var bestMove = getBestMove(game);
  game.ugly_move(bestMove);
  removeHighlights('black')
  $board.find('.square-' + move.from).addClass('highlight-black')
  squareToHighlight = move.to
  board.position(game.fen())
  updateStatus();
};

function onDrop(source, target) {

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  removeHighlights('white')
  $board.find('.square-' + source).addClass('highlight-white')
  $board.find('.square-' + target).addClass('highlight-white')

  // make random legal move for black
  updateStatus()
  window.setTimeout(makeBestMove, 250)
}

function onMoveEnd() {
  $board.find('.square-' + squareToHighlight)
    .addClass('highlight-black')
}

function onMouseoverSquare(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0 || piece.search(/^b/) !== -1) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

function onMouseoutSquare(square, piece) {
  removeGreySquares()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen())
}

function updateStatus() {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onMoveEnd: onMoveEnd,
  onSnapEnd: onSnapEnd
}

board = Chessboard('myBoard', config)

updateStatus()