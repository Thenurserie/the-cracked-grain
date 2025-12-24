'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Wheat } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ADVANCED_GUIDES = [
  {
    title: 'Advanced Mashing Techniques',
    difficulty: 'Advanced',
    content: `## Beyond Single Infusion

While single infusion mashing works great for most beers, advanced mashing techniques allow you to extract specific characteristics and maximize control over your final product.

---

## Step Mashing

### What It Is
Multiple temperature rests during the mash, each activating different enzymes.

### Common Step Mash Schedule

**Protein Rest** (122-135°F, 15-20 min):
- Breaks down proteins
- Improves head retention
- Helps with undermodified malts
- Not needed for modern well-modified malts

**Beta-Glucan Rest** (95-113°F, 15-20 min):
- Reduces viscosity
- Helpful with high percentages of wheat/oats/rye
- Prevents stuck sparges

**Saccharification Rest 1** (145-150°F, 30-45 min):
- Beta-amylase creates highly fermentable sugars
- Produces dry, highly attenuated beer

**Saccharification Rest 2** (158-162°F, 20-30 min):
- Alpha-amylase creates less fermentable sugars
- Adds body and mouthfeel

**Mash Out** (168-170°F, 10 min):
- Stops enzyme activity
- Improves lautering

### When to Use
- High adjunct beers (wheat, rye, oats >30%)
- European lagers
- Maximum control over fermentability
- Troubleshooting stuck sparges

---

## Decoction Mashing

### Traditional German/Czech Technique

**Process**:
1. Remove portion of mash (thick with grain)
2. Boil the portion
3. Return to main mash
4. Raises overall mash temperature

**Benefits**:
- Enhanced malt character
- Deeper color
- Improved mouthfeel
- Traditional for Pilsners, Bocks, Oktoberfests

**Types**:
- **Single decoction**: One pull and boil
- **Double decoction**: Two pulls/boils
- **Triple decoction**: Three pulls/boils (rare)

**Challenges**:
- Time consuming (add 1-2 hours)
- Requires direct-heat kettle
- Not necessary with modern malts
- But creates unique character

### Simple Single Decoction

1. Mash in at 144°F (all grain)
2. Rest 15 minutes
3. Pull ⅓ of thick mash
4. Boil decoction for 15-20 minutes
5. Return to main mash → reaches ~158°F
6. Rest 20 minutes
7. Mash out at 168°F

---

## Turbid Mashing

**Used For**: Belgian lambics and spontaneous fermentation beers

**Purpose**: Creates lots of starches and proteins for long-term fermentation

**Process**: Extremely complex multi-step mash with:
- Multiple temperature rests
- Portions of wort pulled and held
- Portions added back at different times
- Creates "turbid" (cloudy) wort

**Not Recommended**: Unless specifically brewing traditional lambic

---

## Acid Rest

**Temperature**: 86-126°F
**Duration**: 15-30 minutes

**Purpose**:
- Lowers mash pH naturally
- Activates phytase enzyme (in malt)
- Phytase converts phytin to phytic acid

**Reality**:
- Modern malts have little phytase
- Water chemistry adjustments more effective
- Rarely used in modern brewing
- Can cause off-flavors if too long

---

## Parti-Gyle Brewing

### Ancient Technique for Two Beers from One Mash

**Process**:
1. Mash large grain bill (20+ lbs)
2. Collect first runnings (high gravity)
3. → Becomes strong beer (barleywine, imperial stout)
4. Sparge and collect second runnings (low gravity)
5. → Becomes session beer (mild, bitter)

**Benefits**:
- Two beers from one brew day
- Efficient use of time and grain
- Learn how gravity affects character

**Example**:
- 24 lbs grain
- First runnings: 3 gal at 1.090 (barleywine)
- Second runnings: 5 gal at 1.038 (mild)

---

## No-Sparge (Batch Sparge Variant)

**Method**: Use all water in mash, no sparging

**Process**:
1. Calculate total water needed
2. Mash with all water (very thin mash)
3. Drain completely after mash
4. No sparge water added

**Pros**:
- Faster brew day (no sparge)
- Simpler equipment
- Less tannin extraction risk

**Cons**:
- Lower efficiency (60-65%)
- Need more grain
- Dilute mash (>3 qt/lb ratio)

---

## Batch Sparging

**Alternative to Fly Sparging**

**Process**:
1. Drain first runnings completely
2. Add batch of hot water (170°F)
3. Stir gently, rest 10 min
4. Drain completely again
5. Repeat if needed (usually 2 batches total)

**Pros**:
- Faster than fly sparge
- Good efficiency (75-80%)
- Less equipment
- Simpler

**Cons**:
- Slightly lower efficiency than fly sparge
- More water volume at once

**Popular Method**: Many homebrewers prefer this

---

## High-Gravity Brewing

### Making Strong Beers (OG >1.075)

**Challenges**:
- Yeast stress
- Incomplete attenuation
- Long fermentation times
- Fusels and off-flavors

**Solutions**:

**Mash Lower**:
- 148-150°F for high gravity
- More fermentable wort
- Helps attenuation

**Pitch More Yeast**:
- 1.5-2x normal pitch rate
- Or make large starter

**Oxygenate Well**:
- Yeast need O2 for reproduction
- Pure oxygen recommended

**Nutrient Additions**:
- Yeast nutrient at pitch
- Yeast energizer mid-fermentation

**Temperature Control**:
- Start cooler (63-65°F)
- Prevent fusels from stress

**Be Patient**:
- Primary fermentation: 3-4 weeks
- Aging: 3-12 months

---

## Sour Mashing

**Method**: Lacto-ferment wort before boiling

**Process**:
1. Mash normally
2. Cool wort to 100-110°F
3. Add Lactobacillus (culture or grain)
4. Hold 24-48 hours
5. Boil as normal
6. Ferment with regular yeast

**Result**: Sour beer without long aging

**Pros**:
- Quick sour beer (weeks, not years)
- Controlled souring
- Good for Berliner Weisse, Gose

**Cons**:
- Risk of other contamination
- Careful temperature control needed
- Dedicated equipment recommended

---

## First Wort Hopping (FWH)

**Technique**: Add hops during lautering

**Process**:
1. Add hops to boil kettle
2. Lauter directly onto hops
3. Hops steep as wort collects
4. Boil as normal

**Benefits**:
- Smoother bitterness
- Enhanced hop flavor
- Better hop integration
- Perceived higher IBUs with less harshness

**Usage**:
- Use 20-30% of total hops
- Works best with noble hops
- Popular in German styles

---

## Hop Bursting

**Technique**: Most/all hops late in boil

**Process**:
- Skip 60-minute addition (or minimal)
- Large additions at 20 min, 10 min, 5 min, 0 min
- Creates low bitterness, high flavor/aroma

**Benefits**:
- Intense hop character
- Lower perceived bitterness
- Showcases hop flavors

**Good For**: NEIPAs, session IPAs, pale ales

**Example** (5 gallons):
- 0.5 oz Magnum at 60 min (bittering only)
- 2 oz Citra at 10 min
- 2 oz Mosaic at 5 min
- 2 oz Simcoe at 0 min (whirlpool)

---

## Whirlpooling

**Technique**: Create vortex after boil

**Process**:
1. Finish boil, turn off heat
2. Stir wort vigorously in one direction
3. Let spin for 5 minutes
4. Trub collects in cone in center
5. Draw wort from side (clean wort)

**Benefits**:
- Clearer wort
- Less trub in fermenter
- Can add hops during whirlpool

**Whirlpool Hopping**:
- Add hops at flameout
- Whirlpool while hot (180-200°F)
- Steep 20-30 minutes
- Some isomerization occurs
- Great flavor/aroma

---

## Advanced Fermentation

### Double Dry Hopping (DDH)

**Process**:
1. First dry hop at day 3 (during active fermentation)
2. Second dry hop at day 10-12 (after fermentation)

**Benefits**:
- Biotransformation (yeast modifies hop compounds)
- Layered hop character
- More complex aroma

### Kveik Yeast Techniques

**High Temperature Fermentation**:
- Ferment at 85-98°F (yes, really!)
- Fast fermentation (2-4 days)
- Clean despite high temps
- Norwegian farmhouse yeast

### Barrel Aging

- Age strong beers in spirits barrels
- Bourbon barrels most common
- 3-12 months aging
- Adds wood, vanilla, spirits character

---

## Pro Tips

1. **Step mashing** only needed for specific situations - don't complicate unnecessarily
2. **Batch sparging** easier than fly sparging with similar efficiency
3. **First wort hopping** creates smooth bitterness in traditional styles
4. **Hop bursting** great for modern hop-forward beers
5. **High-gravity beers** need patience and planning
6. **Decoction** creates unique character but takes time - try it once
7. **Whirlpool hopping** adds flavor without harshness
8. **Document everything** - advanced techniques need good notes
9. **Change one variable** at a time to understand effects
10. **Master basics first** - don't jump to advanced without solid foundation

---

## When to Use Advanced Techniques

**Use When**:
- Specific style requires it (decoction for pilsner)
- Troubleshooting issues (step mash for stuck sparge)
- Experimenting for fun
- Chasing specific characteristics

**Don't Use**:
- Just because it's "advanced"
- Without understanding the why
- On your first few batches
- If simpler method works

**Remember**: Great beer comes from great process, not complexity.
`
  }
];

export function AdvancedBrewingGuide() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-cream mb-2">Advanced Brewing Techniques</h2>
        <p className="text-cream/70">
          Take your brewing to the next level with advanced mashing, hopping, and fermentation techniques.
          These methods give you precise control over your beer's characteristics.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {ADVANCED_GUIDES.map((guide, index) => (
          <AccordionItem
            key={index}
            value={`advanced-${index}`}
            className="border-2 border-amber-500/30 rounded-lg px-4 bg-amber-500/5 transition-all hover:shadow-lg"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-4 w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 flex-shrink-0">
                  <Wheat className="h-6 w-6 text-amber-500" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-cream">{guide.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/30">
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
