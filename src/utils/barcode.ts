/**
 * Utilities for rendering official barcodes and QR verification codes
 */

// Simple deterministic Code 128 / Code 39 barcode SVG generator
export function generateBarcodeSvg(value: string, width = 340, height = 50): string {
  // Generate visual bars deterministically based on character codes
  const bars: { x: number; w: number }[] = [];
  let currentX = 10;
  
  // Start guard
  bars.push({ x: currentX, w: 2.5 });
  currentX += 4.5;
  bars.push({ x: currentX, w: 1.5 });
  currentX += 3.5;
  bars.push({ x: currentX, w: 2.5 });
  currentX += 5.5;

  const sanitized = (value || 'CFP-000').toUpperCase().replace(/[^A-Z0-9-]/g, '');

  for (let i = 0; i < sanitized.length; i++) {
    const code = sanitized.charCodeAt(i);
    // Patterns of 4 bars per character
    const b1 = ((code >> 0) & 1) ? 3 : 1.5;
    const b2 = ((code >> 1) & 1) ? 2.5 : 1;
    const b3 = ((code >> 2) & 1) ? 3 : 1.5;
    const b4 = ((code >> 3) & 1) ? 2.5 : 1;

    bars.push({ x: currentX, w: b1 });
    currentX += b1 + 2;
    bars.push({ x: currentX, w: b2 });
    currentX += b2 + 1.5;
    bars.push({ x: currentX, w: b3 });
    currentX += b3 + 2;
    bars.push({ x: currentX, w: b4 });
    currentX += b4 + 2.5;
  }

  // Stop guard
  bars.push({ x: currentX, w: 2.5 });
  currentX += 4;
  bars.push({ x: currentX, w: 1.5 });
  currentX += 3;
  bars.push({ x: currentX, w: 3 });
  currentX += 6;

  const totalWidth = Math.max(width, currentX + 10);

  const rects = bars
    .map(b => `<rect x="${b.x}" y="0" width="${b.w}" height="${height}" fill="#000000" />`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${height + 18}" width="100%" height="${height + 18}">
    <rect width="${totalWidth}" height="${height + 18}" fill="transparent" />
    <g transform="translate(0, 0)">${rects}</g>
    <text x="${totalWidth / 2}" y="${height + 14}" font-family="Courier, monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#111827" letter-spacing="3">* ${sanitized} *</text>
  </svg>`;
}

// Generate realistic 2D Matrix / QR Code SVG for official validation
export function generateQrMatrixSvg(data: string, size = 110): string {
  // Deterministic 21x21 QR-like matrix
  const matrixSize = 21;
  const cellSize = size / matrixSize;
  const cells: { r: number; c: number }[] = [];

  // Seeded hash from data
  let seed = 0;
  for (let i = 0; i < data.length; i++) {
    seed = (seed * 31 + data.charCodeAt(i)) & 0xffffffff;
  }

  // Positioning finder patterns (Top-Left, Top-Right, Bottom-Left 7x7)
  const isFinder = (r: number, c: number) => {
    // Top-Left
    if (r < 7 && c < 7) return true;
    // Top-Right
    if (r < 7 && c >= matrixSize - 7) return true;
    // Bottom-Left
    if (r >= matrixSize - 7 && c < 7) return true;
    return false;
  };

  const getFinderBit = (r: number, c: number, startR: number, startC: number) => {
    const localR = r - startR;
    const localC = c - startC;
    if (localR === 0 || localR === 6 || localC === 0 || localC === 6) return true;
    if (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4) return true;
    return false;
  };

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (r < 7 && c < 7) {
        if (getFinderBit(r, c, 0, 0)) cells.push({ r, c });
      } else if (r < 7 && c >= matrixSize - 7) {
        if (getFinderBit(r, c, 0, matrixSize - 7)) cells.push({ r, c });
      } else if (r >= matrixSize - 7 && c < 7) {
        if (getFinderBit(r, c, matrixSize - 7, 0)) cells.push({ r, c });
      } else if (r === 6 || c === 6) {
        // Timing patterns
        if ((r + c) % 2 === 0) cells.push({ r, c });
      } else {
        // Data bits pseudo-random based on string seed and coordinates
        const bit = ((seed ^ (r * 13 + c * 17)) & (1 << ((r + c) % 16))) !== 0;
        if (bit) cells.push({ r, c });
      }
    }
  }

  const rects = cells
    .map(cell => `<rect x="${(cell.c * cellSize).toFixed(2)}" y="${(cell.r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="#0b192c" />`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="#ffffff" rx="4" />
    <g>${rects}</g>
    <!-- Center logo badge in QR -->
    <rect x="${size * 0.38}" y="${size * 0.38}" width="${size * 0.24}" height="${size * 0.24}" fill="#ffffff" rx="2" stroke="#d97706" stroke-width="1.5" />
    <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.08}" fill="#0f172a" />
    <polygon points="${size / 2 - 2},${size / 2 - 5} ${size / 2 - 6},${size / 2} ${size / 2 - 1},${size / 2} ${size / 2 - 3},${size / 2 + 5} ${size / 2 + 3},${size / 2} ${size / 2},${size / 2}" fill="#fbbf24" />
  </svg>`;
}
