'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const PACKAGING_GUIDES = [
  {
    title: 'Bottling Your Beer',
    difficulty: 'Beginner',
    content: `## Bottling Overview

Bottling is the most common packaging method for homebrewers. It's affordable, portable, and allows you to share your beer easily.

---

## Equipment Needed

### Essential
- ~50 bottles (12 oz) or ~25 (22 oz) for 5-gallon batch
- Bottle caps (new, never reuse)
- Bottle capper (wing or bench style)
- Bottling bucket with spigot
- Bottle filler wand (spring-tip)
- Auto-siphon or racking cane with tubing
- Sanitizer (Star San)

### Optional But Helpful
- Bottle washer/rinser
- Bottle tree/drying rack
- Dishwasher (for cleaning)

---

## Bottle Types

### Can Reuse ✅
- Standard pry-off bottles (most craft beers)
- Belgian bottles with pry-off caps
- Swing-top (Grolsch-style) bottles
- Bomber bottles (22 oz)

### Cannot Reuse ❌
- Twist-off bottles (too thin, caps don't seal properly)
- Bottles with screw threads

**Best Bottles**:
- Heavy craft beer bottles (Sierra Nevada, etc.)
- Belgian bottles (La Trappe, Chimay, etc.)
- Swing-tops (reusable forever, no caps needed)

---

## Step 1: Prepare & Sanitize Bottles

### Cleaning Bottles

**If Reusing**:
1. Rinse immediately after drinking
2. Inspect each bottle for:
   - Mold or film inside
   - Cracks or chips on rim
3. Wash thoroughly:
   - Hot soapy water + bottle brush
   - Rinse well (no soap residue)
   - Or dishwasher (no detergent, heat dry)

**If Using New**:
- Still rinse to remove dust
- Inspect for defects

### Sanitizing

**Method 1: Star San**:
1. Mix Star San (1 oz per 5 gal)
2. Fill each bottle with sanitizer
3. Let sit 2 minutes
4. Drain upside down on sanitized surface
5. Reuse solution for multiple bottles

**Method 2: Oven**:
1. Preheat to 350°F
2. Place clean bottles on baking sheet
3. Heat for 20 minutes
4. Let cool before filling

---

## Step 2: Make Priming Sugar Solution

**Purpose**: Provides sugar for carbonation in bottle

### Calculating Priming Sugar (5 gallons)

**Standard Amount**:
- **Corn Sugar (Dextrose)**: 5 oz (¾ cup) - most common
- **Table Sugar (Sucrose)**: 4.5 oz (⅔ cup)
- **Dry Malt Extract**: 6 oz (1 cup)

**Adjust for Style**:
- **British ales**: 3-4 oz (lower carbonation)
- **American ales**: 5 oz (medium)
- **Belgian, Wheat, IPAs**: 6-7 oz (higher)

**Use Calculator**: [Northern Brewer's priming sugar calculator](https://www.northernbrewer.com/apps/priming-sugar-calculator)

### Boiling the Solution

1. Measure sugar into small pot
2. Add 1-2 cups water
3. Bring to boil, stir to dissolve
4. Boil 5 minutes (sanitizes)
5. Cool to room temperature
6. Keep covered until use

---

## Step 3: Transfer to Bottling Bucket

### Setup
1. **Sanitize**:
   - Bottling bucket and lid
   - Auto-siphon and tubing
   - Stirring spoon

2. **Position**:
   - Fermenter on table/counter
   - Bottling bucket on floor below

### Transfer Process

1. Add priming solution to empty bottling bucket
2. Siphon beer from fermenter:
   - Start auto-siphon
   - Keep tip below surface (avoid splashing)
   - **Stop before trub** (sediment)
3. Gentle mixing:
   - Priming solution mixes as beer flows
   - **Avoid splashing** (oxygen = stale beer)

**Expected Volume**: ~4.75 gallons (~48 bottles)

---

## Step 4: Fill Bottles

### Setup
1. Position bottling bucket on table/counter
2. Attach bottle filler to spigot via tubing
3. Stage sanitized bottles within reach
4. Have caps ready in sanitizer

### Filling Process

1. Open spigot slightly to prime tube
2. Insert bottle filler into bottle:
   - Push down on bottle bottom
   - Spring-tip opens, beer flows
   - Fill to 1" from top
   - Lift filler - flow stops

3. Repeat for all bottles

**Headspace**: 1 inch from top when filler removed

---

## Step 5: Cap Bottles

### Capping Process

1. Place cap on bottle (sanitized side down)
2. Position capper:
   - **Wing capper**: Center, press handles down
   - **Bench capper**: Place bottle, pull lever
3. Check seal (tight and even)

### Capper Types

**Wing Capper** ($15-25):
- Handheld, two handles
- Good for beginners
- Can be tiring for 50+ bottles

**Bench Capper** ($40-100):
- Mounts to table
- More consistent
- Less effort
- Faster for large batches

---

## Step 6: Conditioning (Carbonation)

**Duration**: 2-4 weeks

### Week 1-2: Room Temperature

- Store at 65-75°F
- Keep bottles upright
- Out of direct sunlight
- Quiet location

**Yeast needs warmth to carbonate**

### Week 3+: Test Bottle

1. Chill one bottle for 24-48 hours
2. Open carefully over sink

**Good Signs** ✅:
- Crisp "psst" when opened
- Steady bubbles rising
- Nice foam when poured

**Bad Signs** ❌:
- No carbonation = wait longer
- Gushers = too much priming sugar

### After Carbonated

- Store cold (fridge/garage)
- Cold helps yeast settle
- Improves clarity

---

## Aging Timeline

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

**Peak Drinking**: Most homebrews 1-6 months

---

## Troubleshooting

### No Carbonation After 2 Weeks

**Causes**:
- Temperature too cold
- Not enough priming sugar
- Yeast too old/weak

**Fix**:
1. Gently invert bottles to rouse yeast
2. Move to 70-75°F location
3. Wait 1-2 more weeks
4. If still flat, can uncap and add champagne yeast

---

### Over-Carbonation (Gushers)

**Causes**:
- Too much priming sugar
- Bottled before fermentation complete
- Infection

**Identify**:
- All bottles gushing = priming sugar issue
- Some bottles = inconsistent mixing
- Progressively worse = infection

**Fix**:
- Store cold (slows yeast)
- Chill well, open over sink
- Pour fast

---

### Sediment in Bottles

**This is normal!** Bottle-conditioned beer has yeast sediment.

**Minimizing**:
- Cold crash before bottling
- Use gelatin fining
- Careful siphoning

**Serving**:
- Store upright 24 hours before drinking
- Pour gently, leave last ½ oz in bottle
- Or drink it (harmless, extra B vitamins)

---

### Bottle Bombs 💥

**DANGER**: Over-pressurized bottles can explode

**Prevention** ✅:
- Confirm fermentation COMPLETE before bottling
- Measure priming sugar accurately
- Mix priming solution thoroughly
- Inspect bottles for defects
- Use proper caps and capper

**Warning Signs**:
- Extremely firm bottles after 1 week
- Hissing or leaking caps
- Bulging bottles

**If Suspected**:
- Move to safe location (garage, outdoors)
- Cover with towel
- Refrigerate to slow pressure
- Open slowly over sink

---

## Bottling Day Timeline

| Step | Time |
|------|------|
| Clean/sanitize bottles | 45-60 min |
| Make priming solution | 15 min |
| Transfer to bucket | 20 min |
| Fill bottles | 30-45 min |
| Cap bottles | 15-20 min |
| **Total** | **~2.5-3 hours** |

---

## Pro Tips

1. **Confirm fermentation complete** (stable gravity readings)
2. **Sanitize thoroughly** - everything
3. **Measure priming sugar accurately** - use scale
4. **Minimize oxygen exposure** - no splashing
5. **Be patient** during conditioning (2-3 weeks)
6. **Test one bottle first** before drinking whole batch
7. **Keep detailed notes** - learn from each batch
8. **Save some bottles** - taste evolution over time
9. **Store upright** - helps yeast settle
10. **Chill before serving** - cold tastes better

---

## Common Mistakes

❌ Bottling too early (bottle bombs)
❌ Not sanitizing properly (infections)
❌ Too much priming sugar (gushers)
❌ Testing too soon (needs 2-3 weeks)
❌ Using twist-off bottles (poor seal)
❌ Not leaving enough headspace (oxidation)
❌ Returning sample to beer (contamination)
❌ Rushing the process (patience!)

---

## Summary

Bottling is straightforward with proper technique:

1. ✅ Sanitize everything
2. ✅ Calculate priming sugar correctly
3. ✅ Transfer gently (avoid oxygen)
4. ✅ Fill and cap properly
5. ✅ Condition 2-3 weeks minimum

**First Homebrew Rule**: It almost always turns out better than expected!

**Cheers!** 🍺
`
  },
  {
    title: 'Kegging Your Beer',
    difficulty: 'Intermediate',
    content: `## Why Keg?

Kegging offers major advantages over bottling once you're ready to invest in the equipment.

---

## Advantages of Kegging

**Speed**:
- Carbonate in 3-7 days (vs 2-3 weeks)
- No bottle cleaning, filling, capping

**Convenience**:
- Easy to serve on draft
- No individual bottles to manage
- Quick to package

**Quality**:
- Less sediment in beer
- Better carbonation control
- Reduced oxygen exposure

**Flexibility**:
- Adjust carbonation level
- Easy to add fruit/dry hops
- Can naturally carbonate or force carbonate

---

## Disadvantages

**Cost**: $150-400 initial investment

**Space**: Needs dedicated fridge/keezer

**Portability**: Less portable than bottles

**Sharing**: Harder to give away beer

---

## Basic Kegging Equipment

### Essential ($150-300 minimum)

**5-Gallon Cornelius Keg** ($70-130):
- Ball lock (more common) or pin lock
- Used soda kegs work great
- Inspect seals and posts

**CO2 Tank** (5-10 lb, $60-100):
- Buy vs lease
- Get it filled at welding supply or homebrew shop
- 5 lb carbonates ~5-10 kegs

**CO2 Regulator** (~$50):
- Single gauge (shows tank pressure)
- Dual gauge (shows tank + keg pressure)
- Important: must be for CO2 (not nitrogen)

**Gas & Liquid Disconnects** (~$15 each):
- Ball lock or pin lock (match your kegs)
- Gas = grey, Liquid = black

**Hose** (~$10):
- 3/16" ID beer line (5-10 feet)
- Gas line (shorter OK)

**Tap/Faucet** (~$30-100):
- Picnic tap (cheapest, ~$10)
- Perlick faucet (best, ~$60)
- Tower setup (for keezer/kegerator)

---

## Optional Equipment

**Kegerator/Keezer** ($200-600):
- Modified fridge or chest freezer
- Temperature controller
- CO2 tank and lines inside
- Tap tower on top

**Additional Kegs** ($70-130 each):
- Build your collection over time
- 2-4 kegs is ideal

**Keg Cleaning Equipment** ($20-50):
- Keg washer
- Cleaning solution pump

---

## Kegging Process

### Step 1: Transfer Beer to Keg

1. **Sanitize keg**:
   - Disassemble and clean all parts
   - Sanitize with Star San
   - Reassemble

2. **Transfer beer**:
   - Siphon or use auto-siphon
   - Purge keg with CO2 first (optional but recommended)
   - Fill from bottom using liquid disconnect

3. **Seal keg**:
   - Close lid
   - Pressurize with 30-40 PSI for 30 seconds
   - Release pressure, reseal
   - This seats the lid seal

---

### Step 2: Carbonation Methods

**Method 1: Force Carbonation (Fast)**

**"Set and Forget"**:
1. Set regulator to serving pressure (10-12 PSI)
2. Connect gas to keg
3. Place in fridge
4. Wait 5-7 days
5. Beer fully carbonated

**"Shake Method"** (2-3 days):
1. Chill keg to serving temp (38-42°F)
2. Set regulator to 30 PSI
3. Shake keg for 5-10 minutes
4. Let rest overnight
5. Reduce to serving pressure
6. Wait 2-3 days

**"Burst Carbonation"** (24 hours):
1. Chill keg to serving temp
2. Set regulator to 30-40 PSI
3. Leave for 24 hours (no shaking)
4. Reduce to serving pressure
5. Wait 24 more hours

---

**Method 2: Natural Carbonation** (2-3 weeks)

Same as bottling:
1. Add priming sugar to keg
2. Seal keg
3. Keep at room temp 2-3 weeks
4. Move to serving temp
5. Serve with low CO2 pressure (just to push, not carbonate)

**Advantage**: No CO2 equipment needed initially
**Disadvantage**: Takes longer, sediment in keg

---

### Step 3: Serving

1. **Set serving pressure**:
   - Most ales: 10-12 PSI at 38-42°F
   - Lagers: 12-14 PSI
   - High carbonation (wheat, Belgian): 14-16 PSI

2. **Balance your lines**:
   - 5-10 feet of 3/16" line for balanced pour
   - Too short = foamy pour
   - Too long = flat pour

3. **Pour**:
   - Open tap fully (not halfway)
   - Tilt glass 45°
   - Straighten as fills

---

## Carbonation Levels

Use a [carbonation chart](https://www.kegerators.com/carbonation-table/) to determine PSI based on temperature and style.

**Common Ranges**:
- **British Ales**: 1.5-2.0 volumes CO2
- **American Ales**: 2.2-2.6 volumes
- **Lagers**: 2.4-2.6 volumes
- **Wheat/Belgian**: 2.8-3.5 volumes

**Formula**: Higher temp = higher PSI needed

---

## Keg Maintenance

### After Each Keg

1. **Rinse immediately** with hot water
2. **Fill with sanitizer** or cleaning solution
3. **Pressurize** slightly (5 PSI) to keep sealed
4. **Store** until next use

### Deep Cleaning

**Every 3-5 uses**:
1. Disassemble all fittings
2. Soak in PBW or Oxiclean (30-60 min)
3. Scrub with soft brush
4. Rinse thoroughly
5. Inspect and replace o-rings as needed
6. Sanitize before use

**O-Rings**:
- Replace yearly or when worn
- Keep spares on hand
- Lubricate with keg lube (food-safe)

---

## Troubleshooting

### Foamy Pour

**Causes**:
- Pressure too high
- Beer line too short
- Beer too warm
- Dirty lines

**Fix**:
- Reduce pressure
- Add longer line (try 10 feet)
- Ensure beer at 38-42°F
- Clean lines and faucet

---

### Flat Beer

**Causes**:
- Not enough time
- Pressure too low
- CO2 leak

**Fix**:
- Wait longer (5-7 days)
- Increase pressure
- Check all connections with Star San (bubbles = leak)

---

### Off-Flavors

**Causes**:
- Dirty lines/faucet
- Contaminated keg
- Oxidation during transfer

**Fix**:
- Deep clean all equipment
- Check transfer method
- Purge keg with CO2 before filling

---

## CO2 Tank Safety

**Important**:
- CO2 is compressed gas under high pressure
- Never drop or heat tank
- Store upright and secured
- Slowly open/close valves
- Check for leaks regularly

**Tank Life**:
- 5 lb tank: ~5-10 kegs
- 10 lb tank: ~10-20 kegs
- Refill at welding supply, homebrew shop, or beverage distributor

---

## Cost Comparison

**Bottling** (per 5-gal batch):
- Bottles: $0 (reused) to $30 (new)
- Caps: $2
- Sugar: $1
- Time: 2.5-3 hours

**Kegging** (per 5-gal batch):
- CO2: $2-3
- Time: 30 minutes
- Initial equipment: $150-300 (one-time)

**Break-Even**: After 10-15 batches, kegging saves time and hassle

---

## Recommendations

**Starting Out**:
- 1 keg
- 5 lb CO2 tank
- Basic regulator
- Picnic tap
- Use spare fridge

**Upgrade Path**:
- Add more kegs (2-4 total)
- Build keezer/kegerator
- Tower with multiple taps
- Dual regulator (different carbonation levels)

---

## Summary

**Kegging Advantages**:
- Fast carbonation (3-7 days)
- Easy to serve
- Less work than bottling
- Better quality control

**Investment**:
- $150-300 to start
- Saves time after 10-15 batches

**Process**:
1. Transfer to sanitized keg
2. Force carbonate 5-7 days
3. Serve at proper pressure
4. Clean and maintain

**Next Level**: Most homebrewers who keg never go back to bottling!

**Cheers!** 🍺
`
  }
];

export function PackagingGuide() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-cream mb-2">Packaging Guide</h2>
        <p className="text-cream/70">
          Learn bottling and kegging techniques to properly package and carbonate your beer.
          From bottles to kegs, master the final step in the brewing process.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {PACKAGING_GUIDES.map((guide, index) => (
          <AccordionItem
            key={index}
            value={`packaging-${index}`}
            className="border-2 border-orange-500/30 rounded-lg px-4 bg-orange-500/5 transition-all hover:shadow-lg"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-4 w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/20 flex-shrink-0">
                  <Package className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-cream">{guide.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-400 border-orange-500/30">
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
