import { Chess } from 'chess.js'; //PACKAGE HANDLES LEGAL MOVES AND BOARD STATE

//KINGS VALUE SET TO ZERO, SINCE VALUE IS BASICALLY INFINITE THE EVALUATIONS WOULD MALFUNCTION IS AN EXTREMELY HIGH NUMBER WAS PLACED
//CHECKMATE DETECTION WILL BE HANDLED DIFFERENTLY LATER
// KING EVAL COMES FROM KING SAFETY, POSITION, ETC
const VALUES = { p:100, n:320, b:330, r:500, q:900, k:0 }; //PAWNS, KNIGHTS, BISHOPS, ROOK, QUEEN, KING

const PST_PAWN = [ //CREATE 8X8 GRID LIKE A REAL BOARD, FROM WHITE'S POV
    0,0,0,0,0,0,0,0, //EIGHTH RANK/ PROMOTION RANK
    50,50,50,50,50,50,50,50, //7TH RANK, HIGHER NUMBERS INDICATE STRONGER POSITIONING AND CONTRIBUTE TO A BETTER EVAL
    10,10,20,30,30,20,10,10,
    5,5,10,25,25,10,5,5,
    0,0,0,20,20,0,0,0, // ENCOURAGING EITHER 1.D4 OR 1.E4 AS BEST FIRST MOVE
    5,-5,-10,0,0,-10,-5,5,
    5,10,10,-20,-20,10,10,5, //STARTING RANK
    0,0,0,0,0,0,0,0 // 1ST RANK
  ];

  const PST_KNIGHT = [
    -50,-40,-30,-30,-30,-30,-40,-50, //EIGHTH RANK, weakest positions for knights are on corners of board
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30, //knights are strongest in center of board, as they have more legal moves
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50 // 1ST RANK
  ];

  const PST_BISHOP = [
    -20,-10,-10,-10,-10,-10,-10,-20, //EIGHTH RANK, weakest positions for bishops are on corners of board
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,  //bishops are strongest in center of board, as they are able to attack more squares
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20 // 1ST RANK
  ];

  const PST_ROOK = [
    0, 0, 0, 0, 0, 0, 0, 0, //EIGHTH RANK
    5,10,10,10,10,10,10, 5, //seventh rank, strongest rank for rooks, especially if theyre connected on the seventh rank
   -5, 0, 0, 0, 0, 0, 0,-5,
   -5, 0, 0, 0, 0, 0, 0,-5,
   -5, 0, 0, 0, 0, 0, 0,-5,
   -5, 0, 0, 0, 0, 0, 0,-5,
   -5, 0, 0, 0, 0, 0, 0,-5,
    0, 0, 0, 5, 5, 0, 0, 0 // 1ST RANK
 ];

 const PST_QUEEN = [
    -20,-10,-10, -5, -5,-10,-10,-20, //EIGHTH RANK, weakest spot for queen is on corners of board
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
     -5,  0,  5,  5,  5,  5,  0, -5, //queen is strongest ttowards middle of board, as it attacks more squares
      0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20 // 1ST RANK
  ];

  const PST_KING = [
    20, 30, 10,  0,  0, 10, 30, 20, //EIGHTH RANK, king is strong on seventh and eighth rank, typically indicates favorable endgame postion.
    20, 20,  0,  0,  0,  0, 20, 20,
   -10,-20,-20,-20,-20,-20,-20,-10,
   -20,-30,-30,-40,-40,-30,-30,-20,
   -30,-40,-40,-50,-50,-40,-40,-30,//unlike other pieces king is in better positioon out of middle of the board and towards sides of board
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30 // 1ST RANK
 ];

 const PST = {
    p: PST_PAWN, n: PST_KNIGHT, b: PST_BISHOP,
    r: PST_ROOK, q: PST_QUEEN, k: PST_KING
  };

  function pstValue(pieceType, idx, color) {
    const table = PST[pieceType];
    if (!table) return 0;
    return color === 'w' ? table[idx] : table[63 - idx]; //use mirrored index for black
  }
 
  function evaluate(chess) {
    // Material + PST + tiny mobility nudge (side to move)
    let score = 0;
    const board = chess.board(); // 8x8 array, rows: rank 8..1
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = board[r][c];
        if (!sq) continue;
        const idx = (7 - r) * 8 + c; // map so a1=0..h8=63
        const base = VAL[sq.type];
        const pst = pstValue(sq.type, idx, sq.color);
        const s = (sq.color === 'w' ? 1 : -1) * (base + pst);
        score += s;
      }
    }
    // Small mobility term (fast & cheap): moves for side-to-move minus opponent/2
    const myMoves = chess.moves().length;
    score += (chess.turn() === 'w' ? +1 : -1) * (myMoves * 2);
  
    return score;
  }

  function mvpLva(mv) {//most valuable piece, least valuable atacker, searches captures first, seeks to capture most iportant enemy pieces with least valable piece possible
    if (!mv.captured) return 0; //score non capture moves as 0 initially
    return (VAL[mv.captured] || 0) * 10 - (VAL[mv.piece] || 0); //returns higher score for more beneficial trades
  }