export interface EquipmentProfile {
  id: string;
  name: string;
  slug: string;
  type: 'all-in-one' | 'traditional' | 'biab' | 'cooler' | 'extract' | 'herms-rims';
  manufacturer?: string;
  model?: string;
  isPreset: boolean;

  // Volumes
  batchVolume: number;        // gallons to fermenter
  boilVolume?: number;        // for extract brewing
  mashTunVolume: number;      // max capacity
  kettleVolume: number;       // max capacity
  fermenterVolume: number;    // max capacity

  // Losses
  boilOffRate: number;        // gal/hr
  trubLoss: number;           // left in kettle
  mashTunDeadSpace: number;   // below false bottom
  grainAbsorption: number;    // gal/lb (typically 0.10-0.12)
  topUpWater?: number;        // for partial boil extract

  // Efficiency
  breweryEfficiency: number;  // overall %
  mashEfficiency: number;     // conversion %

  // Mash
  waterGrainRatio: number;    // qt/lb
  boilTime: number;           // minutes, default 60

  // Equipment specs
  voltage?: '110V' | '120V' | '240V';
  heatingElementWatts?: number;
  hopUtilization?: number;    // adjustment factor, default 100%

  // Meta
  userId?: string;            // null for presets
  createdAt: string;
  updatedAt: string;
}

export type EquipmentPreset = Omit<EquipmentProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
