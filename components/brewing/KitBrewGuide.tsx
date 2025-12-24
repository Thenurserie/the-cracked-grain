'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const KIT_BREW_GUIDES = [
  {
    title: 'Extract Brew Day SOP',
    difficulty: 'Beginner',
    content: `## Pre-Brew Setup (1 hour before)

### Sanitization Station
1. **Star San Solution**: Mix 1 oz Star San per 5 gallons water in spray bottle
2. **Sanitize all contact equipment**:
   - Fermenter and lid
   - Airlock and stopper
   - Hydrometer and test jar
   - Stirring spoon
   - Auto-siphon or transfer equipment
3. Keep sanitized items on clean surface until use

### Ingredient Prep
- **Specialty Grains** (if included):
  - Crush grains if whole (or buy pre-crushed)
  - Place in grain bag
- **Malt Extract**:
  - Liquid extract: Warm jar in hot water for easier pouring
  - Dry extract: Measure out full amount
- **Hops**: Separate into additions by time
- **Yeast**: If liquid, remove from fridge 1-2 hours before pitching

---

## Brew Day Process

### Step 1: Steep Specialty Grains (if applicable)
**Time**: 20-30 minutes
**Equipment**: 3+ gallon pot, thermometer, grain bag

1. **Heat Strike Water**:
   - Add 2-3 gallons water to pot
   - Heat to 160-170°F (71-77°C)
   - **Do not boil** - too hot extracts tannins

2. **Steep Grains**:
   - Add grain bag to water
   - Maintain 150-160°F for 20-30 minutes
   - Gently dunk bag occasionally
   - **Don't squeeze bag** when removing

3. **Remove & Rinse**:
   - Lift bag out, let drain
   - Optional: Gently rinse with 1 quart 170°F water
   - Discard grains

---

### Step 2: The Boil
**Time**: 60-90 minutes (recipe dependent)
**Equipment**: Large pot (5+ gallons for 5-gal batch)

1. **Add Extract**:
   - **REMOVE FROM HEAT** before adding extract
   - Add water to reach ~3 gallons
   - Stir in malt extract completely
   - **Liquid extract**: Pour slowly, stir constantly
   - **Dry extract**: Sprinkle while stirring to avoid clumping

2. **Bring to Boil**:
   - Return to heat
   - Stir occasionally to prevent scorching
   - Watch for hot break (protein foam)
   - **Boilover Prevention**:
     - Keep lid off or tilted
     - Reduce heat if foam rises
     - Have spray bottle ready

3. **Hop Additions**:
   - **Start timer when boil begins**
   - Add hops per schedule:
     - 60 min = bittering hops
     - 15 min = flavor hops
     - 5 min = aroma hops
     - 0 min (flameout) = late aroma
   - Use hop bag for easy removal (optional)

4. **Late Extract Addition** (optional but recommended):
   - Add only 50% extract at start
   - Add remaining 50% at 15 minutes left
   - Benefits: Better hop utilization, lighter color

---

### Step 3: Cooling the Wort
**Time**: 30-60 minutes
**Goal**: Cool to 65-75°F as fast as possible

**Method 1: Ice Bath** (no equipment needed)
1. Place brew pot in sink or large tub
2. Fill with ice and cold water around pot
3. Stir wort gently (sanitized spoon)
4. Replace ice/water as it warms
5. Takes 30-60 minutes

**Method 2: Wort Chiller** (faster, recommended)
1. Immersion chiller: Place in boil last 15 min to sanitize
2. At flameout, run cold water through chiller
3. Stir wort gently
4. Takes 10-20 minutes

**Safety**: Keep covered during cooling to prevent contamination

---

### Step 4: Transfer to Fermenter
**Time**: 15 minutes

1. **Sanitize Everything**:
   - Fermenter, lid, airlock, stopper
   - Funnel or auto-siphon
   - Hydrometer and test jar

2. **Add Water to Fermenter**:
   - If brewing 5-gal batch but boiled 3 gal
   - Add 2 gallons cold water to fermenter
   - Provides cooling and aeration

3. **Transfer Wort**:
   - Pour through sanitized funnel, or
   - Use auto-siphon to transfer
   - **Leave trub behind** (sediment in pot)
   - Pour from height to aerate (splashing is good here)

4. **Top Up**:
   - Add water to reach target volume (5 gal)
   - Use cold water to help reach pitching temp

---

### Step 5: Take Original Gravity Reading
**Time**: 5 minutes
**Why**: Determines potential alcohol, tracks fermentation

1. **Sanitize** hydrometer and test jar
2. **Fill test jar** with wort sample
3. **Float hydrometer**, spin to remove bubbles
4. **Read at eye level** where liquid surface crosses scale
5. **Record OG**: Example: 1.050
6. **Temperature correction**:
   - Most hydrometers calibrated for 60°F
   - Warmer wort reads lower (add ~0.001 per 10°F)
   - Use online calculator for precision

---

### Step 6: Pitch Yeast
**Time**: 5 minutes
**Critical**: Proper pitching temperature

1. **Check Temperature**:
   - **Ale yeast**: 65-75°F ideal
   - **Lager yeast**: 50-55°F ideal
   - Too hot kills yeast
   - Too cold = slow start

2. **Pitch Yeast**:
   - **Dry yeast**: Sprinkle on top, or
   - **Rehydrate** first (10 min in warm water)
   - **Liquid yeast**: Pour directly in
   - Stir gently or shake fermenter

3. **Seal Fermenter**:
   - Install stopper and airlock
   - Fill airlock halfway with Star San or vodka
   - Ensure tight seal

---

### Step 7: Fermentation Storage
**Time**: 2-3 weeks

1. **Primary Fermentation**:
   - Place in temperature-controlled area
   - **Ales**: 65-72°F
   - **Lagers**: 48-55°F
   - Avoid temperature swings
   - Keep out of direct sunlight

2. **Timeline**:
   - **12-36 hours**: Airlock activity begins
   - **2-4 days**: Vigorous fermentation (rapid bubbling)
   - **1-2 weeks**: Fermentation slows
   - **2-3 weeks**: Fermentation complete

3. **When is it Done?**:
   - Airlock bubbles every 1+ minutes
   - Same gravity reading 2-3 days in a row
   - Typical final gravity: 1.008-1.015
   - **Don't rush** - let yeast clean up

---

## Troubleshooting

### No Airlock Activity After 48 Hours
- **Check seal** on fermenter lid
- **Temperature** may be too cold
- **Yeast viability** - old or dead yeast
- **Wait longer** - sometimes takes 72 hours

### Vigorous Fermentation Overflow
- **Blowoff tube**: Replace airlock with tube into jar of sanitizer
- **Reduce headspace** next time (use larger fermenter)
- **Temperature control** - too warm speeds fermentation

### Stuck Fermentation (stopped too early)
- **Temperature**: Raise 5°F to wake up yeast
- **Rouse yeast**: Gently swirl fermenter
- **Pitch more yeast** if gravity is still high
- **Wait**: Sometimes just needs more time

### Off-Flavors Prevention
- **Hot side aeration**: Don't splash hot wort
- **Oxidation**: Don't splash post-fermentation
- **Temperature control**: Most important factor
- **Sanitation**: Clean and sanitize everything

---

## Equipment Checklist

### Essential
- [ ] 5+ gallon brew pot
- [ ] Fermenter with airlock
- [ ] Long stir spoon
- [ ] Thermometer
- [ ] Hydrometer and test jar
- [ ] Sanitizer (Star San)
- [ ] Auto-siphon or racking cane

### Recommended
- [ ] Wort chiller
- [ ] Fermentation temperature control
- [ ] Yeast starter equipment
- [ ] Grain bag (for steeping)
- [ ] Timer

### Nice to Have
- [ ] Refractometer
- [ ] pH meter
- [ ] Digital scale
- [ ] Hop spider
- [ ] Brew kettle with volume markings

---

## Timeline Summary

| Step | Time | Temperature |
|------|------|-------------|
| Sanitization | 15 min | - |
| Steep grains | 30 min | 150-160°F |
| Boil | 60 min | 212°F |
| Cool | 30-45 min | 212→70°F |
| Transfer | 15 min | - |
| Pitch yeast | 5 min | 65-75°F |
| **Total brew day** | **~3 hours** | |
| Primary fermentation | 2-3 weeks | 65-72°F |

---

## Next Steps

After fermentation is complete:
1. **Take Final Gravity** reading
2. **Calculate ABV**: (OG - FG) × 131.25
3. **Proceed to Bottling** or kegging
4. **Condition** for 2-4 weeks before drinking

**See**: Bottling Day guide for packaging instructions
`
  },
  {
    title: 'Fermentation Guide',
    difficulty: 'Beginner',
    content: `## Understanding Fermentation

Fermentation is where yeast converts sugars into alcohol and CO2. Proper fermentation technique is crucial for great beer.

### The Fermentation Process

**Primary Fermentation (1-2 weeks)**
- Yeast multiplies and consumes fermentable sugars
- Most vigorous in first 3-5 days
- Temperature control is critical
- Produces most of the alcohol

**Secondary Fermentation (optional, 1-2 weeks)**
- Yeast continues to clean up byproducts
- Beer clarifies as yeast settles
- Additional flavors mellow and blend
- Not always necessary for simple beers

---

## Temperature Control

**Why Temperature Matters**:
- **Too Warm** (>75°F for ales):
  - Fruity esters (banana, pear)
  - Fusel alcohols (hot, solvent-like)
  - Fast fermentation = less clean flavor

- **Too Cold** (<60°F for ales):
  - Sluggish or stuck fermentation
  - Yeast goes dormant
  - Underattenuated beer (too sweet)

- **Just Right**:
  - **Ales**: 65-72°F (18-22°C)
  - **Lagers**: 48-55°F (9-13°C)
  - **Belgian**: 68-78°F (20-26°C)
  - **Wheat**: 64-70°F (18-21°C)

**Temperature Control Methods**:
1. **Swamp Cooler** (cheap, effective):
   - Place fermenter in tub of water
   - Add frozen water bottles
   - Evaporative cooling with wet t-shirt
   - Can maintain 5-10°F below ambient

2. **Fermentation Chamber** (best option):
   - Modified refrigerator or freezer
   - Temperature controller (Inkbird, STC-1000)
   - Heating belt or wrap for cold climates
   - Maintains ±2°F precision

3. **Cool Basement** (free if you have it):
   - Naturally 60-65°F year-round
   - Perfect for ales
   - May need supplemental heat in winter

---

## Fermentation Timeline

### Days 1-3: Lag Phase
- **What's happening**: Yeast is multiplying
- **What you see**: Little to no airlock activity
- **Normal duration**: 6-48 hours
- **What to do**: Nothing! Be patient

**Troubleshooting Slow Start**:
- Yeast may be old or underpitched
- Temperature may be too low
- Give it 72 hours before worrying
- Consider making yeast starter next time

---

### Days 3-7: Active Fermentation
- **What's happening**: Rapid sugar consumption
- **What you see**:
  - Vigorous airlock activity (bubbles every few seconds)
  - Thick krausen (foam) on top
  - Bubbling, churning wort
- **What to do**:
  - Maintain temperature
  - Don't open fermenter!
  - Monitor for blowoff

**Blowoff Prevention**:
- If krausen threatens to clog airlock
- Replace airlock with blowoff tube
- Run tube into jar of sanitizer
- Common with wheat beers and high-gravity beers

---

### Days 7-14: Slow Fermentation
- **What's happening**: Yeast finishes sugars, starts cleanup
- **What you see**:
  - Airlock activity slows (every 1-2 minutes)
  - Krausen starts to fall
  - Beer begins to clear
- **What to do**:
  - Keep at fermentation temperature
  - Don't rush! Let yeast finish cleanup
  - Resist urge to bottle early

---

### Days 14-21: Maturation
- **What's happening**:
  - Yeast consumes off-flavors (diacetyl, acetaldehyde)
  - Yeast flocculates (settles)
  - Flavors meld and mellow
- **What you see**:
  - No airlock activity
  - Clear(er) beer
  - Yeast cake at bottom
- **What to do**:
  - Take gravity readings to confirm completion
  - 2-3 identical readings = done
  - Can bottle/keg when stable

---

## Taking Gravity Readings

### When to Measure
- **Original Gravity (OG)**: Before pitching yeast
- **Final Gravity (FG)**: When fermentation appears complete
- **Confirm FG**: Take second reading 2-3 days later

### How to Measure
1. **Sanitize** hydrometer and test jar
2. **Draw sample** with sanitized wine thief or turkey baster
3. **Fill test jar** to 1" from top
4. **Float hydrometer**, spin to remove bubbles
5. **Read at liquid surface** at eye level
6. **Record** the number (e.g., 1.012)
7. **Don't return sample** to fermenter

### Calculating ABV
**Formula**: ABV% = (OG - FG) × 131.25

**Example**:
- OG: 1.052
- FG: 1.012
- ABV = (1.052 - 1.012) × 131.25 = **5.25%**

### Interpreting Results

**Target Final Gravity**:
- **Dry beer**: 1.006-1.010 (high attenuation)
- **Balanced**: 1.010-1.014 (medium)
- **Sweet/Full**: 1.014-1.020 (low attenuation)
- **High gravity**: 1.020-1.030+ (barleywines, imperials)

**If FG is Higher Than Expected**:
- May be normal for recipe
- Check mash temperature (all-grain)
- Yeast may need more time
- Temperature may have been too low
- Consider yeast attenuation characteristics

---

## Common Fermentation Issues

### Stuck Fermentation
**Symptoms**: Fermentation stops before target FG
**Causes**:
- Temperature dropped
- Insufficient yeast
- High mash temperature (all-grain)
- Low oxygen at pitch

**Solutions**:
1. **Rouse the yeast**: Gently swirl fermenter
2. **Raise temperature** 5°F
3. **Pitch fresh yeast** (rehydrate dry yeast)
4. **Wait longer** - sometimes just slow

---

### Slow Fermentation
**Symptoms**: Takes >3 days to start
**Causes**:
- Underpitching (not enough yeast)
- Old/weak yeast
- Too cold

**Prevention**:
- Use fresh yeast
- Proper pitch rate (check calculator)
- Make yeast starter for high-gravity beers
- Oxygenate wort well

---

### Off-Flavors from Fermentation

**Diacetyl (butter, butterscotch)**:
- Cause: Rushed fermentation, too cold
- Prevention: Full 2-week fermentation, diacetyl rest
- Fix: Raise temp to 68°F for 2-3 days before packaging

**Acetaldehyde (green apple, paint)**:
- Cause: Beer bottled too young
- Prevention: Patience! Extra week of conditioning
- Fix: More time will reduce it

**Fusel Alcohols (hot, solventy)**:
- Cause: Too hot fermentation
- Prevention: Stay in yeast's temp range
- Fix: Aging helps, but prevention is key

**Phenolic (band-aid, plastic)**:
- Cause: Wild yeast contamination, chlorine in water
- Prevention: Sanitation, use filtered/carbon-filtered water
- Fix: Can't fix, must dump batch

---

## Advanced Techniques

### Yeast Starter
**When**: High-gravity beers (OG >1.060), old liquid yeast
**Why**: Ensures healthy fermentation start
**How**:
1. Make 1-2L of 1.040 wort (DME + water)
2. Cool to 70°F, pitch yeast
3. Stir on stir plate 24-48 hours
4. Chill, decant liquid, pitch slurry

### Dry Hopping
**When**: Days 12-14 of fermentation
**Why**: Maximum aroma, minimal bitterness
**How**:
1. Sanitize hops (in sealed bag, spray with Star San)
2. Open fermenter quickly
3. Drop hops in (pellets or whole)
4. Reseal immediately
5. Leave 3-5 days
6. Bottle/keg (hops will settle)

### Diacetyl Rest (Lagers)
**When**: End of primary fermentation
**Why**: Reduces buttery off-flavor
**How**:
1. Ferment lager at 50°F for 1-2 weeks
2. When near FG, raise to 65°F
3. Hold for 2-3 days
4. Chill to lagering temp (35°F)

### Temperature Ramp
**When**: Belgian beers, saisons
**Why**: Enhance ester production
**How**:
1. Start fermentation at low end (65°F)
2. After 3-4 days, raise 2°F per day
3. Finish at 75-78°F
4. Creates complex fruit flavors

---

## Fermentation Checklist

### Pre-Pitch
- [ ] Sanitize fermenter, airlock, stopper
- [ ] Aerate/oxygenate wort
- [ ] Cool wort to pitch temperature
- [ ] Take OG reading
- [ ] Pitch proper amount of healthy yeast

### During Fermentation
- [ ] Maintain proper temperature (±2°F)
- [ ] Monitor airlock activity
- [ ] Use blowoff tube if needed
- [ ] Keep fermenter in dark place
- [ ] Don't open fermenter unnecessarily

### End of Fermentation
- [ ] Take FG reading when airlock is quiet
- [ ] Confirm with second reading 2-3 days later
- [ ] Calculate ABV
- [ ] Proceed to packaging when stable

---

## Storage Conditions

**During Fermentation**:
- Maintain yeast's preferred temperature
- Avoid direct sunlight (causes skunking)
- Minimize temperature swings
- Keep in clean area (prevents contamination)

**Cold Crashing (optional)**:
- After fermentation complete
- Chill to 35-40°F for 2-3 days
- Yeast and sediment drop out
- Clearer beer
- Add gelatin for extra clarity

---

## Signs of Problems

**Call for Action**:
- ❌ **No activity after 72 hours**: Check temperature, pitch more yeast
- ❌ **Film on surface**: Possible infection (wait and see if it develops)
- ❌ **Vinegar smell**: Acetobacter infection, batch likely ruined
- ❌ **Rotten egg smell**: Some yeast strains produce H2S (usually fades)

**Normal Variations**:
- ✅ Fruity smells during active fermentation
- ✅ Sulfur smell (fades with time)
- ✅ Different krausen shapes/colors
- ✅ Fermentation finishing in 5 days vs 14 days

---

## Summary

**Keys to Great Fermentation**:
1. **Pitch healthy yeast** at proper rate
2. **Control temperature** throughout
3. **Be patient** - don't rush
4. **Take gravity readings** to confirm completion
5. **Sanitize everything** that touches beer post-boil

**Next Steps**: Once FG is stable, proceed to Bottling or Kegging!
`
  },
  {
    title: 'Bottling Day',
    difficulty: 'Beginner',
    content: `## Pre-Bottling Preparation

### Timeline
- **2 weeks minimum** after brew day
- Fermentation must be complete (stable gravity readings)
- **Cold crash** 2-3 days before (optional but recommended)

### Equipment Checklist
- [ ] ~50 bottles (12 oz) or ~25 (22 oz) for 5-gallon batch
- [ ] Bottle caps (new, never reuse)
- [ ] Bottle capper (wing or bench style)
- [ ] Bottling bucket with spigot
- [ ] Bottle filler wand (spring-tip)
- [ ] Auto-siphon or racking cane with tubing
- [ ] Sanitizer (Star San)
- [ ] Priming sugar (corn sugar/dextrose)
- [ ] Small pot for boiling priming solution
- [ ] Hydrometer (for FG confirmation)

---

## Step 1: Confirm Fermentation is Complete
**Time**: 10 minutes
**Critical**: Do not skip this step

### How to Confirm
1. **Take gravity reading** with sanitized hydrometer
2. **Wait 2-3 days**, take another reading
3. **Identical readings** = fermentation complete
4. **Still dropping** = wait longer, check again

### Target Final Gravity
- **Most ales**: 1.008-1.014
- **Light beers**: 1.006-1.010
- **Big beers**: 1.016-1.024
- Check recipe for target FG

**⚠️ WARNING**: Bottling before fermentation is complete = bottle bombs (dangerous!)

---

## Step 2: Prepare & Sanitize Bottles
**Time**: 45-60 minutes
**Most time-consuming step**

### Cleaning Bottles

**If Reusing Bottles**:
1. **Rinse immediately** after drinking (prevents crust)
2. **Inspect each bottle** for:
   - Mold or film inside
   - Cracks or chips on rim
   - Discard any questionable bottles
3. **Wash thoroughly**:
   - Hot soapy water + bottle brush
   - Rinse well (no soap residue)
   - Or run through dishwasher (no detergent, heat dry)

**If Using New Bottles**:
- Still rinse to remove dust
- Inspect for defects

### Sanitizing Bottles

**Method 1: Star San (No-Rinse)**
1. Mix Star San per instructions (1 oz per 5 gal)
2. Fill each bottle with sanitizer
3. Let sit 2 minutes
4. Drain bottles upside down on sanitized surface
5. Can reuse sanitizer solution for multiple bottles

**Method 2: Oven Sanitization**
1. Preheat oven to 350°F
2. Place clean bottles on baking sheet
3. Heat for 20 minutes
4. Let cool before filling (warm is ok)
5. Cover with foil until ready

**⚠️ DO NOT use bleach** (hard to rinse completely)

---

## Step 3: Make Priming Sugar Solution
**Time**: 15 minutes
**Purpose**: Provides sugar for carbonation in bottle

### Calculating Priming Sugar

**Standard Amount** (for 5 gallons):
- **Corn Sugar (Dextrose)**: 5 oz (¾ cup) - most common
- **Table Sugar (Sucrose)**: 4.5 oz (⅔ cup)
- **Dry Malt Extract**: 6 oz (1 cup)

**Adjust for Style**:
- **British ales**: 3-4 oz (lower carbonation)
- **American ales**: 5 oz (medium)
- **Belgian, Wheat, IPAs**: 6-7 oz (higher)

**Use a Calculator**: [Northern Brewer's calculator](https://www.northernbrewer.com/apps/priming-sugar-calculator)

### Boiling the Priming Solution

1. **Measure sugar** into small pot
2. **Add 1-2 cups water**
3. **Bring to boil**, stir to dissolve
4. **Boil 5 minutes** (sanitizes solution)
5. **Cool to room temperature**
6. **Keep covered** until use

---

## Step 4: Transfer Beer to Bottling Bucket
**Time**: 20 minutes
**Goal**: Mix beer with priming sugar without oxidation

### Setup
1. **Sanitize**:
   - Bottling bucket and lid
   - Auto-siphon and tubing
   - Stirring spoon
2. **Position fermenter** on table/counter
3. **Place bottling bucket** on floor below
4. **Gravity does the work!**

### Transfer Process

1. **Add priming solution** to empty bottling bucket first

2. **Siphon beer** from fermenter:
   - Start auto-siphon
   - Keep tip below surface to avoid splashing
   - **Stop before trub** (sediment at bottom)
   - Losing ½-1 cup beer to trub is normal

3. **Gentle mixing**:
   - Priming solution mixes as beer flows in
   - **Option 1**: Let it mix naturally (gentler)
   - **Option 2**: Very gentle stir with sanitized spoon
   - **Avoid splashing** (oxygen = stale beer)

**Expected Volume**:
- Started with 5 gallons
- Loss to trub + samples = ~4.75 gallons (~48 bottles)

---

## Step 5: Fill Bottles
**Time**: 30-45 minutes
**Repetitive but meditative**

### Setup
1. **Position bottling bucket** on table/counter
2. **Attach bottle filler** to spigot via tubing
3. **Stage sanitized bottles** within reach
4. **Have caps ready** in sanitizer

### Filling Process

1. **Open spigot** slightly to prime tube (fill with beer)
2. **Insert bottle filler** into bottle:
   - Push down on bottle bottom
   - Spring-tip opens, beer flows
   - Fill to 1" from top
   - Lift filler - flow stops
   - Filler displacement = perfect headspace

3. **Repeat** for all bottles:
   - Production line is efficient
   - Fill several, then cap several
   - Or fill and cap one at a time

**Headspace Importance**:
- **1 inch from top** when filler is removed
- Too little space = gushers
- Too much = oxidation

---

## Step 6: Cap Bottles
**Time**: 15-20 minutes

### Capping Process

1. **Place cap** on bottle:
   - Sanitized side down
   - Center on bottle opening

2. **Position capper**:
   - **Wing capper**: Center over cap, press handles down
   - **Bench capper**: Place bottle on base, pull lever
   - Apply firm, even pressure

3. **Check seal**:
   - Cap should be tight and even
   - No gaps or bent edges
   - Recap if questionable

### Capper Types

**Wing Capper** ($15-25):
- Handheld, two handles
- Works well with practice
- Can be tiring for 50+ bottles
- Good for beginners

**Bench Capper** ($40-100):
- Mounts to table or stand
- More consistent
- Less effort
- Faster for large batches

---

## Step 7: Conditioning (Bottle Carbonation)
**Time**: 2-4 weeks
**Patience required!**

### Storage Conditions

**Week 1-2: Room Temperature**
- **Store at 65-75°F**
- Yeast needs warmth to carbonate
- Keep bottles upright
- Out of direct sunlight
- Quiet location (no disturbing sediment)

**After 2-3 Weeks: Test Bottle**
1. Chill one bottle for 24-48 hours
2. Open carefully over sink
3. **Good signs**:
   - Crisp "psst" when opened
   - Steady bubbles rising
   - Nice foam when poured
4. **Bad signs**:
   - No carbonation = wait longer
   - Gushers = too much priming sugar or infection

**Week 3+: Cold Storage**
- Once carbonated, store cold (fridge/garage)
- Cold helps yeast settle
- Improves clarity
- Slows any aging/oxidation

### Aging Timeline

**Drink Fresh** (< 3 months):
- IPAs, pale ales
- Wheat beers
- Session beers
- Hop-forward styles

**Aging Beneficial** (3-12 months):
- Barleywines
- Imperial stouts
- Belgian strong ales
- High-alcohol beers
- Sours

**Peak Drinking Window**:
- Most homebrews: 1-6 months
- Some get better: 6-24 months
- Very few improve beyond 2 years

---

## Troubleshooting

### No Carbonation After 2 Weeks
**Causes**:
- Temperature too cold (move to warmer spot)
- Not enough priming sugar (wait 2 more weeks)
- Yeast too old or weak (add new yeast - see below)

**Fix**:
1. Gently invert each bottle to rouse yeast
2. Move to 70-75°F location
3. Wait 1-2 more weeks
4. If still flat, can uncap and add yeast:
   - Rehydrate champagne yeast
   - Add 1 drop per bottle
   - Recap immediately

---

### Over-Carbonation (Gushers)
**Causes**:
- Too much priming sugar
- Bottled before fermentation complete (most common)
- Infection

**Identify**:
- All bottles gushing = priming sugar or early bottling
- Some bottles gushing = inconsistent mixing
- Progressively worse = infection

**Fix**:
- **Short term**: Store cold (slows yeast)
- **Drinking**: Chill well, open over sink, pour fast
- **Long term**: No fix, prevent next time

---

### Sediment in Bottles
**Normal!** This is bottle-conditioned beer.

**Minimizing Sediment**:
- Cold crash before bottling
- Use gelatin fining
- Careful siphoning (leave trub behind)
- Gentle transfer to bottling bucket

**Serving**:
- Store bottles upright for 24 hours before drinking
- Pour gently, leave last ½ oz in bottle
- Or drink it (extra B vitamins, harmless)

---

### Bottle Bombs 💥
**DANGER**: Over-pressurized bottles can explode

**Prevention**:
- ✅ Confirm fermentation is COMPLETE before bottling
- ✅ Measure priming sugar accurately
- ✅ Mix priming solution thoroughly
- ✅ Inspect bottles for defects
- ✅ Use proper caps and capper

**Warning Signs**:
- Bottles extremely firm after 1 week
- Hissing or leaking caps
- Bulging bottles

**If Suspected**:
- Move bottles to safe location (garage, outdoors)
- Cover with towel
- Refrigerate to slow pressure buildup
- Open over sink, slowly release pressure
- Drink soon (will be over-carbonated)

---

## Alternative: Kegging

**Advantages**:
- Much faster (carbonate in 3-7 days)
- No bottles to clean/fill/cap
- Easy to serve on draft
- Less sediment in beer

**Disadvantages**:
- Higher initial cost ($150-400)
- Needs CO2 tank and regulator
- Less portable
- Requires dedicated fridge/keezer

**Basic Kegging Equipment**:
- 5-gallon Cornelius keg (~$70-130)
- CO2 tank (5-10 lb, ~$60-100)
- CO2 regulator (~$50)
- Keg disconnects and hose (~$30)
- Tap/faucet (~$30-100)

---

## Bottle Reuse

**Can Reuse**:
- ✅ Standard pry-off bottles (most craft beers)
- ✅ Belgian bottles with pry-off caps
- ✅ Swing-top (Grolsch-style) bottles

**Cannot Reuse**:
- ❌ Twist-off bottles (too thin, caps don't seal)
- ❌ Bottles with screw threads

**Best Bottles for Reuse**:
- Heavy craft beer bottles (Sierra Nevada, etc.)
- Belgian bottles (La Trappe, Chimay, etc.)
- Bomber bottles (22 oz)
- Swing-tops (reusable forever, no caps needed)

---

## Bottling Day Timeline

| Step | Time | Notes |
|------|------|-------|
| Confirm FG | 10 min | Take gravity reading |
| Clean/sanitize bottles | 45-60 min | Most time-consuming |
| Make priming solution | 15 min | Boil and cool |
| Transfer to bucket | 20 min | Siphon + mix gently |
| Fill bottles | 30-45 min | Production line approach |
| Cap bottles | 15-20 min | Check each seal |
| **Total** | **~2.5-3 hours** | |
| Conditioning | 2-3 weeks | Room temp, then cold |

---

## Summary

**Keys to Successful Bottling**:
1. ✅ **Confirm fermentation is complete** (stable gravity)
2. ✅ **Sanitize everything** thoroughly
3. ✅ **Measure priming sugar** accurately
4. ✅ **Minimize oxygen exposure** (no splashing)
5. ✅ **Be patient** during conditioning

**Common Beginner Mistakes**:
- ❌ Bottling too early (bottle bombs)
- ❌ Not sanitizing properly (infections)
- ❌ Too much priming sugar (gushers)
- ❌ Testing too soon (needs 2-3 weeks)

**First Homebrew Rule**: It almost always turns out better than expected!

**Cheers!** 🍺
`
  }
];

export function KitBrewGuide() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-cream mb-2">Extract/Kit Brewing Guide</h2>
        <p className="text-cream/70">
          Complete step-by-step instructions for brewing your first batch with extract or ingredient kits.
          Perfect for beginners - includes brew day, fermentation, and bottling procedures.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {KIT_BREW_GUIDES.map((guide, index) => (
          <AccordionItem
            key={index}
            value={`kit-brew-${index}`}
            className="border-2 border-emerald-500/30 rounded-lg px-4 bg-emerald-500/5 transition-all hover:shadow-lg"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-4 w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-cream">{guide.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      {guide.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6">
              <div className="prose prose-invert max-w-none prose-headings:text-cream prose-p:text-cream/80 prose-li:text-cream/80 prose-strong:text-cream prose-code:text-gold">
                <ReactMarkdown>{guide.content}</ReactMarkdown>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
