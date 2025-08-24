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
 