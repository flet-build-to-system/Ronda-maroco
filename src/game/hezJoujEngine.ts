import { Card, Suit } from '../types/cards';
import { createDeck, getRankNameAr } from '../utils/cardDeck';
import { soundManager } from '../utils/audio';

export interface HezJoujPlayer {
  id: string;
  name: string;
  isHuman: boolean;
  hand: Card[];
  speech?: string;
  speechTimer?: number;
}

export class HezJoujGame {
  public players: HezJoujPlayer[] = [];
  public currentTurnIndex: number = 0;
  public topCard: Card | null = null;
  public drawPile: Card[] = [];
  public discardPile: Card[] = [];
  public activeSuit: Suit = 'gold';
  public pendingDrawCount: number = 0; // accumulated "هز جوج" (+2, +4, +6)
  public gameOver: boolean = false;
  public winner: HezJoujPlayer | null = null;
  public announcement: string = '';
  public announcementTimer: number | null = null;

  constructor(playerName = 'Abdelhaq') {
    this.players = [
      { id: 'p0', name: playerName, isHuman: true, hand: [] },
      { id: 'p1', name: 'Robio', isHuman: false, hand: [] },
      { id: 'p2', name: '3abrou9a', isHuman: false, hand: [] },
    ];
    this.startNewGame();
  }

  startNewGame() {
    this.drawPile = createDeck();
    this.discardPile = [];
    this.pendingDrawCount = 0;
    this.gameOver = false;
    this.winner = null;

    // Deal 5 cards each
    for (const p of this.players) {
      p.hand = [];
      for (let i = 0; i < 5; i++) {
        p.hand.push(this.drawPile.pop()!);
      }
    }

    // Flip first top card (make sure it's not a special 2 or 7 initially for fairness)
    let first = this.drawPile.pop()!;
    while (first.rank === 2 || first.rank === 7) {
      this.drawPile.unshift(first);
      first = this.drawPile.pop()!;
    }
    this.topCard = first;
    this.activeSuit = first.suit;
    this.discardPile.push(first);

    this.currentTurnIndex = 0;
    this.setSpeech(1, 'يالله، الوراق! خمسة لكل واحد!');
  }

  setSpeech(playerIdx: number, text: string) {
    const p = this.players[playerIdx];
    if (p) {
      p.speech = text;
      if (p.speechTimer) clearTimeout(p.speechTimer);
      p.speechTimer = window.setTimeout(() => {
        p.speech = undefined;
      }, 3500);
    }
  }

  setAnnouncement(msg: string) {
    this.announcement = msg;
    if (this.announcementTimer) clearTimeout(this.announcementTimer);
    this.announcementTimer = window.setTimeout(() => {
      this.announcement = '';
    }, 3000);
  }

  canPlayCard(card: Card): boolean {
    if (!this.topCard) return false;

    // If there is an active draw penalty (e.g. +2, +4), only another 2 can be stacked!
    if (this.pendingDrawCount > 0) {
      return card.rank === 2;
    }

    // Normal play: matches active suit or same rank or 7 (wild)
    return card.suit === this.activeSuit || card.rank === this.topCard.rank || card.rank === 7;
  }

