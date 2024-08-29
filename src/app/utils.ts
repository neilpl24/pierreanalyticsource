export function getPlayerPosition(position: string): string {
  switch (position) {
    case 'L':
      return 'LW';
    case 'R':
      return 'RW';
    default:
      return position;
  }
}

export function roundValue(value: number): number {
  return Math.round(value);
}

export function roundDecimal(value: number): number {
  return Math.round(value * 100) / 100;
}
