import { Card, Suit, CardBackStyle } from '../types/cards';

export const SUITS: { suit: Suit; nameAr: string; color: string }[] = [
  { suit: 'gold', nameAr: 'دينار', color: '#f59e0b' },
  { suit: 'cups', nameAr: 'كاس', color: '#ef4444' },
  { suit: 'swords', nameAr: 'سيف', color: '#3b82f6' },
  { suit: 'clubs', nameAr: 'زرواطة', color: '#10b981' },
];

export const RANKS = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

export function getRankNameAr(rank: number): string {
  switch (rank) {
    case 1: return 'اللاص';
    case 2: return 'الجوج';
    case 3: return 'التلاتة';
    case 4: return 'الربعة';
    case 5: return 'الخمسة';
    case 6: return 'الستة';
    case 7: return 'السبعة';
    case 10: return 'الولد';
    case 11: return 'العود';
    case 12: return 'المالك';
    default: return `${rank}`;
  }
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const s of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${s.suit}_${rank}`,
        suit: s.suit,
        rank,
        nameAr: getRankNameAr(rank),
        suitNameAr: s.nameAr,
      });
    }
  }
  return shuffleDeck(deck);
}

export function shuffleDeck<T>(deck: T[]): T[] {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Procedurally draws a high-resolution authentic Baraja card face onto an HTML5 Canvas.
 */
export function drawCardFaceCanvas(card: Card, width = 300, height = 450): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Background - Off-white parchment texture
  ctx.fillStyle = '#fbf7ee';
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, 16);
  ctx.fill();

  // Double Border
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(10, 10, width - 20, height - 20, 12);
  ctx.stroke();

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#94a3b8';
  ctx.beginPath();
  ctx.roundRect(15, 15, width - 30, height - 30, 8);
  ctx.stroke();

  // Corner rank numbers
  ctx.font = 'bold 28px "Tajawal", "Changa", sans-serif';
  ctx.fillStyle = '#1e293b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Top-left
  ctx.fillText(`${card.rank}`, 30, 36);
  // Bottom-right
  ctx.fillText(`${card.rank}`, width - 30, height - 36);

  // Center drawing based on suit & rank
  drawCardArtwork(ctx, card, width, height);

  return canvas;
}

function drawCardArtwork(ctx: CanvasRenderingContext2D, card: Card, w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;

  if (card.rank === 1 && card.suit === 'cups') {
    // Large Moroccan Chalice / Golden Goblet (as seen in screenshots!)
    ctx.save();
    ctx.translate(cx, cy);

    // Pedestal
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.ellipse(0, 80, 50, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // Stem
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-15, 40, 30, 40);
    ctx.strokeRect(-15, 40, 30, 40);

    // Bowl
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 10, 55, 0, Math.PI);
    ctx.fill();
    ctx.stroke();

    // Blue and Red Moroccan patterns on bowl
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, 10, 55, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.fill();

    // Upper rim & finial lid
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(0, -10, 55, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Lid ornament
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(0, -45, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Finial tip
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -70, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
    return;
  }

  if (card.rank === 1 && card.suit === 'gold') {
    // Large Sun Medallion (Oros)
    ctx.save();
    ctx.translate(cx, cy);
    // Outer rays
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    for (let i = 0; i < 16; i++) {
      ctx.rotate((Math.PI * 2) / 16);
      ctx.beginPath();
      ctx.moveTo(0, -85);
      ctx.lineTo(12, -60);
      ctx.lineTo(-12, -60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    // Main gold coin circle
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner detail
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Sun face
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(-14, -10, 4, 0, Math.PI * 2);
    ctx.arc(14, -10, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 10, 16, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
    return;
  }

  if (card.rank >= 10) {
    // Court cards: 10 (Sota/Boy), 11 (Caballo/Horse), 12 (Rey/King)
    drawCourtCard(ctx, card, cx, cy, w, h);
    return;
  }

  // Number cards (2 to 7): draw accurate suit symbols
  drawPipPattern(ctx, card, cx, cy, w, h);
}

function drawPipPattern(ctx: CanvasRenderingContext2D, card: Card, cx: number, cy: number, w: number, h: number) {
  const count = card.rank;
  const positions: { x: number; y: number }[] = [];

  const left = cx - 55;
  const right = cx + 55;
  const top = cy - 100;
  const midTop = cy - 40;
  const midBottom = cy + 40;
  const bottom = cy + 100;

  if (count === 1) {
    positions.push({ x: cx, y: cy });
  } else if (count === 2) {
    positions.push({ x: cx, y: top }, { x: cx, y: bottom });
  } else if (count === 3) {
    positions.push({ x: cx, y: top }, { x: cx, y: cy }, { x: cx, y: bottom });
  } else if (count === 4) {
    positions.push({ x: left, y: top }, { x: right, y: top }, { x: left, y: bottom }, { x: right, y: bottom });
  } else if (count === 5) {
    positions.push(
      { x: left, y: top }, { x: right, y: top },
      { x: cx, y: cy },
      { x: left, y: bottom }, { x: right, y: bottom }
    );
  } else if (count === 6) {
    positions.push(
      { x: left, y: top }, { x: right, y: top },
      { x: left, y: cy }, { x: right, y: cy },
      { x: left, y: bottom }, { x: right, y: bottom }
    );
  } else if (count === 7) {
    positions.push(
      { x: left, y: top }, { x: right, y: top },
      { x: left, y: midTop }, { x: right, y: midTop },
      { x: cx, y: cy },
      { x: left, y: bottom }, { x: right, y: bottom }
    );
  }

  for (const pos of positions) {
    drawSuitIcon(ctx, card.suit, pos.x, pos.y, 22);
  }
}

function drawSuitIcon(ctx: CanvasRenderingContext2D, suit: Suit, x: number, y: number, size = 20) {
  ctx.save();
  ctx.translate(x, y);

  if (suit === 'gold') {
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (suit === 'cups') {
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2;

    // Cup body
    ctx.beginPath();
    ctx.arc(0, 2, size * 0.8, 0, Math.PI);
    ctx.fill();
    ctx.stroke();

    // Stem & Base
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-size * 0.25, size * 0.7, size * 0.5, size * 0.5);
    ctx.beginPath();
    ctx.ellipse(0, size * 1.2, size * 0.6, size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Top Rim
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(0, -2, size * 0.8, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (suit === 'swords') {
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2;

    // Curved blade
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.3);
    ctx.bezierCurveTo(size * 0.6, -size * 0.4, size * 0.4, size * 0.5, 0, size * 0.7);
    ctx.bezierCurveTo(-size * 0.2, size * 0.5, -size * 0.3, -size * 0.4, 0, -size * 1.3);
    ctx.fill();
    ctx.stroke();

    // Guard & Pommel
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-size * 0.7, size * 0.7, size * 1.4, size * 0.25);
    ctx.fillRect(-size * 0.2, size * 0.95, size * 0.4, size * 0.45);
  } else if (suit === 'clubs') {
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 2;

    // Wood club with knobby branches
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, size * 1.2);
    ctx.lineTo(size * 0.3, size * 1.2);
    ctx.lineTo(size * 0.5, -size * 0.8);
    ctx.arc(0, -size * 0.9, size * 0.5, 0, Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Knots / leaves
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(-size * 0.4, -size * 0.2, size * 0.2, 0, Math.PI * 2);
    ctx.arc(size * 0.4, 0, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawCourtCard(
  ctx: CanvasRenderingContext2D,
  card: Card,
  cx: number,
  cy: number,
  w: number,
  h: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  if (card.rank === 10) {
    // 10: الولد (Sota / Foot Soldier / Page)
    // Standing youth in renaissance Moroccan attire with tunic & hose
    ctx.fillStyle = '#dc2626'; // Red tunic
    ctx.fillRect(-35, -40, 70, 70);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(-35, -40, 70, 70);

    // Legs in blue tights
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-28, 30, 22, 60);
    ctx.fillRect(6, 30, 22, 60);

    // Head & beret
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -65, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hat
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.ellipse(0, -80, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Suit emblem in hand
    drawSuitIcon(ctx, card.suit, 32, -10, 16);
  } else if (card.rank === 11) {
    // 11: العود (Caballo / Knight on Horseback)
    // Horse body
    ctx.fillStyle = '#60a5fa'; // Blue caparison / horse
    ctx.beginPath();
    ctx.ellipse(0, 25, 55, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    // Horse neck & head
    ctx.beginPath();
    ctx.moveTo(-35, 15);
    ctx.lineTo(-50, -35);
    ctx.lineTo(-30, -50);
    ctx.lineTo(-15, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rider torso
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-15, -40, 36, 45);
    ctx.strokeRect(-15, -40, 36, 45);

    // Rider head
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(3, -55, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Rider hat
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(3, -68, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Suit symbol
    drawSuitIcon(ctx, card.suit, 38, -35, 16);
  } else if (card.rank === 12) {
    // 12: المالك (Rey / King)
    // Robe
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-45, 90);
    ctx.lineTo(-30, -35);
    ctx.lineTo(30, -35);
    ctx.lineTo(45, 90);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    // Golden trim
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-10, -35, 20, 125);

    // Head
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -50, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Crown
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-22, -65);
    ctx.lineTo(-22, -85);
    ctx.lineTo(-11, -75);
    ctx.lineTo(0, -88);
    ctx.lineTo(11, -75);
    ctx.lineTo(22, -85);
    ctx.lineTo(22, -65);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Scepter / Suit symbol
    drawSuitIcon(ctx, card.suit, 32, 0, 18);
  }

  ctx.restore();
}

/**
 * Procedurally draws a card back matching the user's selected theme
 */
export function drawCardBackCanvas(style: CardBackStyle = 'classic', width = 300, height = 450): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  if (style === 'zellij') {
    // Moroccan Zellij (star tile pattern)
    ctx.fillStyle = '#7c2d12'; // deep terracotta
    ctx.fillRect(0, 0, width, height);

    // 8-pointed star tile grid
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    const step = 45;
    for (let x = 20; x < width; x += step) {
      for (let y = 20; y < height; y += step) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#0284c7';
        // 8-star
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const r = i % 2 === 0 ? 14 : 7;
          const a = (i * Math.PI) / 4;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }
  } else if (style === 'leather') {
    // Traditional engraved Moroccan leather
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Center circular rosette
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (style === 'mint') {
    // Green mint tea diamond pattern
    ctx.fillStyle = '#065f46';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.5;
    const step = 25;
    for (let x = -width; x < width * 2; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(x + height, 0);
      ctx.stroke();
    }
  } else if (style === 'night') {
    // Night sky with golden stars
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#fef08a';
    for (let i = 0; i < 60; i++) {
      const rx = 20 + Math.random() * (width - 40);
      const ry = 20 + Math.random() * (height - 40);
      const r = 1 + Math.random() * 2.5;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Classic woven grey Moroccan Baraja back (as shown in default screenshot)
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#cbd5e1';
    for (let x = 6; x < width - 6; x += 8) {
      for (let y = 6; y < height - 6; y += 8) {
        if ((x + y) % 16 === 0) {
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
  }

  // Common outer border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, width - 12, height - 12);

  return canvas;
}
