import { PaletteOption } from '../types';

// Color palettes for different wheel themes
const PALETTES: Record<PaletteOption, string[]> = {
  vibrant: [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFE66D', // Yellow
    '#95E1D3', // Mint
    '#FF99CC', // Pink
    '#6C5CE7', // Purple
    '#00B894', // Green
    '#FFA07A', // Salmon
    '#FF7675', // Red-orange
    '#00CEC9', // Turquoise
  ],
  pastel: [
    '#FFB3BA', // Pastel red
    '#FFFFBA', // Pastel yellow
    '#BAE1FF', // Pastel blue
    '#BAC2FF', // Pastel periwinkle
    '#FFBAFF', // Pastel magenta
    '#BAFFC9', // Pastel green
    '#FFC9BA', // Pastel peach
    '#E0BBE4', // Pastel lavender
    '#FFDFD3', // Pastel coral
    '#B5EAD7', // Pastel mint
  ],
  cool: [
    '#0077BE', // Dark blue
    '#14D9FF', // Cyan
    '#00A8E8', // Blue
    '#00C9FF', // Light cyan
    '#006494', // Navy
    '#468DFF', // Sky blue
    '#4A90E2', // Cornflower
    '#357ABD', // Royal blue
    '#2A9D8F', // Teal
    '#264653', // Dark teal
  ],
  warm: [
    '#E76F51', // Burnt orange
    '#F4A261', // Orange
    '#E9C46A', // Golden
    '#D4A574', // Tan
    '#D18C45', // Brown-orange
    '#C1666B', // Rust
    '#DB6C6C', // Rose
    '#DE8C4E', // Apricot
    '#C99A6E', // Caramel
    '#E4997B', // Peachy
  ],
  rainbow: [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Lime
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#9400D3', // Violet
    '#FF1493', // Deep pink
    '#00CED1', // Dark turquoise
    '#32CD32', // Lime green
  ],
};

/**
 * Get color palette by option name
 */
export function getPalette(option: PaletteOption): string[] {
  return PALETTES[option] || PALETTES.vibrant;
}

/**
 * Get a specific color from a palette
 */
export function getColor(palette: PaletteOption, index: number): string {
  const colors = getPalette(palette);
  return colors[index % colors.length];
}

/**
 * Get all available palette options
 */
export function getAllPaletteOptions(): PaletteOption[] {
  return Object.keys(PALETTES) as PaletteOption[];
}

/**
 * Get human-readable palette name
 */
export function getPaletteName(option: PaletteOption): string {
  const names: Record<PaletteOption, string> = {
    vibrant: 'Vibrant',
    pastel: 'Pastel',
    cool: 'Cool',
    warm: 'Warm',
    rainbow: 'Rainbow',
  };
  return names[option] || option;
}

/**
 * Generate alternating contrast for wheel lights/decorations
 */
export function generateLightColor(baseColor: string): string {
  // Simple lightening algorithm: shift towards white
  // This is a basic implementation; for production, use a color library
  return baseColor; // Simplified - CSS filters could handle this
}

/**
 * Check if a color is light or dark for text contrast
 */
export function isDarkColor(color: string): boolean {
  // Convert hex to RGB and calculate perceived brightness
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

/**
 * Get contrasting text color (white or black) for a background color
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isDarkColor(backgroundColor) ? '#FFFFFF' : '#000000';
}
