'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { FlaskConical } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const FERMENTATION_GUIDES = [
  {
    title: 'Fermentation Temperature Control',
    difficulty: 'All Levels',
    content: `## Why Temperature Control Matters

Temperature control is the single most important factor for producing clean, professional-quality beer. More than equipment, more than expensive ingredients - controlling fermentation temperature makes the biggest difference.

---

## Temperature Effects on Fermentation

### Too Warm (>75°F for Ales)

**Problems**:
- Fruity esters (banana, pear, bubblegum)
- Fusel alcohols (hot, solvent-like)
- Fast fermentation = less clean flavor
- Stressed yeast

### Too Cold (<60°F for Ales)

**Problems**:
- Sluggish or stuck fermentation
- Yeast goes dormant
- Underattenuated beer (too sweet)
- Incomplete diacetyl cleanup

### Ideal Temperatures

**Ales**: 65-72°F (18-22°C)
**Lagers**: 48-55°F (9-13°C)
**Belgian**: 68-78°F (20-26°C)
**Wheat**: 64-70°F (18-21°C)

---

## Temperature Control Methods

### 1. Swamp Cooler (Cheap, Effective)

**How To**:
1. Place fermenter in large tub or cooler
2. Fill with water
3. Add frozen water bottles (rotate 2-3x daily)
4. Optional: Drape wet t-shirt over fermenter (evaporative cooling)

**Performance**:
- Maintains 5-10°F below ambient
- Costs: $0-20
- Effort: Medium (swap ice bottles)

---

### 2. Fermentation Chamber (Best Option)

**Equipment**:
- Mini fridge or chest freezer ($50-200 used)
- Temperature controller (Inkbird, STC-1000: $30-60)
- Heating belt/wrap for cold climates ($20-30)

**Setup**:
1. Plug fridge into temperature controller
2. Place temperature probe on fermenter (tape it on)
3. Set target temperature
4. Controller cycles fridge on/off

**Performance**:
- Maintains ±2°F precision
- Set it and forget it
- Best investment for quality beer

---

### 3. Cool Basement (Free If You Have It)

**Requirements**:
- Naturally 60-65°F year-round
- Perfect for ales
- May need supplemental heat in winter

---

## Fermentation Timeline

### Days 1-3: Lag Phase

**What's Happening**:
- Yeast multiplying
- No visible activity normal

**Duration**: 6-48 hours

**What To Do**: Nothing! Be patient

**Troubleshooting Slow Start**:
- Yeast may be old/underpitched
- Temperature may be too low
- Give it 72 hours before worrying

---

### Days 3-7: Active Fermentation

**What You'll See**:
- Vigorous airlock activity (bubbles every few seconds)
- Thick krausen (foam layer) on top
- Churning, bubbling wort

**What To Do**:
- Maintain temperature
- Don't open fermenter!
- Monitor for blowoff

**Blowoff Setup** (if krausen threatens airlock):
1. Remove airlock
2. Insert tube into sanitized jar of Star San
3. Common with wheat beers and high-gravity beers

---

### Days 7-14: Slow Fermentation

**What's Happening**:
- Yeast finishing sugars
- Cleanup of off-flavors begins
- Beer starts to clear

**What You'll See**:
- Airlock slows (every 1-2 minutes)
- Krausen falls
- Beer becomes clearer

**What To Do**:
- Keep at fermentation temperature
- Don't rush!
- Resist urge to bottle early

---

### Days 14-21: Maturation

**What's Happening**:
- Yeast consuming off-flavors (diacetyl, acetaldehyde)
- Yeast flocculates (settles out)
- Flavors meld and mellow

**What You'll See**:
- No airlock activity
- Clear(er) beer
- Yeast cake at bottom

**What To Do**:
- Take gravity readings
- Confirm fermentation complete (2-3 identical readings)
- Bottle/keg when stable

---

## Taking Gravity Readings

### When to Measure

1. **Original Gravity (OG)**: Before pitching yeast
2. **Final Gravity (FG)**: When fermentation appears complete
3. **Confirm FG**: Take second reading 2-3 days later

### How to Measure

1. Sanitize hydrometer and test jar
2. Draw sample with sanitized wine thief
3. Fill test jar to 1" from top
4. Float hydrometer, spin to remove bubbles
5. Read at liquid surface (eye level)
6. Record the number (e.g., 1.012)
7. **Don't return sample** to fermenter

### Calculating ABV

**Formula**: ABV% = (OG - FG) × 131.25

**Example**:
- OG: 1.052
- FG: 1.012
- ABV = (1.052 - 1.012) × 131.25 = **5.25%**

---

## Target Final Gravities

- **Dry beer**: 1.006-1.010 (high attenuation)
- **Balanced**: 1.010-1.014 (medium)
- **Sweet/Full**: 1.014-1.020 (low attenuation)
- **High gravity**: 1.020-1.030+ (barleywines, imperials)

**If FG Higher Than Expected**:
- May be normal for recipe
- Yeast may need more time
- Temperature may be too low
- Check yeast attenuation characteristics

---

## Common Fermentation Issues

### Stuck Fermentation

**Symptoms**: Stops before target FG

**Causes**:
- Temperature dropped
- Insufficient yeast
- High mash temperature (all-grain)
- Low oxygen at pitch

**Solutions**:
1. Rouse the yeast (gently swirl fermenter)
2. Raise temperature 5°F
3. Pitch fresh yeast (rehydrate dry yeast first)
4. Wait longer - sometimes just slow

---

### Slow to Start

**Symptoms**: Takes >3 days to start

**Causes**:
- Underpitching (not enough yeast)
- Old/weak yeast
- Too cold

**Prevention**:
- Use fresh yeast
- Proper pitch rate (use calculator)
- Make yeast starter for high-gravity beers
- Oxygenate wort well

---

## Off-Flavors from Fermentation

### Diacetyl (Butter, Butterscotch)

**Cause**: Rushed fermentation, too cold

**Prevention**:
- Full 2-week fermentation
- Diacetyl rest (raise temp to 68°F for 2-3 days before packaging)

**Fix**: Raise temp, give more time

---

### Acetaldehyde (Green Apple, Paint)

**Cause**: Beer bottled too young

**Prevention**:
- Patience! Extra week of conditioning

**Fix**: More time will reduce it

---

### Fusel Alcohols (Hot, Solventy)

**Cause**: Too hot fermentation

**Prevention**:
- Stay in yeast's temp range

**Fix**: Aging helps, but prevention is key

---

### Phenolic (Band-Aid, Plastic)

**Cause**:
- Wild yeast contamination
- Chlorine in water

**Prevention**:
- Sanitation
- Use filtered/carbon-filtered water

**Fix**: Can't fix, must dump batch

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

---

### Dry Hopping

**When**: Days 12-14 of fermentation

**Why**: Maximum aroma, minimal bitterness

**How**:
1. Sanitize hops (spray with Star San)
2. Open fermenter quickly
3. Drop hops in
4. Reseal immediately
5. Leave 3-5 days
6. Bottle/keg

---

### Diacetyl Rest (Lagers)

**When**: End of primary fermentation

**Why**: Reduces buttery off-flavor

**How**:
1. Ferment lager at 50°F for 1-2 weeks
2. When near FG, raise to 65°F
3. Hold for 2-3 days
4. Chill to lagering temp (35°F)

---

### Cold Crashing

**When**: After fermentation complete

**Why**: Clearer beer

**How**:
1. Chill to 35-40°F for 2-3 days
2. Yeast and sediment drop out
3. Add gelatin for extra clarity (optional)

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
- [ ] Keep in dark place
- [ ] Don't open fermenter unnecessarily

### End of Fermentation
- [ ] Take FG reading when airlock quiet
- [ ] Confirm with second reading 2-3 days later
- [ ] Calculate ABV
- [ ] Proceed to packaging when stable

---

## Signs of Problems vs Normal

### Call for Action ❌

- **No activity after 72 hours**: Check temp, pitch more yeast
- **Film on surface**: Possible infection
- **Vinegar smell**: Acetobacter infection
- **Rotten egg smell**: Some yeast produce H2S (usually fades)

### Normal Variations ✅

- Fruity smells during active fermentation
- Sulfur smell (fades with time)
- Different krausen shapes/colors
- Finishing in 5 days vs 14 days

---

## Summary

**Keys to Great Fermentation**:
1. **Pitch healthy yeast** at proper rate
2. **Control temperature** throughout
3. **Be patient** - don't rush
4. **Take gravity readings** to confirm completion
5. **Sanitize everything** post-boil

**Next Steps**: Once FG is stable, proceed to packaging!
`
  }
];

export function FermentationGuideContent() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-cream mb-2">Fermentation Guide</h2>
        <p className="text-cream/70">
          Master fermentation temperature control and techniques to produce clean, professional-quality beer.
          Understanding fermentation is essential for great beer at any skill level.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {FERMENTATION_GUIDES.map((guide, index) => (
          <AccordionItem
            key={index}
            value={`fermentation-${index}`}
            className="border-2 border-purple-500/30 rounded-lg px-4 bg-purple-500/5 transition-all hover:shadow-lg"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-4 w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 flex-shrink-0">
                  <FlaskConical className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-cream">{guide.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">
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
