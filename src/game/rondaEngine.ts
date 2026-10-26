import { Card, Player, GameOptions } from '../types/cards';
import { createDeck, getRankNameAr } from '../utils/cardDeck';
import { soundManager } from '../utils/audio';

export interface TurnActionFeedback {
  type: 'capture' | 'drop' | 'ronda' | 'tringla' | 'missa' | 'darb_w_rja3';
  points: number;
  message: string;
  capturedCards: Card[];
  playerId: string;
}

export class RondaGame {
  public players: Player[] = [];
  public tableCards: Card[] = [];
  public deck: Card[] = [];
  public currentTurnIndex: number = 0;
  public dealerIndex: number = 0;
  public roundNumber: number = 1;
  public dealNumber: number = 1; // 1 to 3 deals in 4-player, etc.
  public targetScore: number = 21;
  public lastTakerIndex: number = -1;
  public lastPlayedCard: Card | null = null;
  public lastPlayedBy: number = -1;
  public rja3Streak: number = 0; // count of consecutive returns on same rank
  public options: GameOptions;
  public isDealing: boolean = false;
  public gameOver: boolean = false;
  public winnerTeam: number | null = null; // 0 = (Player 0 & 2), 1 = (Player 1 & 3)

  constructor(
    playerName = 'Abdelhaq',
    city = 'زاكورة',
    is4Players = true,
    target = 21,
    options: Partial<GameOptions> = {}
  ) {
    this.targetScore = target;
    this.options = {
      darbWRja3: true,
      fourCardsVersion: false,
      cafeBluffMode: false,
      tableTalk: true,
      partnerAdvice: true,
      speed: 'fast',
      ...options,
    };

    if (is4Players) {
      // 4 players (Team 0: You [0] & Partner [2], Team 1: Left [1] & Right [3])
      this.players = [
        {
          id: 'p0',
          name: playerName,
          city: city,
          country: 'المغرب',
          avatarId: 'you',
          isHuman: true,
          hand: [],
          capturedCards: [],
          score: 0,
        },
        {
          id: 'p1',
          name: 'LOTFI_LGHZAL',
          city: 'الرباط',
          country: 'المغرب',
          avatarId: 'opp_left',
          isHuman: false,
          hand: [],
          capturedCards: [],
          score: 0,
        },
        {
          id: 'p2',
          name: 'RAFIK_CHEMS',
          city: 'فاس',
          country: 'المغرب',
          avatarId: 'partner',
          isHuman: false,
          hand: [],
          capturedCards: [],
          score: 0,
        },
        {
          id: 'p3',
          name: 'GHALI_RIFI',
          city: 'طنجة',
          country: 'المغرب',
          avatarId: 'opp_right',
          isHuman: false,
          hand: [],
          capturedCards: [],
          score: 0,
        },
      ];
    } else {
      // 2 players 1v1
      this.players = [
        {
          id: 'p0',
          name: playerName,
          city: city,
          country: 'المغرب',
          avatarId: 'you',
          isHuman: true,
          hand: [],
          capturedCards: [],
          score: 0,
        },
        {
          id: 'p1',
          name: 'LOTFI_LGHZAL',
          city: 'الرباط',
          country: 'المغرب',
          avatarId: 'opp_left',
          isHuman: false,
          hand: [],
          capturedCards: [],
          score: 0,
        },
      ];
    }

    this.startNewRound();
  }

  // Get team points: Team 0 = players 0 & 2, Team 1 = players 1 & 3 (or 0 and 1 in 2-player)
  getTeamScore(team: number): number {
    if (this.players.length === 2) {
      return this.players[team]?.score || 0;
    }
    if (team === 0) {
      return (this.players[0]?.score || 0) + (this.players[2]?.score || 0);
    } else {
      return (this.players[1]?.score || 0) + (this.players[3]?.score || 0);
    }
  }

  getTeamCardsCount(team: number): number {
    if (this.players.length === 2) {
      return this.players[team]?.capturedCards.length || 0;
    }
    if (team === 0) {
      return (this.players[0]?.capturedCards.length || 0) + (this.players[2]?.capturedCards.length || 0);
    } else {
      return (this.players[1]?.capturedCards.length || 0) + (this.players[3]?.capturedCards.length || 0);
    }
  }

  startNewRound() {
    this.deck = createDeck();
    this.tableCards = [];
    this.lastTakerIndex = -1;
    this.lastPlayedCard = null;
    this.lastPlayedBy = -1;
    this.rja3Streak = 0;
    this.dealNumber = 1;

    // Reset hands and captured cards for each player
    for (const p of this.players) {
      p.hand = [];
      p.capturedCards = [];
      p.announcedRonda = null;
    }

    // In Ronda, first deal puts 4 cards on table (cannot have matching pairs in initial 4)
    if (!this.options.fourCardsVersion) {
      const initialTable: Card[] = [];
      while (initialTable.length < 4 && this.deck.length > 0) {
        const c = this.deck.pop()!;
        if (initialTable.some(tc => tc.rank === c.rank)) {
          // pair found, re-insert and reshuffle
          this.deck.unshift(c);
          this.deck = createDeck(); // reshuffle
          initialTable.length = 0;
        } else {
          initialTable.push(c);
        }
      }
      this.tableCards = initialTable;
    }

    this.dealHands();
  }