  playCard(playerIdx: number, cardId: string, chosenSuitIf7?: Suit): boolean {
    const p = this.players[playerIdx];
    const cIdx = p.hand.findIndex(c => c.id === cardId);
    if (cIdx === -1) return false;

    const card = p.hand[cIdx];
    if (!this.canPlayCard(card)) return false;

    p.hand.splice(cIdx, 1);
    this.discardPile.push(card);
    this.topCard = card;
    soundManager.playCardSnap();

    // Check Action Cards
    if (card.rank === 2) {
      // هز جوج!
      this.pendingDrawCount += 2;
      this.activeSuit = card.suit;
      soundManager.playCapture();
      this.setAnnouncement(`هزة ×${this.pendingDrawCount} 🔥`);
      this.setSpeech(playerIdx, `هز جوج! دابا ولّات ${this.pendingDrawCount}!`);
    } else if (card.rank === 1) {
      // اللاص (Skip next player)
      this.activeSuit = card.suit;
      this.setAnnouncement('اللاص! تخطّي النوبة 🚫');
      this.setSpeech(playerIdx, 'اللاص! ما تلعبش!');
      this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length; // skip one extra
    } else if (card.rank === 7) {
      // السبعة (Suit changer / Ruler)
      const newSuit = chosenSuitIf7 || card.suit;
      this.activeSuit = newSuit;
      const suitName = newSuit === 'gold' ? 'الذهب' : newSuit === 'cups' ? 'الكاس' : newSuit === 'swords' ? 'السيف' : 'الزرواطة';
      this.setAnnouncement(`أنا حاكم بـ ${suitName} 👑`);
      this.setSpeech(playerIdx, `السبعة.. أنا حاكم بـ ${suitName}!`);
    } else {
      this.activeSuit = card.suit;
    }

    // Check if player won (hand empty)
    if (p.hand.length === 0) {
      this.gameOver = true;
      this.winner = p;
      soundManager.playCoin();
      this.setSpeech(playerIdx, 'ربحت ساليت وراقي كاملين! 🎉');
      return true;
    }

    // Move to next player
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;

    // If next player is AI, trigger turn
    if (!this.players[this.currentTurnIndex].isHuman && !this.gameOver) {
      setTimeout(() => this.makeAiMove(), 900);
    }

    return true;
  }

  // Draw card from deck
  drawCard(playerIdx: number): boolean {
    const p = this.players[playerIdx];

    if (this.pendingDrawCount > 0) {
      // Must take the accumulated penalty!
      for (let i = 0; i < this.pendingDrawCount; i++) {
        this.ensureDrawPile();
        if (this.drawPile.length > 0) {
          p.hand.push(this.drawPile.pop()!);
        }
      }
      soundManager.playCardDeal();
      this.setSpeech(playerIdx, `هزيت ${this.pendingDrawCount} كارطات بزز مني! 😭`);
      this.pendingDrawCount = 0;
      this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;

      if (!this.players[this.currentTurnIndex].isHuman && !this.gameOver) {
        setTimeout(() => this.makeAiMove(), 900);
      }
      return true;
    }

    // Normal draw: draw 1 card
    this.ensureDrawPile();
    if (this.drawPile.length > 0) {
      const drawn = this.drawPile.pop()!;
      p.hand.push(drawn);
      soundManager.playCardDeal();
    }

    // Advance turn
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;

    if (!this.players[this.currentTurnIndex].isHuman && !this.gameOver) {
      setTimeout(() => this.makeAiMove(), 900);
    }
    return true;
  }

  private ensureDrawPile() {
    if (this.drawPile.length === 0 && this.discardPile.length > 1) {
      const top = this.discardPile.pop()!;
      this.drawPile = this.discardPile;
      this.discardPile = [top];
      for (let i = this.drawPile.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
      }
    }
  }

  makeAiMove() {
    if (this.gameOver) return;
    const p = this.players[this.currentTurnIndex];
    if (p.isHuman) return;

    // Check if AI can play a 2 to defend or attack
    const twoCard = p.hand.find(c => c.rank === 2);
    if (this.pendingDrawCount > 0) {
      if (twoCard) {
        this.playCard(this.currentTurnIndex, twoCard.id);
        return;
      } else {
        this.drawCard(this.currentTurnIndex);
        return;
      }
    }

    // Normal valid cards
    const validCards = p.hand.filter(c => this.canPlayCard(c));
    if (validCards.length > 0) {
      // Pick best card: 2 or 1 or matching
      const cardToPlay = validCards[Math.floor(Math.random() * validCards.length)];
      let chosenSuit: Suit = 'gold';
      if (cardToPlay.rank === 7) {
        // Pick suit AI has the most of
        const suitCounts: Record<Suit, number> = { gold: 0, cups: 0, swords: 0, clubs: 0 };
        p.hand.forEach(c => suitCounts[c.suit]++);
        chosenSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b);
      }
      this.playCard(this.currentTurnIndex, cardToPlay.id, chosenSuit);
    } else {
      // Draw card
      this.drawCard(this.currentTurnIndex);
    }
  }
}
