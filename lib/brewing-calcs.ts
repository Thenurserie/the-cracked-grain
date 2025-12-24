export interface Fermentable {
  name: string;
  weight: number;
  lovibond: number;
  ppg: number;
  type?: string;
}

export interface Hop {
  name: string;
  weight: number;
  alpha: number;
  time: number;
  use: 'Boil' | 'Dry Hop' | 'Whirlpool';
}

export interface Yeast {
  lab: string;
  name: string;
  attenuation: number;
  type: 'Ale' | 'Lager';
}

export const GRAIN_DATABASE = [
  { name: '2-Row Pale Malt', lovibond: 2, ppg: 37, type: 'Base Malt' },
  { name: '6-Row Pale Malt', lovibond: 2, ppg: 35, type: 'Base Malt' },
  { name: 'Pilsner Malt', lovibond: 1.5, ppg: 37, type: 'Base Malt' },
  { name: 'Maris Otter', lovibond: 3, ppg: 38, type: 'Base Malt' },
  { name: 'Vienna Malt', lovibond: 4, ppg: 36, type: 'Base Malt' },
  { name: 'Munich Malt (10L)', lovibond: 10, ppg: 35, type: 'Base Malt' },
  { name: 'Munich Malt (20L)', lovibond: 20, ppg: 35, type: 'Base Malt' },
  { name: 'Wheat Malt', lovibond: 2, ppg: 38, type: 'Specialty' },
  { name: 'Rye Malt', lovibond: 3, ppg: 29, type: 'Specialty' },
  { name: 'Flaked Oats', lovibond: 2, ppg: 33, type: 'Specialty' },
  { name: 'Caramel 10L', lovibond: 10, ppg: 35, type: 'Crystal' },
  { name: 'Caramel 20L', lovibond: 20, ppg: 35, type: 'Crystal' },
  { name: 'Caramel 40L', lovibond: 40, ppg: 34, type: 'Crystal' },
  { name: 'Caramel 60L', lovibond: 60, ppg: 34, type: 'Crystal' },
  { name: 'Caramel 80L', lovibond: 80, ppg: 34, type: 'Crystal' },
  { name: 'Caramel 120L', lovibond: 120, ppg: 33, type: 'Crystal' },
  { name: 'Chocolate Malt', lovibond: 350, ppg: 34, type: 'Roasted' },
  { name: 'Black Patent', lovibond: 500, ppg: 30, type: 'Roasted' },
  { name: 'Roasted Barley', lovibond: 300, ppg: 25, type: 'Roasted' },
  { name: 'Carafa Special III', lovibond: 470, ppg: 30, type: 'Roasted' },
  { name: 'Honey Malt', lovibond: 25, ppg: 37, type: 'Specialty' },
  { name: 'Victory Malt', lovibond: 28, ppg: 34, type: 'Specialty' },
  { name: 'Biscuit Malt', lovibond: 25, ppg: 35, type: 'Specialty' },
];

export const HOP_DATABASE = [
  { name: 'Cascade', alpha: 5.5, type: 'Aroma' },
  { name: 'Centennial', alpha: 10, type: 'Dual Purpose' },
  { name: 'Chinook', alpha: 13, type: 'Bittering' },
  { name: 'Citra', alpha: 12, type: 'Aroma' },
  { name: 'Columbus', alpha: 15, type: 'Bittering' },
  { name: 'Fuggle', alpha: 4.5, type: 'Aroma' },
  { name: 'Hallertau', alpha: 4, type: 'Aroma' },
  { name: 'Mosaic', alpha: 12.25, type: 'Dual Purpose' },
  { name: 'Saaz', alpha: 3.5, type: 'Aroma' },
  { name: 'Simcoe', alpha: 13, type: 'Dual Purpose' },
  { name: 'Warrior', alpha: 16, type: 'Bittering' },
  { name: 'Amarillo', alpha: 9, type: 'Aroma' },
  { name: 'Galaxy', alpha: 14, type: 'Dual Purpose' },
  { name: 'Nelson Sauvin', alpha: 12, type: 'Aroma' },
];

