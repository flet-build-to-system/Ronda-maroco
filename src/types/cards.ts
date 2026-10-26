export type Suit = 'gold' | 'cups' | 'swords' | 'clubs';

export interface Card {
  id: string;
  suit: Suit;
  rank: number; // 1, 2, 3, 4, 5, 6, 7, 10, 11, 12
  nameAr: string;
  suitNameAr: string;
}

export type CardBackStyle = 'classic' | 'zellij' | 'leather' | 'mint' | 'night';

export type CafeCupStyle = 'chamali' | 'dentelle' | 'zellij_cup' | 'noss_noss' | 'talyan';

export type GameLocation = 
  | 'cafe' 
  | 'terrace' 
  | 'salon' 
  | 'riad' 
  | 'blue_city' 
  | 'mogador' 
  | 'tent' 
  | 'bouregreg';

export interface Player {
  id: string;
  name: string;
  city: string;
  country: string;
  avatarId: string;
  isHuman: boolean;
  hand: Card[];
  capturedCards: Card[];
  score: number;
  announcedRonda?: 'ronda' | 'tringla' | null;
  rondaRank?: number;
  speech?: string;
  speechTimer?: number;
}

export interface GameOptions {
  darbWRja3: boolean; // ضربة ورجعة (+1, +5, +10)
  fourCardsVersion: boolean; // نسخة 4 كارطات
  cafeBluffMode: boolean; // وضع القهوة والإعلان والبلوف
  tableTalk: boolean; // الهدرة فالطبلة
  partnerAdvice: boolean; // وصية الصاحب
  speed: 'slow' | 'normal' | 'fast';
}

export type GameMode = 'ronda' | 'dama' | 'hez_jouj';
