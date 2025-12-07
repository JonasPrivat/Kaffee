export type BasketSize = '1er' | '2er';

export interface Shot {
  id: string;
  date: string; // ISO timestamp
  bean: string;
  roastery?: string;
  dose: number;
  grindSize: string;
  tamp?: string;
  brewTime: number;
  output: number;
  temperature: number;
  machine: string;
  basket: BasketSize;
  tastingNotes: string;
  tastingTags: string[];
  expectedProfile: string;
}

export interface ShotImportFile {
  version: 1;
  shots: Shot[];
}
