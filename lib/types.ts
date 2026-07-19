export interface SpinOption {
  id: string;
  label: string;
  color: string;
}

export interface SpinRecord {
  id: string;
  winner: string;
  color: string;
  at: number; // epoch ms
}
