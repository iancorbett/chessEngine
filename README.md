# JS Chess Engine

Tiny chess engine I built in JavaScript. It runs in a Web Worker, uses [chess.js](https://github.com/jhlywa/chess.js) for rules, and a modern web component (`<chess-board>`) for the UI.

The engine is classic **negamax + alpha–beta** with **quiescence search**, **MVV-LVA move ordering**, and simple **piece-square tables**. It’s fast enough for casual play and fun to tinker with, although engines in other languages have much higher elo ceilings.

---

## Demo

- Open `index.html` with Live Server (VS Code extension)  
- Make a move — the engine replies  

---

## Features

-  Plays legal chess from any position (FEN)  
-  Search: negamax + alpha–beta + quiescence  
-  Move ordering: **MVV-LVA** for captures  
-  Evaluation: material + PSTs + tiny mobility nudge  
-  Runs in a **Web Worker** (no UI jank)  
-  Adjustable think time (ms) + max depth  

---

## Stack

- UI: [chessboard-element](https://unpkg.com/chessboard-element?module) web component  
- Rules: [chess.js (ESM)](https://github.com/jhlywa/chess.js)  
- Engine: my code (`engine.js`) running in a **module worker**  

---

## How it works (short version)

- **Search**  
  - `search(position, depth, alpha, beta)` (negamax)  
  - alpha–beta pruning  
  - leaf → `quiescence` (captures only) to avoid horizon blunders  

- **Move ordering**  
  - Captures sorted by **Most Valuable Victim – Least Valuable Attacker (MVV-LVA)**  

- **Eval**  
  - Material (P=100, N=320, B=330, R=500, Q=900, K=0)  
  - Piece-Square Tables (mirrored for black)  
  - Tiny mobility term for side-to-move  

- **Checkmate / stalemate**  
  - No legal moves: if `isCheck()` → `-MATE`; else `0`  

---


