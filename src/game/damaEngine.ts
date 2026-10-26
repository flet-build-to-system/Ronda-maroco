import { soundManager } from '../utils/audio';

export type PieceType = 'man' | 'king';
export type PieceColor = 'yellow' | 'red'; // yellow = player, red = Haj Brahim

export interface DamaPiece {
  id: string;
  color: PieceColor;
  type: PieceType;
  row: number;
  col: number;
}

export interface DamaMove {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  captures: { row: number; col: number }[];
}

export class DamaGame {
  public board: (DamaPiece | null)[][] = [];
  public currentTurn: PieceColor = 'yellow';
  public pieces: DamaPiece[] = [];
  public selectedPiece: DamaPiece | null = null;
  public validMoves: DamaMove[] = [];
  public hajSpeech: string = 'مرحبا بيك أ وليدي، كلس كلس.. ورّيني حنت يديك!';
  public hajSpeechTimer: number | null = null;
  public gameOver: boolean = false;
  public winner: PieceColor | null = null;
  public nfakhPiece: DamaPiece | null = null;
  public nfakhMessage: string | null = null;

  constructor() {
    this.initBoard();
  }

  initBoard() {
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
    this.pieces = [];
    this.currentTurn = 'yellow';
    this.selectedPiece = null;
    this.validMoves = [];
    this.gameOver = false;
    this.winner = null;
    this.nfakhPiece = null;
    this.nfakhMessage = null;

    let idCount = 0;
    // Red pieces (Haj Brahim) on rows 0, 1, 2 (dark squares where (r+c)%2 === 1)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) {
          const p: DamaPiece = { id: `red_${idCount++}`, color: 'red', type: 'man', row: r, col: c };
          this.pieces.push(p);
          this.board[r][c] = p;
        }
      }
    }

    // Yellow pieces (Player) on rows 5, 6, 7 (dark squares where (r+c)%2 === 1)
    for (let r = 5; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) {
          const p: DamaPiece = { id: `yellow_${idCount++}`, color: 'yellow', type: 'man', row: r, col: c };
          this.pieces.push(p);
          this.board[r][c] = p;
        }
      }
    }

    this.computeAllMovesForTurn();
  }

  setHajSpeech(text: string) {
    this.hajSpeech = text;
    if (this.hajSpeechTimer) clearTimeout(this.hajSpeechTimer);
    this.hajSpeechTimer = window.setTimeout(() => {
      this.hajSpeech = 'نوبتك، فكّر مزيان!';
    }, 4500);
  }

  // Find all possible captures and regular moves for current turn
  computeAllMovesForTurn(): DamaMove[] {
    const allMoves: DamaMove[] = [];
    const color = this.currentTurn;
    const piecesOfColor = this.pieces.filter(p => p.color === color);

    let maxCaptures = 0;
    const captureMoves: DamaMove[] = [];

    for (const p of piecesOfColor) {
      const pCaptures = this.getPieceCaptures(p, this.board);
      for (const move of pCaptures) {
        if (move.captures.length > maxCaptures) {
          maxCaptures = move.captures.length;
        }
        captureMoves.push(move);
      }
    }

    if (maxCaptures > 0) {
      // Moroccan rule: Captures are mandatory, and MAX capture path must be chosen!
      this.validMoves = captureMoves.filter(m => m.captures.length === maxCaptures);
      return this.validMoves;
    }

    // If no captures, compute simple 1-step diagonal moves
    for (const p of piecesOfColor) {
      const simpleMoves = this.getPieceSimpleMoves(p);
      allMoves.push(...simpleMoves);
    }

    this.validMoves = allMoves;
    return this.validMoves;
  }

  getPieceSimpleMoves(piece: DamaPiece): DamaMove[] {
    const moves: DamaMove[] = [];
    const { row, col, color, type } = piece;

    if (type === 'man') {
      const dir = color === 'yellow' ? -1 : 1; // forward direction
      const nextRow = row + dir;
      for (const dc of [-1, 1]) {
        const nextCol = col + dc;
        if (nextRow >= 0 && nextRow < 8 && nextCol >= 0 && nextCol < 8) {
          if (!this.board[nextRow][nextCol]) {
            moves.push({ fromRow: row, fromCol: col, toRow: nextRow, toCol: nextCol, captures: [] });
          }
        }
      }
    } else {
      // King ("ضامة كتطير") moves along diagonals as far as unblocked
      const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      for (const [dr, dc] of dirs) {
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < 8 && c >= 0 && c < 8 && !this.board[r][c]) {
          moves.push({ fromRow: row, fromCol: col, toRow: r, toCol: c, captures: [] });
          r += dr;
          c += dc;
        }
      }
    }
    return moves;
  }

  getPieceCaptures(piece: DamaPiece, board: (DamaPiece | null)[][]): DamaMove[] {
    const results: DamaMove[] = [];

    const searchJumps = (
      curRow: number,
      curCol: number,
      visitedCaptures: { row: number; col: number }[],
      simBoard: (DamaPiece | null)[][]
    ) => {
      let foundAny = false;
      const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

      if (piece.type === 'man') {
        // Forward jumps (and Moroccan rules allow forward-diagonal captures)
        const forwardDirs = piece.color === 'yellow' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
        for (const [dr, dc] of forwardDirs) {
          const enemyR = curRow + dr;
          const enemyC = curCol + dc;
          const landR = curRow + dr * 2;
          const landC = curCol + dc * 2;

          if (landR >= 0 && landR < 8 && landC >= 0 && landC < 8) {
            const enemy = simBoard[enemyR][enemyC];
            const landing = simBoard[landR][landC];
            const alreadyTaken = visitedCaptures.some(v => v.row === enemyR && v.col === enemyC);

            if (enemy && enemy.color !== piece.color && !alreadyTaken && !landing) {
              foundAny = true;
              const newCaptures = [...visitedCaptures, { row: enemyR, col: enemyC }];
              
              // clone board for branch
              const nextBoard = simBoard.map(row => [...row]);
              nextBoard[curRow][curCol] = null;
              nextBoard[landR][landC] = piece;

              searchJumps(landR, landC, newCaptures, nextBoard);
            }
          }
        }
      } else {
        // King ("الضامة طيارة") can jump over enemy at distance
        for (const [dr, dc] of dirs) {
          let step = 1;
          while (true) {
            const r = curRow + dr * step;
            const c = curCol + dc * step;
            if (r < 0 || r >= 8 || c < 0 || c >= 8) break;

            const target = simBoard[r][c];
            if (target) {
              if (target.color !== piece.color && !visitedCaptures.some(v => v.row === r && v.col === c)) {
                // Find empty landing spots beyond this enemy
                let landStep = 1;
                while (true) {
                  const lr = r + dr * landStep;
                  const lc = c + dc * landStep;
                  if (lr < 0 || lr >= 8 || lc < 0 || lc >= 8) break;
                  if (simBoard[lr][lc]) break; // blocked

                  foundAny = true;
                  const newCaptures = [...visitedCaptures, { row: r, col: c }];
                  const nextBoard = simBoard.map(row => [...row]);
                  nextBoard[curRow][curCol] = null;
                  nextBoard[lr][lc] = piece;

                  searchJumps(lr, lc, newCaptures, nextBoard);
                  landStep++;
                }
              }
              break; // cannot jump two pieces in single line
            }
            step++;
          }
        }
      }

      if (!foundAny && visitedCaptures.length > 0) {
        results.push({
          fromRow: piece.row,
          fromCol: piece.col,
          toRow: curRow,
          toCol: curCol,
          captures: visitedCaptures,
        });
      }
    };

    searchJumps(piece.row, piece.col, [], board);
    return results;
  }

  selectPiece(piece: DamaPiece | null) {
    if (this.currentTurn !== 'yellow' || this.gameOver) return;
    if (piece && piece.color !== 'yellow') return;
    this.selectedPiece = piece;
  }

  // Execute a player move
  makeMove(move: DamaMove): boolean {
    const piece = this.board[move.fromRow][move.fromCol];
    if (!piece || piece.color !== this.currentTurn) return false;

    // Check Moroccan "النفخ" (Nfakh): If a bigger capture was available from another piece
    const maxPossibleCapture = Math.max(0, ...this.validMoves.map(m => m.captures.length));
    if (maxPossibleCapture > move.captures.length && this.currentTurn === 'yellow') {
      // Player made a suboptimal move or skipped capture! Haj Brahim triggers "النفخ"!
      this.triggerNfakh(piece);
    }

    // Move piece on board
    this.board[move.fromRow][move.fromCol] = null;
    this.board[move.toRow][move.toCol] = piece;
    piece.row = move.toRow;
    piece.col = move.toCol;

    // Remove captured pieces
    for (const cap of move.captures) {
      const capPiece = this.board[cap.row][cap.col];
      if (capPiece) {
        this.board[cap.row][cap.col] = null;
        this.pieces = this.pieces.filter(p => p.id !== capPiece.id);
      }
    }

    soundManager.playDamaMove();

    // Check King promotion ("ضامة")
    if (piece.type === 'man') {
      if (piece.color === 'yellow' && piece.row === 0) {
        piece.type = 'king';
        this.setHajSpeech('ولّات ضامة! هادي واعرة..');
      } else if (piece.color === 'red' && piece.row === 7) {
        piece.type = 'king';
        this.setHajSpeech('الضامة ديالي كتطير! واهاها!');
      }
    }

    this.selectedPiece = null;

    // Toggle turn
    this.currentTurn = this.currentTurn === 'yellow' ? 'red' : 'yellow';
    const nextMoves = this.computeAllMovesForTurn();

    // Check game over
    const yellowPieces = this.pieces.filter(p => p.color === 'yellow');
    const redPieces = this.pieces.filter(p => p.color === 'red');

    if (yellowPieces.length === 0 || (this.currentTurn === 'yellow' && nextMoves.length === 0)) {
      this.gameOver = true;
      this.winner = 'red';
      this.setHajSpeech('غلبتك أ وليدي! المرة الجاية تفوز إن شاء الله.');
    } else if (redPieces.length === 0 || (this.currentTurn === 'red' && nextMoves.length === 0)) {
      this.gameOver = true;
      this.winner = 'yellow';
      soundManager.playCoin();
      this.setHajSpeech('تبارك الله عليك يا ولدي! حريف ومحنك.. هاك 50 فلوس دياولك!');
    } else if (this.currentTurn === 'red') {
      // Haj Brahim's AI move after short delay
      setTimeout(() => this.makeHajAiMove(), 800);
    }

    return true;
  }

  // Famous Moroccan Nfakh rule
  triggerNfakh(offendingPiece: DamaPiece) {
    soundManager.playNfakh();
    this.nfakhPiece = offendingPiece;
    this.nfakhMessage = 'النفخ! الحاج براهيم نفخ الحجرة حيت نسيتي الماكلة!';
    this.setHajSpeech('وا هاها! نسيتي ما كليتيش؟ هادي منفوخة بطيرانها! 💨');

    // Remove offending piece from board!
    this.board[offendingPiece.row][offendingPiece.col] = null;
    this.pieces = this.pieces.filter(p => p.id !== offendingPiece.id);

    setTimeout(() => {
      this.nfakhPiece = null;
      this.nfakhMessage = null;
    }, 3000);
  }

  // Haj Brahim's AI move
  makeHajAiMove() {
    if (this.gameOver || this.currentTurn !== 'red') return;
    const moves = this.computeAllMovesForTurn();
    if (moves.length === 0) return;

    // Haj Brahim always picks maximum capture move
    // If ties, prefer crowning move or center control
    moves.sort((a, b) => {
      if (b.captures.length !== a.captures.length) {
        return b.captures.length - a.captures.length;
      }
      return b.toRow - a.toRow; // push toward crowning
    });

    const chosen = moves[0];
    this.makeMove(chosen);
  }
}