  dealHands() {
    this.isDealing = true;
    soundManager.playCardDeal();

    // Deal 3 cards to each player (or 4 in four-cards variant)
    const cardsPerPlayer = this.options.fourCardsVersion ? 4 : 3;
    for (let c = 0; c < cardsPerPlayer; c++) {
      for (let i = 0; i < this.players.length; i++) {
        if (this.deck.length > 0) {
          const card = this.deck.pop()!;
          this.players[i].hand.push(card);
        }
      }
    }

    // Check for Ronda / Tringla announcements in hand
    this.checkAnnouncements();

    this.isDealing = false;
  }

  checkAnnouncements() {
    for (let i = 0; i < this.players.length; i++) {
      const p = this.players[i];
      p.announcedRonda = null;
      p.rondaRank = undefined;

      const rankCounts: Record<number, number> = {};
      for (const c of p.hand) {
        rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1;
      }

      for (const [rankStr, count] of Object.entries(rankCounts)) {
        const r = Number(rankStr);
        if (count === 3) {
          p.announcedRonda = 'tringla';
          p.rondaRank = r;
          p.score += 5;
          soundManager.playTringla();
          this.showSpeech(i, `ترينكة! 🌟 (${getRankNameAr(r)})`);
          break;
        } else if (count === 2) {
          p.announcedRonda = 'ronda';
          p.rondaRank = r;
          p.score += 1;
          soundManager.playRonda();
          this.showSpeech(i, `روندا! ✨ (${getRankNameAr(r)})`);
          break;
        }
      }
    }
  }

  showSpeech(playerIdx: number, text: string) {
    if (this.players[playerIdx]) {
      this.players[playerIdx].speech = text;
      if (this.players[playerIdx].speechTimer) {
        clearTimeout(this.players[playerIdx].speechTimer);
      }
      this.players[playerIdx].speechTimer = window.setTimeout(() => {
        if (this.players[playerIdx]) {
          this.players[playerIdx].speech = undefined;
        }
      }, 3500);
    }
  }

  // Next sequential rank in 40-card Moroccan deck (7 goes to 10, 10 to 11, 11 to 12)
  getNextRank(rank: number): number | null {
    if (rank >= 1 && rank <= 6) return rank + 1;
    if (rank === 7) return 10;
    if (rank === 10) return 11;
    if (rank === 11) return 12;
    return null; // 12 has no subsequent rank
  }

  // Play a card from hand
  playCard(playerIndex: number, cardId: string): TurnActionFeedback {
    const player = this.players[playerIndex];
    const cardIdx = player.hand.findIndex(c => c.id === cardId);
    if (cardIdx === -1) {
      throw new Error("Card not found in player's hand");
    }

    const playedCard = player.hand.splice(cardIdx, 1)[0];
    soundManager.playCardSnap();

    let feedback: TurnActionFeedback = {
      type: 'drop',
      points: 0,
      message: `${player.name} لاح ${playedCard.nameAr} د ${playedCard.suitNameAr}`,
      capturedCards: [],
      playerId: player.id,
    };

    // Check if card matches any card on the table
    const matchingTableIdx = this.tableCards.findIndex(tc => tc.rank === playedCard.rank);

    if (matchingTableIdx !== -1) {
      // MATCH FOUND!
      soundManager.playCapture();
      const captured: Card[] = [playedCard];
      const matchedTableCard = this.tableCards.splice(matchingTableIdx, 1)[0];
      captured.push(matchedTableCard);

      // Collect consecutive ranks on table (e.g. if played 4, takes 4, and if 5, 6 on table, takes them too!)
      let currentSeqRank = this.getNextRank(playedCard.rank);
      while (currentSeqRank !== null) {
        const nextIdx = this.tableCards.findIndex(tc => tc.rank === currentSeqRank);
        if (nextIdx !== -1) {
          captured.push(this.tableCards.splice(nextIdx, 1)[0]);
          currentSeqRank = this.getNextRank(currentSeqRank);
        } else {
          break;
        }
      }

      player.capturedCards.push(...captured);
      this.lastTakerIndex = playerIndex;

      // Check "ضربة ورجعة" (Darb w Rja3)
      // If player matches the card just played by the preceding player:
      let pointsWon = 0;
      let darbMsg = '';

      if (this.options.darbWRja3 && this.lastPlayedCard && this.lastPlayedCard.rank === playedCard.rank) {
        if (this.rja3Streak === 0) {
          pointsWon += 1;
          player.score += 1;
          darbMsg = 'هاك هادي! (+1)';
          this.rja3Streak = 1;
          this.showSpeech(playerIndex, 'هاك هادي! 😉');
        } else if (this.rja3Streak === 1) {
          pointsWon += 5;
          player.score += 5;
          darbMsg = 'زيدك هادي! (+5)';
          this.rja3Streak = 2;
          this.showSpeech(playerIndex, 'زيدك هادي! 🔥');
        } else {
          pointsWon += 10;
          player.score += 10;
          darbMsg = 'وعشرة هادي! (+10)';
          this.rja3Streak = 3;
          this.showSpeech(playerIndex, 'عشرة هادي يا سيدي! 💥');
        }
      } else {
        this.rja3Streak = 0;
      }

      // Check "ميسة" (Missa: table completely cleared)
      // (Missa doesn't count on the very last trick of the whole round)
      const isVeryLastTrick = this.deck.length === 0 && this.players.every(p => p.hand.length === 0);
      let isMissa = false;
      if (this.tableCards.length === 0 && !isVeryLastTrick) {
        player.score += 1;
        pointsWon += 1;
        isMissa = true;
        soundManager.playMissa();
        this.showSpeech(playerIndex, 'ميسة ناضية! 🧹✨');
      }

      feedback = {
        type: isMissa ? 'missa' : (darbMsg ? 'darb_w_rja3' : 'capture'),
        points: pointsWon,
        message: isMissa 
          ? `ميسة! ${player.name} مسح الطبلة (+1)`
          : (darbMsg ? `${darbMsg} شد ${captured.length} كارطات` : `${player.name} شد ${captured.length} كارطات`),
        capturedCards: captured,
        playerId: player.id,
      };
    } else {
      // No match: card dropped onto table
      this.tableCards.push(playedCard);
      this.rja3Streak = 0;
    }

    this.lastPlayedCard = playedCard;
    this.lastPlayedBy = playerIndex;

    // Check if hands are empty and need new deal
    const allHandsEmpty = this.players.every(p => p.hand.length === 0);
    if (allHandsEmpty) {
      if (this.deck.length > 0) {
        // Next deal in current round
        this.dealNumber++;
        this.dealHands();
      } else {
        // Round Finished! Last taker sweeps any remaining cards
        this.finishRound();
      }
    }

    // Advance turn (anti-clockwise in Moroccan Ronda)
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;

    // Check game over
    this.checkGameOver();

    return feedback;
  }

