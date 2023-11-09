# Chess AI
Welcome to Chess AI, a user-friendly web-based chess application that enables you to test your chess skills against a computer opponent. This repository contains the entire codebase for the game and the computer's logic. If you're ready for a game, simply head over to our [GitHub Pages site](https://aryapeer.github.io/ChessAI/) and enjoy playing against my bot. Have fun testing your chess skills!

## Features

- **Move Generation and Board Visualization:** In Chess AI, we harness the power of the chess.js library for move generation and utilize chessboard.js to provide a visual representation of the chessboard. These libraries work in tandem to enforce the rules of chess, enabling us to compute all valid moves for a given board configuration.
- **Position Evaluation:** Chess AI assesses the game board by applying piece-specific weightings and factoring in the spatial distribution of pieces to arrive at an overall assessment of the computer's position versus your position. The location of each piece on the board contributes to its evaluation, and the AI employs these values to determine which move yields the highest evaluation.
- **Search Tree using Minimax:** We employ the Minimax algorithm to construct a search tree that delves into all conceivable moves up to a specified depth. As the algorithm explores the positions at the "leaves" of the tree, it strategically selects moves that either minimize or maximize the resulting outcome, depending on whether it's White or Black's turn.
- **Alpha-Beta Pruning:** Chess AI integrates alpha-beta pruning as an optimization technique for the Minimax algorithm. This method allows us to discard specific branches of the search tree, enhancing the algorithm's efficiency while leaving the final outcome unaltered.
