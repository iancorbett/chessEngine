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