export const YEAST_DATABASE = [
  { lab: 'Wyeast', name: '1056 American Ale', attenuation: 75, type: 'Ale' },
  { lab: 'Wyeast', name: '1968 London ESB', attenuation: 70, type: 'Ale' },
  { lab: 'Wyeast', name: '2565 Kölsch', attenuation: 75, type: 'Ale' },
  { lab: 'White Labs', name: 'WLP001 California Ale', attenuation: 76, type: 'Ale' },
  { lab: 'White Labs', name: 'WLP002 English Ale', attenuation: 68, type: 'Ale' },
  { lab: 'White Labs', name: 'WLP029 German Ale/Kölsch', attenuation: 74, type: 'Ale' },
  { lab: 'Safale', name: 'US-05', attenuation: 78, type: 'Ale' },
  { lab: 'Safale', name: 'S-04', attenuation: 75, type: 'Ale' },
  { lab: 'Saflager', name: 'W-34/70', attenuation: 83, type: 'Lager' },
];

export function calculateOG(fermentables: Fermentable[], batchSize: number, efficiency: number): number {
  const totalPoints = fermentables.reduce((sum, grain) => {
    return sum + (grain.weight * grain.ppg * (efficiency / 100));
  }, 0);

  const og = 1 + (totalPoints / batchSize / 1000);
  return Math.round(og * 1000) / 1000;
}

export function calculateFG(og: number, attenuation: number): number {
  const points = (og - 1) * 1000;
  const fermentedPoints = points * (attenuation / 100);
  const fg = 1 + ((points - fermentedPoints) / 1000);
  return Math.round(fg * 1000) / 1000;
}

export function calculateABV(og: number, fg: number): number {
  const abv = (og - fg) * 131.25;
  return Math.round(abv * 10) / 10;
}

export function calculateIBU(hops: Hop[], batchSize: number, og: number): number {
  const totalIBU = hops.reduce((sum, hop) => {
    if (hop.use !== 'Boil') return sum;

    const utilization = calculateUtilization(hop.time, og);
    const aau = hop.weight * hop.alpha;
    const ibu = (aau * utilization * 7490) / batchSize;

    return sum + ibu;
  }, 0);

  return Math.round(totalIBU * 10) / 10;
}

function calculateUtilization(time: number, og: number): number {
  const bignessFactor = 1.65 * Math.pow(0.000125, og - 1);
  const timeFactor = (1 - Math.exp(-0.04 * time)) / 4.15;
  return bignessFactor * timeFactor;
}

export function calculateSRM(fermentables: Fermentable[], batchSize: number): number {
  const mcu = fermentables.reduce((sum, grain) => {
    return sum + (grain.weight * grain.lovibond / batchSize);
  }, 0);

  const srm = 1.4922 * Math.pow(mcu, 0.6859);
  return Math.round(srm * 10) / 10;
}

export function calculateStrikeTemp(grainTemp: number, targetTemp: number, ratio: number): number {
  const strikeTemp = (0.2 / ratio) * (targetTemp - grainTemp) + targetTemp;
  return Math.round(strikeTemp * 10) / 10;
}

export function calculateMashWater(grainWeight: number, ratio: number): number {
  return Math.round(grainWeight * ratio * 10) / 10;
}

export function calculateSpargeWater(
  batchSize: number,
  boilTime: number,
  evaporationRate: number,
  mashWater: number,
  grainAbsorption: number
): number {
  const postBoilVolume = batchSize;
  const preBoilVolume = postBoilVolume + (evaporationRate * (boilTime / 60));
  const spargeWater = preBoilVolume - (mashWater - grainAbsorption);
  return Math.round(spargeWater * 10) / 10;
}

export function calculatePrimingSugar(
  batchSize: number,
  co2Volume: number,
  sugarType: string
): number {
  const co2InBeer = 0.5;
  const co2Needed = (co2Volume - co2InBeer) * batchSize * 2;

  const sugarFactors: { [key: string]: number } = {
    'Corn Sugar': 1.0,
    'Table Sugar': 0.91,
    'DME': 1.33,
    'Honey': 1.25,
    'Belgian Candy': 1.11,
  };

  const factor = sugarFactors[sugarType] || 1.0;
  const sugar = co2Needed * factor;

  return Math.round(sugar * 100) / 100;
}

export function calculateYeastCells(
  batchSize: number,
  og: number,
  yeastType: 'Ale' | 'Lager'
): number {
  const pitchRate = yeastType === 'Lager' ? 1.5 : 0.75;
  const gravity = (og - 1) * 1000;
  const cellsNeeded = pitchRate * gravity * (batchSize * 3.78541);

  return Math.round(cellsNeeded / 1000000000);
}

