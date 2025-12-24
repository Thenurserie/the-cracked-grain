'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ALL_GRAIN_GUIDES = [
  {
    title: 'All-Grain Brew Day SOP',
    difficulty: 'Intermediate',
    content: `## All-Grain Brewing Overview

All-grain brewing is the full brewing process where you start with raw malted grain and convert the starches into fermentable sugars through mashing. This method gives you complete control over your beer's character, efficiency, and ingredients.

Your first all-grain brew day will take 5-6 hours from setup to cleanup. This guide walks you through every step using the single infusion mash method.

---

## Equipment Needed

### Essential
- Mash tun (5-10 gallon cooler with false bottom or bag)
- Hot liquor tank or kettle for heating water
- Brew kettle (8+ gallons for 5-gal batch)
- Wort chiller (immersion or counterflow)
- Fermenter with airlock
- Thermometer (accurate to ±2°F)
- Large spoon or mash paddle
- Auto-siphon and tubing

### Recommended
- Grain mill (or buy pre-crushed grain)
- pH meter or strips
- Refractometer
- Brewing software for calculations

---

## Pre-Brew Preparation

### The Night Before
1. **Clean all equipment** thoroughly (PBW or OxiClean)
2. **Weigh and mill grain** (if not pre-crushed)
3. **Measure hop additions** into labeled containers
4. **Calculate water volumes**:
   - Strike water: 1.25-1.5 qt per lb of grain
   - Sparge water: to reach pre-boil volume
   - Total: 8-10 gallons for 5-gal batch

### Prepare Yeast
- Liquid yeast: Make starter 24-48 hours ahead
- Dry yeast: Set out to reach room temperature

---

## Step 1: Heat Strike Water

**Target Temperature**: 10-15°F above mash target

For 152°F mash temperature:
- Heat strike water to 165-167°F
- Calculate volume: 4.5 gal for 12 lb grain bill (1.5 qt/lb)

**Water Treatment** (if needed):
- Add brewing salts now (gypsum, calcium chloride)
- Stir to dissolve

**Preheat Mash Tun**:
- Fill with hot tap water
- Close lid for 5-10 minutes
- Dump before adding strike water

---

## Step 2: Dough In (Mashing)

### Adding Grain to Water

1. **Pour strike water** into preheated mash tun
2. **Add grain slowly** while stirring (2-3 minutes)
3. **Stir constantly** to prevent dough balls
4. **Check all corners** for dry pockets

### Target Mash Temperature

- **Dry beer** (IPA, Pilsner): 148-152°F
- **Balanced beer**: 152-156°F
- **Full-bodied** (Stout, Porter): 156-158°F

**Adjust if needed**:
- Too low: Add small amounts of boiling water
- Too high: Add cold water

---

## Step 3: Mash Rest (60 minutes)

1. **Close lid and insulate** (sleeping bag, blankets)
2. **Set timer for 60 minutes**
3. **Check temperature** every 15-20 minutes
   - 3-5°F drop is normal and acceptable

### During Mash Rest

Use this time to:
- Heat sparge water to 170°F (3-4 gallons)
- Set up boil kettle
- Prepare hop additions
- Sanitize fermentation equipment

---

## Step 4: Mash Out (Optional)

**Purpose**: Stops enzyme activity, improves flow

1. **Raise temperature to 168-170°F**:
   - Add boiling water while stirring, OR
   - Apply direct heat (stir constantly)
2. **Rest 10 minutes**

*If you can't mash out, proceed to vorlauf - beer will still be fine*

---

## Step 5: Vorlauf (Recirculation)

**Purpose**: Set grain bed filter, clarify wort

1. **Drain 1-2 quarts** slowly into pitcher
2. **Pour back gently** over grain bed
3. **Repeat 5-10 times** until mostly clear
4. **No visible grain particles** should remain

*Don't rush - this prevents stuck sparge*

---

## Step 6: Lautering and Sparging

### The Drain and Rinse Process

1. **Begin draining** wort into boil kettle
   - Target: 1-2 quarts per minute
   - Don't drain too fast (stuck sparge risk)

2. **Add sparge water** as you drain
   - Same rate as drainage
   - 170°F temperature
   - Distribute evenly across grain bed

3. **Continue until** pre-boil volume reached
   - Typically 6-7 gallons for 5-gal batch

### When to Stop Sparging

Stop if:
- pH rises above 6.0
- Gravity drops below 1.008
- Target volume reached

---

## Step 7: The Boil (60-90 minutes)

1. **Verify pre-boil volume**
2. **Bring to vigorous boil**
   - Watch for boilover at hot break
   - Stir occasionally

3. **Start timer** when boil begins
4. **Add hops per schedule**:
   - 60 min: Bittering hops
   - 15 min: Flavor hops
   - 5 min: Aroma hops
   - 0 min (flameout): Steep hops

**During boil**: Sanitize all post-boil equipment

---

## Step 8: Cool Wort Rapidly

**Target**: 65-75°F in 20-30 minutes

### Cooling Methods

**Immersion Chiller**:
- Sanitize coil (in boil last 15 min)
- Run cold water through
- Stir wort gently
- Takes 20-30 minutes

**Ice Bath**:
- Place kettle in ice water
- Stir occasionally
- Replace ice as it melts
- Takes 30-60 minutes

*Speed is critical - reduces infection risk*

---

## Step 9: Transfer to Fermenter

1. **Sanitize everything**
2. **Pour or siphon** wort to fermenter
   - **Splash to aerate** (oxygen needed now)
   - Leave trub behind in kettle

3. **Top up with water** if needed

---

## Step 10: Take Original Gravity

1. **Draw sample** with sanitized thief
2. **Fill hydrometer jar**
3. **Read gravity** at eye level
4. **Record OG** (e.g., 1.052)

**Typical OG**: 1.045-1.055 for standard ales

---

## Step 11: Pitch Yeast

1. **Verify temperature** (65-75°F for ales)
2. **Pitch yeast**:
   - Liquid: Shake and pour
   - Dry: Sprinkle or rehydrate first

3. **Seal fermenter**:
   - Install airlock with sanitizer
   - Ensure tight seal

---

## Step 12: Fermentation Setup

1. **Move to fermentation location**:
   - Temperature-stable spot
   - 65-70°F for most ales
   - Away from sunlight

2. **Record brew data**:
   - Date, recipe name
   - OG, volume
   - Yeast strain
   - Any notes

---

## Step 13: Clean Up

**Do this immediately** - don't let it dry!

1. **Dump spent grain** (compost)
2. **Scrub all equipment** with PBW
3. **Rinse thoroughly**
4. **Hang to dry**

*Clean brewery = happy brewery*

---

## Common Issues

### Stuck Sparge
- **Cause**: Too fine crush, draining too fast
- **Fix**: Gently stir grain bed top
- **Prevent**: Rice hulls, proper crush, slow drain

### Low Efficiency
- **Cause**: Coarse crush, high mash temp, poor mixing
- **Typical**: 65-70% first time, 75-80% with practice
- **Don't stress** - focus on process

### Off Temperatures
- **Mash temp varies**: Affects body/sweetness
- **3-5°F drop normal** during mash
- **Better insulation** helps next time

---

## Mash Temperature Guide

| Target | Style | Result |
|--------|-------|--------|
| 148-150°F | IPA, Pilsner | Very dry, light body |
| 150-152°F | Pale Ale | Dry, crisp |
| 152-154°F | Amber, Brown | Balanced |
| 154-156°F | Porter | Fuller body |
| 156-158°F | Stout | Sweet, full |

---

## Efficiency Expectations

- **Beginners**: 65-70%
- **Experienced**: 75-80%
- **Advanced**: 80-85%

*Consistency matters more than peak efficiency*

---

## Pro Tips

1. **Prep everything the night before**
2. **Water chemistry matters** - at minimum, ensure adequate calcium
3. **Lower mash temps** = drier beer
4. **Don't rush the sparge** - 1-2 qt/min
5. **Vigorous boil essential** for DMS removal
6. **Cool fast** - reduces infection risk
7. **Temperature control during fermentation** beats perfect mash temps
8. **Keep detailed notes** for improvement
9. **Relax** - first batch might not be perfect, but will be delicious
10. **Enjoy the process** - it's about the journey!

---

## Next Steps

After fermentation (2-3 weeks):
1. Take Final Gravity reading
2. Calculate ABV
3. Proceed to bottling or kegging
4. Condition 2-4 weeks
5. Enjoy your brew!
`
  },
  {
    title: 'Water Chemistry Basics',
    difficulty: 'Intermediate',
    content: `## Why Water Chemistry Matters

Water makes up 90-95% of beer, and its mineral content affects:
- Mash pH and enzyme activity
- Hop perception and bitterness quality
- Malt character and flavor
- Yeast health

Understanding the basics can dramatically improve your beer, especially hop-forward styles.

---

## Getting Started

### Obtain Your Water Report

1. Search "[your city] water quality report" online
2. Or send sample to Ward Labs (~$30)
3. Note these minerals:
   - Calcium (Ca)
   - Magnesium (Mg)
   - Sulfate (SO4)
   - Chloride (Cl)
   - Sodium (Na)
   - Bicarbonate (HCO3)

---

## Key Minerals and Effects

### Calcium (50-150 ppm)
- **Most important mineral**
- Promotes enzyme activity
- Helps yeast health
- Aids clarity

### Sulfate (SO4)
- Enhances hop bitterness
- Creates dry, crisp finish
- **IPAs**: 150-300+ ppm
- **Balanced**: 50-150 ppm

### Chloride (Cl)
- Enhances malt sweetness
- Adds fullness and body
- **Hoppy beers**: 50-100 ppm
- **Malty beers**: 100-150 ppm

### Magnesium (10-30 ppm)
- Yeast health in small amounts
- Harsh bitterness above 30 ppm

### Bicarbonate (HCO3)
- Creates alkalinity
- Good for dark beers
- Problematic for pale beers

---

## The Sulfate-to-Chloride Ratio

**Most powerful water chemistry tool**

- **3:1 or higher** = Very hoppy, dry, bitter
- **2:1** = Balanced, hop-leaning
- **1:1** = Balanced
- **1:2** = Malt-forward, fuller
- **1:3 or lower** = Very malty, sweet

**Example IPA**: 250 ppm sulfate, 75 ppm chloride (3.3:1)
**Example Marzen**: 75 ppm sulfate, 125 ppm chloride (0.6:1)

---

## Simple Starting Adjustments

### For Hoppy Beer (IPA, Pale Ale)
Add **1 tsp gypsum** (calcium sulfate) per 5 gallons
- Boosts sulfate and calcium
- Enhances hop character

### For Malty Beer (Amber, Brown, Stout)
Add **1 tsp calcium chloride** per 5 gallons
- Boosts chloride and calcium
- Enhances malt sweetness

---

## Mash pH

**Target**: 5.2-5.6 (measured at room temperature)

- **Pale beers**: 5.2-5.4
- **Dark beers**: 5.4-5.6

### Testing and Adjusting

**Too High (>5.6)**:
- Add lactic acid or acidulated malt
- Start with small amounts

**Too Low (<5.2)**:
- Add calcium carbonate or baking soda
- Rare with most water

**Why it matters**:
- Optimal enzyme activity
- Better efficiency
- Prevents astringency

---

## Water Profiles by Style

### Pale, Hoppy Beers
- Low bicarbonate
- Ca: 75-150 ppm
- SO4: 150-300 ppm
- Cl: 50-100 ppm

### Malt-Forward Beers
- Ca: 50-100 ppm
- SO4: 50-100 ppm
- Cl: 100-150 ppm

### Dark Beers
- Higher bicarbonate OK (150-250 ppm)
- Moderate Ca and Cl
- Alkalinity balances dark grain acidity

### Pilsners
- Very soft water
- Ca: 25-50 ppm
- Minimal SO4 and Cl

---

## Starting with RO Water

**Recommended for beginners**

**Advantages**:
- Complete control
- Consistent results
- Build from blank canvas

**Basic Addition** (5 gallons RO):
- ½ tsp calcium chloride
- ½ tsp gypsum
- Adjust from there

---

## Chlorine/Chloramine Removal

**Problem**: Creates medicinal, Band-Aid flavors

### Chlorine Removal
- Carbon filter (Brita)
- Let water sit overnight

### Chloramine Removal
- **Campden tablets** (easiest)
- ½ tablet per 5-10 gallons
- Crush and dissolve 10 min before use

---

## Using Water Calculators

**Bru'n Water** (free, popular)

1. Input source water minerals
2. Enter desired target profile
3. Calculator tells you exact salt additions
4. Prevents mistakes

---

## Pro Tips

1. **Start with RO** if overwhelmed - easiest to control
2. **Focus on calcium first** - 50-150 ppm range
3. **Sulfate for hops** - boosts bitterness and dryness
4. **Chloride for malt** - enhances sweetness
5. **Ratio matters most** - more than absolute values
6. **Use Campden tablets** - removes chlorine/chloramine
7. **Check mash pH** - if astringent or poor efficiency
8. **Document everything** - iterate and improve
9. **Add salts to mash water** - can use plain RO for sparge
10. **Be patient** - improvements are subtle but real

---

## Common Issues

### Harsh Bitterness
- Check mash pH (likely too high)
- Reduce sulfate
- Ensure adequate calcium

### Flat Malt Character
- Increase chloride
- Reduce sulfate
- Check sulfate:chloride ratio

### Poor Efficiency
- Check mash pH
- Ensure 50+ ppm calcium
- May need acid to lower pH

---

## Next Level

Once comfortable with basics:
- Study residual alkalinity (RA)
- Learn about mash pH prediction
- Experiment with different profiles
- Compare side-by-side batches
`
  }
];

export function AllGrainGuide() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-cream mb-2">All-Grain Brewing Guide</h2>
        <p className="text-cream/70">
          Master the complete brewing process from grain to glass. All-grain brewing gives you full control
          over your beer's character and opens up endless possibilities for customization.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {ALL_GRAIN_GUIDES.map((guide, index) => (
          <AccordionItem
            key={index}
            value={`all-grain-${index}`}
            className="border-2 border-blue-500/30 rounded-lg px-4 bg-blue-500/5 transition-all hover:shadow-lg"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-4 w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-cream">{guide.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                      {guide.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6">
              <div className="prose prose-invert max-w-none prose-headings:text-cream prose-p:text-cream/80 prose-li:text-cream/80 prose-strong:text-cream prose-code:text-gold prose-table:text-cream/80">
                <ReactMarkdown>{guide.content}</ReactMarkdown>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