  finishRound() {
    // The last player who took a trick sweeps any remaining table cards
    if (this.lastTakerIndex !== -1 && this.tableCards.length > 0) {
      this.players[this.lastTakerIndex].capturedCards.push(...this.tableCards);
      this.showSpeech(this.lastTakerIndex, 'شياطة ديالي! 🎁');
      this.tableCards = [];
    }

    // Tally cards points: each card over 20 counts as +1 point
    const team0Cards = this.getTeamCardsCount(0);
    const team1Cards = this.getTeamCardsCount(1);

    if (team0Cards > 20) {
      const extra0 = team0Cards - 20;
      this.players[0].score += extra0;
    }
    if (team1Cards > 20) {
      const extra1 = team1Cards - 20;
      this.players[1].score += extra1;
    }

    this.checkGameOver();

    if (!this.gameOver) {
      this.roundNumber++;
      this.dealerIndex = (this.dealerIndex + 1) % this.players.length;
      this.currentTurnIndex = (this.dealerIndex + 1) % this.players.length;
      this.startNewRound();
    }
  }

  checkGameOver() {
    const s0 = this.getTeamScore(0);
    const s1 = this.getTeamScore(1);

    if (s0 >= this.targetScore || s1 >= this.targetScore) {
      this.gameOver = true;
      this.winnerTeam = s0 >= s1 ? 0 : 1;
      soundManager.playCoin();
    }
  }

  // AI strategy to choose a card to play
  getAiBestMove(playerIndex: number): string {
    const p = this.players[playerIndex];
    if (p.hand.length === 0) return '';

    // 1. Look for Darb w Rja3 (taking immediately after opponent)
    if (this.lastPlayedCard) {
      const rja3Card = p.hand.find(c => c.rank === this.lastPlayedCard!.rank);
      if (rja3Card) return rja3Card.id;
    }

    // 2. Look for captures that yield the maximum number of cards
    let bestCard = p.hand[0];
    let maxCardsTaken = 0;

    for (const card of p.hand) {
      if (this.tableCards.some(tc => tc.rank === card.rank)) {
        let count = 2; // base pair
        let seq = this.getNextRank(card.rank);
        while (seq !== null) {
          if (this.tableCards.some(tc => tc.rank === seq)) {
            count++;
            seq = this.getNextRank(seq);
          } else {
            break;
          }
        }
        if (count > maxCardsTaken) {
          maxCardsTaken = count;
          bestCard = card;
        }
      }
    }

    if (maxCardsTaken > 0) return bestCard.id;

    // 3. If no captures, play a safe card that is unlikely to be taken
    // Discard single card or higher cards (10, 11, 12)
    return p.hand[Math.floor(Math.random() * p.hand.length)].id;
  }
}