export function correctHydrometer(
  reading: number,
  sampleTemp: number,
  calibrationTemp: number = 60
): number {
  const correction = 1.00130346 *
    Math.pow(0.9999994, calibrationTemp) /
    Math.pow(0.9999994, sampleTemp);

  const correctedSG = reading * correction;
  return Math.round(correctedSG * 1000) / 1000;
}

export function brixToSG(brix: number): number {
  const sg = (brix / (258.6 - ((brix / 258.2) * 227.1))) + 1;
  return Math.round(sg * 1000) / 1000;
}

export function calculateKegPSI(temp: number, co2Volume: number): number {
  const psi = -16.6999 -
    0.0101059 * temp +
    0.00116512 * Math.pow(temp, 2) +
    0.173354 * temp * co2Volume +
    4.24267 * co2Volume -
    0.0684226 * Math.pow(co2Volume, 2);

  return Math.round(psi * 10) / 10;
}

export function calculateDilution(
  currentVolume: number,
  currentGravity: number,
  targetGravity: number
): { waterToAdd: number; finalVolume: number } {
  const currentPoints = (currentGravity - 1) * 1000 * currentVolume;
  const finalVolume = currentPoints / ((targetGravity - 1) * 1000);
  const waterToAdd = finalVolume - currentVolume;

  return {
    waterToAdd: Math.round(waterToAdd * 100) / 100,
    finalVolume: Math.round(finalVolume * 100) / 100,
  };
}

export function calculateCalciumAddition(
  volume: number,
  currentCalcium: number,
  targetCalcium: number,
  additionType: 'Gypsum' | 'Calcium Chloride'
): number {
  const calciumNeeded = targetCalcium - currentCalcium;
  const factor = additionType === 'Gypsum' ? 61.5 : 72.0;
  const grams = (calciumNeeded * volume * 3.78541) / factor;

  return Math.round(grams * 10) / 10;
}

// Brix Converter - SG to Brix
export function sgToBrix(sg: number): number {
  const brix = (((182.4601 * sg - 775.6821) * sg + 1262.7794) * sg - 669.5622);
  return Math.round(brix * 10) / 10;
}

// Chaptalization Calculator (for wine)
export function calculateChaptalization(
  currentBrix: number,
  targetBrix: number,
  volumeGallons: number
): number {
  const sugarOz = volumeGallons * (targetBrix - currentBrix) * 1.5;
  return Math.round(sugarOz * 10) / 10;
}

// LME/DME Conversion
export function convertLMEtoDME(lmePounds: number): number {
  return Math.round(lmePounds * 0.8 * 100) / 100;
}

export function convertDMEtoLME(dmePounds: number): number {
  return Math.round(dmePounds * 1.25 * 100) / 100;
}

// Extract to Grain Conversion
export function convertExtractToGrain(
  extractPounds: number,
  extractType: 'LME' | 'DME',
  efficiency: number
): number {
  // LME PPG = 37, DME PPG = 44, Base grain average PPG = 37
  const extractPPG = extractType === 'LME' ? 37 : 44;
  const grainPPG = 37;

  // Account for efficiency
  const grainPounds = (extractPounds * extractPPG) / (grainPPG * (efficiency / 100));
  return Math.round(grainPounds * 100) / 100;
}

// Brewhouse Efficiency Calculator
export function calculateBrewhouseEfficiency(
  grainWeight: number,
  actualOG: number,
  batchSize: number,
  averagePPG: number = 37
): { efficiency: number; actualPPG: number } {
  const potentialPoints = grainWeight * averagePPG;
  const actualPoints = (actualOG - 1) * 1000 * batchSize;
  const efficiency = (actualPoints / potentialPoints) * 100;
  const actualPPG = actualPoints / (grainWeight * batchSize);

  return {
    efficiency: Math.round(efficiency * 10) / 10,
    actualPPG: Math.round(actualPPG * 10) / 10
  };
}

// Quick Infusion Calculator (for step mashing)
export function calculateQuickInfusion(
  currentTemp: number,
  targetTemp: number,
  grainWeight: number,
  currentWaterVolume: number,
  boilingWaterTemp: number = 212
): number {
  // Wa = (T2-T1)(0.2G + W1) / (Tw - T2)
  const waterToAdd =
    ((targetTemp - currentTemp) * (0.2 * grainWeight + currentWaterVolume)) /
    (boilingWaterTemp - targetTemp);

  return Math.round(waterToAdd * 100) / 100;
}

