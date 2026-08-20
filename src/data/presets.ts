import { PresetItem } from '../types';
import presetsJson from './presets.json';

export const INITIAL_PRESETS: PresetItem[] = presetsJson as PresetItem[];
export const DEFAULT_PRESETS: PresetItem[] = INITIAL_PRESETS;
