export interface FanType {
  id: string;
  name: string;
  description: string;
  baseFrequency: number;
  noiseType: 'white' | 'brown' | 'pink';
  hasVibration: boolean;
}

export interface FanState {
  isOn: boolean;
  speed: 'slow' | 'medium' | 'high';
  selectedFan: string;
  volume: number;
}

export const FAN_TYPES: FanType[] = [
  {
    id: 'table',
    name: 'Table Fan',
    description: 'Classic desktop companion',
    baseFrequency: 280,
    noiseType: 'white',
    hasVibration: false
  },
  {
    id: 'ceiling',
    name: 'Ceiling Fan',
    description: 'Overhead cooling power',
    baseFrequency: 160,
    noiseType: 'brown',
    hasVibration: false
  },
  {
    id: 'rusty',
    name: 'Old Rusty Fan',
    description: 'Vintage charm with character',
    baseFrequency: 140,
    noiseType: 'brown',
    hasVibration: true
  },
  {
    id: 'modern',
    name: 'Modern Designer Fan',
    description: 'Sleek and whisper quiet',
    baseFrequency: 320,
    noiseType: 'pink',
    hasVibration: false
  }
];