// Bottling Calculator
export function calculateBottles(batchSizeGallons: number): {
  bottles12oz: number;
  bottles16oz: number;
  bottles22oz: number;
  bottles750ml: number;
  bottles500ml: number;
} {
  const totalOz = batchSizeGallons * 128;

  return {
    bottles12oz: Math.floor(totalOz / 12),
    bottles16oz: Math.floor(totalOz / 16),
    bottles22oz: Math.floor(totalOz / 22),
    bottles750ml: Math.floor(totalOz / 25.36),
    bottles500ml: Math.floor(totalOz / 16.9)
  };
}

// Gyle/Krausen Priming Calculator
export function calculateGylePriming(
  batchSizeGallons: number,
  gyleOG: number,
  targetCO2Volumes: number
): number {
  // CO2 produced per gravity point: ~0.5 volumes per 1 gravity point per gallon
  const co2Needed = targetCO2Volumes * batchSizeGallons;
  const gravityPoints = (gyleOG - 1) * 1000;
  const gyleGallons = co2Needed / (gravityPoints * 0.5);

  return Math.round(gyleGallons * 100) / 100;
}

export function exportBeerXML(recipe: any): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<RECIPES>
  <RECIPE>
    <NAME>${recipe.name}</NAME>
    <VERSION>1</VERSION>
    <TYPE>All Grain</TYPE>
    <BREWER>Brewing Tools</BREWER>
    <BATCH_SIZE>${recipe.batchSize}</BATCH_SIZE>
    <BOIL_SIZE>${recipe.batchSize * 1.3}</BOIL_SIZE>
    <BOIL_TIME>${recipe.boilTime}</BOIL_TIME>
    <EFFICIENCY>${recipe.efficiency}</EFFICIENCY>
    <STYLE>
      <NAME>${recipe.style || 'Unknown'}</NAME>
      <CATEGORY>Unknown</CATEGORY>
      <VERSION>1</VERSION>
      <CATEGORY_NUMBER>0</CATEGORY_NUMBER>
      <STYLE_LETTER>A</STYLE_LETTER>
      <STYLE_GUIDE>BJCP</STYLE_GUIDE>
      <TYPE>Ale</TYPE>
    </STYLE>
    <FERMENTABLES>
      ${recipe.fermentables?.map((f: Fermentable) => `
      <FERMENTABLE>
        <NAME>${f.name}</NAME>
        <VERSION>1</VERSION>
        <TYPE>${f.type || 'Grain'}</TYPE>
        <AMOUNT>${f.weight * 0.453592}</AMOUNT>
        <YIELD>${(f.ppg / 46) * 100}</YIELD>
        <COLOR>${f.lovibond}</COLOR>
      </FERMENTABLE>`).join('')}
    </FERMENTABLES>
    <HOPS>
      ${recipe.hops?.map((h: Hop) => `
      <HOP>
        <NAME>${h.name}</NAME>
        <VERSION>1</VERSION>
        <ALPHA>${h.alpha}</ALPHA>
        <AMOUNT>${h.weight * 0.0283495}</AMOUNT>
        <USE>${h.use}</USE>
        <TIME>${h.time}</TIME>
      </HOP>`).join('')}
    </HOPS>
    <YEASTS>
      <YEAST>
        <NAME>${recipe.yeast?.name || 'Unknown'}</NAME>
        <VERSION>1</VERSION>
        <TYPE>${recipe.yeast?.type || 'Ale'}</TYPE>
        <FORM>Liquid</FORM>
        <AMOUNT>0.035</AMOUNT>
        <ATTENUATION>${recipe.yeast?.attenuation || 75}</ATTENUATION>
      </YEAST>
    </YEASTS>
    <OG>${recipe.og}</OG>
    <FG>${recipe.fg}</FG>
    <IBU>${recipe.ibu}</IBU>
    <COLOR>${recipe.srm}</COLOR>
    <ABV>${recipe.abv}</ABV>
    <NOTES>${recipe.notes || ''}</NOTES>
  </RECIPE>
</RECIPES>`;
}
