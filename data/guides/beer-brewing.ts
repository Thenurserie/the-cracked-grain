import { Guide } from '../types/guide-types';

/**
 * THE COMPLETE BEER BREWING GUIDE
 * A comprehensive guide covering everything from your first batch to advanced techniques
 * Word count: ~3,800 words
 */

export const BEER_BREWING_GUIDE: Guide = {
  id: 'complete-beer-brewing-guide',
  title: 'The Complete Beer Brewing Guide: From First Batch to Master Brewer',
  difficulty: 'Beginner',
  time: '60 min read',
  category: 'Complete Guides',
  content: {
    overview: 'Welcome to the wonderful world of homebrewing! This comprehensive guide will take you from absolute beginner to confident brewer, covering everything you need to know to make great beer at home. Whether you\'re brewing your first batch or looking to refine your technique, this guide has you covered.',
    steps: [],
    tips: [],
  },
};

export interface BeerGuideSection {
  id: string;
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
  tips?: string[];
  warnings?: string[];
}

export const BEER_GUIDE_SECTIONS: BeerGuideSection[] = [
  {
    id: 'introduction',
    title: '1. Introduction to Beer Brewing',
    content: `Homebrewing is the art and science of making beer in your own home. It's a rewarding hobby that combines creativity, patience, and a bit of chemistry to produce something truly special – beer that you crafted yourself.

**Why Brew Your Own Beer?**

There are countless reasons to start homebrewing. First and foremost, it's incredibly fun! There's something magical about transforming simple ingredients – water, malt, hops, and yeast – into a delicious beverage. You'll gain a deep appreciation for beer and understand what goes into every pint you drink.

Homebrewing also gives you complete creative control. Want to make a double IPA with experimental hops? A smooth chocolate stout? A crisp pilsner? You can brew exactly what you want, when you want it. And while the initial equipment investment might seem steep, homebrewing actually becomes quite economical over time – you can make 5 gallons (about 50 bottles) of beer for $30-40 in ingredients.

**What to Expect as a Beginner**

Your first brew day (using extract brewing - the beginner method) will take 2-3 hours, but don't let even that intimidate you! Most of that time is waiting for water to boil or the wort to cool. Active work time is maybe 1-2 hours. After brew day, fermentation takes 1-3 weeks, then bottling takes about 2 hours, followed by 2-3 weeks of bottle conditioning before your beer is ready to drink. (Note: All-grain brewing, which you can move to later, takes 5-6 hours but gives you more control.)

The learning curve is gentle. Your first batch will likely be drinkable, your second will be good, and by your third or fourth, you'll be making beer that impresses your friends. Every batch teaches you something new.

**Overview of the Brewing Process**

At a high level, brewing follows these steps: You'll extract sugars from malted grains (or use pre-extracted malt syrup), boil this sweet liquid (called wort) with hops for bitterness and flavor, cool it down, add yeast to ferment the sugars into alcohol, wait patiently while fermentation happens, then bottle with a bit of sugar for natural carbonation. Simple in concept, endlessly refinable in practice.

**Time and Cost Expectations**

Initial equipment cost: $100-200 for a basic kit, or up to $400-500 if you buy individual high-quality pieces. Ingredients per 5-gallon batch: $30-60 depending on style. Your first batch works out to about $3-4 per beer including equipment, but by batch 10, you're down to $0.80-1.50 per beer for ingredients only.

Time investment: Brew day using extract method (2-3 hours), fermentation (1-3 weeks of waiting), bottling (2-3 hours), conditioning (2-3 weeks). Total time from grain to glass: 4-8 weeks for your first batch, with brew days becoming faster as you gain experience. (All-grain brewing takes 5-6 hours per brew day once you're ready to advance.)`,
  },
  {
    id: 'equipment',
    title: '2. Equipment You\'ll Need',
    content: `Good news: you don't need much to start brewing! Here's what's essential and what can wait.`,
    subsections: [
      {
        title: 'Essential Equipment',
        content: `**Brew Kettle (5+ gallons)**: This is where you'll boil your wort. A 5-gallon batch needs at least a 5-gallon pot, but 8-10 gallons is better to prevent boilovers. Stainless steel is ideal, but aluminum works too. A thick bottom helps prevent scorching.

**Fermenter**: This is where the magic happens. Options include food-grade plastic buckets ($15-25), glass carboys ($30-50), or plastic carboys ($25-40). Beginners often prefer buckets – they're affordable, easy to clean, and you can see inside through the lid. Get a 6-6.5 gallon fermenter for a 5-gallon batch to allow headspace for krausen (the foamy head that forms during active fermentation).

**Airlock and Stopper**: This one-way valve ($2-3) lets CO2 escape during fermentation while keeping oxygen and contaminants out. Fill it halfway with water or sanitizer. The bubbling airlock is mesmerizing to watch and confirms your fermentation is active.

**Thermometer**: Temperature matters enormously in brewing. Get a good thermometer ($10-30) that reads from 32°F to at least 212°F. Instant-read digital thermometers are worth the investment for quick, accurate readings.

**Hydrometer**: This floating glass instrument ($8-15) measures the density of your wort/beer, telling you the sugar content. You'll use it to calculate alcohol content and confirm fermentation is complete. Takes practice to read accurately, but it's essential. Get a hydrometer jar ($5) to make measurements easier and waste less beer.

**Auto-Siphon and Tubing**: For transferring beer without splashing or introducing oxygen ($15-20). The auto-siphon makes starting the flow easy without sucking on the tube (which is unsanitary). Get 5-6 feet of food-grade tubing.

**Bottling Bucket with Spigot**: A second food-grade bucket ($15-25) with a spigot at the bottom makes bottling easier. You'll transfer finished beer here with priming sugar, then fill bottles from the spigot.

**Bottle Capper and Caps**: A wing capper or bench capper ($15-45) crimps caps onto bottles. Get new caps ($5 per 144) for each batch – don't reuse caps. The satisfying "snap" of capping a bottle never gets old.

**Bottles**: You'll need about 48-54 12oz bottles for a 5-gallon batch. Save bottles from commercial beer (standard crown cap, not twist-off), or buy new swing-top bottles. Brown bottles protect beer from light. Clean thoroughly and inspect for chips.

**Sanitizer**: Star San is the gold standard ($12-20 for a bottle that lasts a year). Mix 1 oz per 5 gallons of water. It's a no-rinse acid sanitizer that kills bacteria and wild yeast in 30 seconds of contact. This is your most important chemical.

**Large Spoon or Paddle**: Stainless steel is best ($15-30), but plastic works. You need something long enough to stir a full kettle without burning yourself. Get one that can handle heat and won't leach flavors.`,
      },
      {
        title: 'Optional But Helpful Equipment',
        content: `**Wort Chiller**: Immersion or plate chiller ($60-150) cools your wort from boiling to pitching temperature in 15-20 minutes instead of 2-3 hours. Faster cooling means less risk of infection and clearer beer. This is the first upgrade most brewers make.

**Refractometer**: Takes gravity readings with just a drop of wort ($30-80). Especially useful for all-grain brewing where you're checking during the mash.

**pH Meter**: For those getting serious about water chemistry ($40-150). Not needed as a beginner.

**Bottle Washer**: Attaches to your faucet and shoots water up into bottles ($15-25). Makes bottle cleaning much faster.

**Bottle Tree/Drying Rack**: Holds sanitized bottles upside down to drip dry ($20-40). Better than paper towels.

**Fermination Chamber**: A mini-fridge or chest freezer with a temperature controller ($150-300 total). Game-changer for fermentation temperature control, especially for lagers.

**Kegging Setup**: Skip bottling entirely ($200-400 to start). Many brewers never go back once they start kegging.`,
      },
      {
        title: 'Upgrading Your Extract Brewing Setup',
        content: `As you brew more batches, you'll want to upgrade your equipment. Here's the typical path for extract brewers:

**First Priority Upgrade: Wort Chiller** - This makes brew day SO much easier. Cuts cooling time from 45-60 minutes down to 15-20 minutes. Less risk of infection, clearer beer. Best upgrade you can make for $60-80.

**Second Upgrade: Better Temperature Control** - A temperature-controlled fermentation chamber (modified mini-fridge with temperature controller, $100-200) dramatically improves beer quality and consistency.

**Third Upgrade: Kegging System** - Skip bottling entirely! Initial cost is $200-400, but you'll save hours on every batch and your beer will be ready faster with more consistent carbonation.

**Optional Upgrades**: Refractometer for quick gravity readings ($30-80), better fermenter with conical bottom for clearer beer ($100-200), larger brew kettle with built-in thermometer and valve ($150-300).

Take your time with upgrades. Master each batch with your current equipment first. Many award-winning beers are made on basic setups!`,
      },
    ],
  },
  {
    id: 'ingredients',
    title: '3. Understanding Ingredients',
    content: `Beer is made from four simple ingredients, but each has infinite variety. Understanding them helps you make better beer and troubleshoot problems.`,
    subsections: [
      {
        title: 'Malt and Fermentables',
        content: `**What is Malt?** Barley (or other grains) is soaked in water to begin germination, then heated to stop the process. This "malting" converts the grain's starches into fermentable sugars and develops flavor. The malt is then kilned at various temperatures to create different colors and flavors.

**Base Malts**: These make up 70-100% of your grain bill and provide most fermentable sugars. They're lightly kilned to preserve enzymes. Common base malts include Pale Malt (most versatile), Pilsner Malt (lighter, for lagers), Maris Otter (British ales), and Munich Malt (adds maltiness).

**Specialty Malts**: Kilned or roasted at higher temperatures for color and flavor. Used in smaller amounts (5-30% of grain bill). Examples: Crystal/Caramel malts add sweetness and body (10-150°L), Chocolate Malt adds chocolate notes (350°L), Roasted Barley adds coffee bitterness (550°L), Victory/Biscuit add toasty notes (25-28°L).

**Malt Extract for Beginners**: Liquid Malt Extract (LME) or Dry Malt Extract (DME) is pre-made wort in syrup or powder form. It's concentrated malt sugars ready to dissolve in water. Extract brewing skips the mashing step, cutting brew day time in half. LME is cheaper but heavier; DME stores better and is easier to measure. Both make excellent beer.

**How Malt Affects Your Beer**: Lighter malts (2-4°L) give pale yellow color and clean taste. Medium malts (10-40°L) add amber color and toffee/caramel flavors. Dark malts (300-600°L) create brown-black beer with roasted, chocolate, or coffee notes. More malt = higher gravity = more alcohol.

**Grain Bill Percentages**: Typical pale ale: 85% Pale Malt, 10% Crystal 40L, 5% Munich. Stout: 75% Pale Malt, 10% Roasted Barley, 8% Flaked Oats, 7% Chocolate Malt. Understanding ratios helps you build balanced recipes.`,
      },
      {
        title: 'Hops',
        content: `**What Hops Do**: Hops are flowers that add three things to beer: bitterness (to balance malt sweetness), flavor (citrus, pine, floral, earthy), and aroma (that wonderful hop smell). They also act as a preservative.

**Alpha Acids Explained**: This percentage (3-15%+) indicates bittering potential. Higher alpha = more bitterness per ounce. Bittering hops (10-15% AA) are added early in the boil. Aroma hops (3-7% AA) are added late or as dry hops.

**Hop Varieties**: Cascade - citrusy, floral (American classic). Centennial - bold citrus, pine (West Coast IPA). Citra - intense tropical fruit. Mosaic - blueberry, tropical fruit. Saaz - spicy, earthy (Czech pilsners). Fuggle - earthy, woody (English ales). East Kent Goldings - smooth, slightly spicy (English ales). Each variety has unique flavor and aroma characteristics.

**Pellet vs Whole Leaf**: Pellets are compressed hop flowers, easier to measure and store, better extraction. Whole leaf hops are traditional, some say they give better flavor, but they're bulkier and harder to measure. Pellets are standard for homebrewers.

**Hop Addition Timing**:
- 60 minutes (bittering): Alpha acids isomerize into bitter compounds. Little aroma/flavor contribution.
- 15-20 minutes (flavor): Some bitterness, stronger hop flavor.
- 5 minutes or less (aroma): Minimal bitterness, maximum hop flavor and aroma.
- Flameout/whirlpool (0 minutes): No bitterness, intense flavor and aroma.
- Dry hopping (in fermenter): Zero bitterness, pure hop aroma. Add for 3-7 days.

Understanding timing lets you dial in exactly the hop character you want.`,
      },
      {
        title: 'Yeast',
        content: `**Ale vs Lager Yeast**: Ale yeast (Saccharomyces cerevisiae) ferments warm (65-72°F), fast (5-10 days), at the top of the fermenter. Creates fruity esters and full-bodied beers. Lager yeast (Saccharomyces pastorianus) ferments cool (48-55°F), slow (2-3 weeks), at the bottom. Creates clean, crisp flavors. Lagers need temperature control.

**Dry vs Liquid Yeast**: Dry yeast comes in packets ($4-6), stores at room temperature, has long shelf life, and contains tons of healthy cells. Just sprinkle on top or rehydrate. Liquid yeast ($7-12) offers more strain variety, fresher genetics, but needs careful handling and often requires a starter for 5-gallon batches. Either makes great beer.

**Yeast Selection**: Different strains create different flavors even with identical recipes. American ale yeast (US-05, 1056) - clean, neutral. English ale yeast (S-04, 1968) - fruity, slightly sweet. Belgian ale yeast (T-58, 3787) - spicy, phenolic. Hefeweizen yeast (WB-06, 3068) - banana and clove. German lager yeast (W-34/70, 2124) - crisp and clean.

**Proper Yeast Handling**: Store in the fridge. Check manufacture date (fresher is better). Liquid yeast over 3 months old needs a starter. Rehydrate dry yeast in 90-95°F water for 15 minutes before pitching (optional but recommended). Never pitch yeast into hot wort – cool to proper temperature first. Proper pitching temperature varies by strain but generally 68-72°F for ales, 50-55°F for lagers.

**Fermentation Temperature is Critical**: Too hot (>80°F) creates fusel alcohols (hot, harsh) and excessive fruity esters. Too cold (<60°F for ales) makes yeast sluggish or stalls fermentation. Consistent temperature matters more than hitting an exact number. A 10-degree swing during fermentation will create off-flavors.`,
      },
      {
        title: 'Water',
        content: `Water makes up 90-95% of beer, so quality matters. Good news: unless your water tastes bad, it's probably fine for your first batches.

**Water Quality Basics**: If your tap water tastes good for drinking, it'll make good beer. If it has strong chlorine taste, use a carbon filter or let it sit overnight uncovered (chlorine evaporates). Bad water makes bad beer – no amount of great ingredients can fix it.

**Chlorine and Chloramine**: Chlorine evaporates or can be filtered out. Chloramine doesn't evaporate and needs chemical removal (Campden tablets, $5 for 100 tablets, use 1 crushed tablet per 5 gallons, wait 10 minutes). Chlorine/chloramine combined with malt creates band-aid flavors.

**When to Worry About Water Chemistry**: As a beginner? Don't. After 5-10 batches? Start researching if you want to brew authentic regional styles (Burton-on-Trent water for IPAs, soft water for pilsners). Get a water report from your city. Adjust pH and minerals with salts (gypsum, calcium chloride, etc.). This is intermediate-to-advanced territory.`,
      },
    ],
  },
  {
    id: 'sanitation',
    title: '4. Sanitation - The Most Critical Step',
    content: `If you remember only one thing from this guide: SANITIZE EVERYTHING. More batches are ruined by poor sanitation than any other cause.`,
    subsections: [
      {
        title: 'Why Sanitation Matters',
        content: `Your wort is a perfect breeding ground for bacteria and wild yeast. These microorganisms are everywhere – on surfaces, in the air, on your hands. If they get into your beer, they'll create off-flavors: sourness, vinegar, band-aids, or just "off" tastes that ruin months of work.

After you boil your wort, it's sterile. Everything that touches it afterward must be sanitized. Everything. No exceptions. This is where most beginners fail.`,
      },
      {
        title: 'Cleaning vs Sanitizing',
        content: `These are different steps!

**Cleaning** removes visible dirt, dried krausen, hop matter, and organic material. Use PBW (Powdered Brewery Wash) or OxiClean Free. Scrub, rinse thoroughly. Hot water helps. This step is done hours or days before brew day.

**Sanitizing** kills microorganisms on clean surfaces. Done immediately before use. Star San is the standard – mix 1 oz per 5 gallons of water in a spray bottle or bucket. 30 seconds of contact time kills everything. Don't rinse (it's no-rinse sanitizer).

Clean first, then sanitize. You can't sanitize dirty equipment effectively.`,
      },
      {
        title: 'How to Use Star San Properly',
        content: `Mix 1 oz (6 ml or about 1.5 tsp) Star San with 5 gallons of water. If your water is hard, use distilled water for the solution – hard water makes Star San cloudy and less effective. The solution stays good for days if the pH stays below 3 (test strips are cheap). Store in a closed bucket.

Spray or submerge everything that touches wort after the boil: fermenter, airlock, stopper, thermometer, hydrometer, spoon, siphon, tubing, bottles, bottle filler. Wait 30 seconds. No rinsing needed – "Don't fear the foam!" A little foam in your fermenter is fine.

Star San is slightly acidic. It won't hurt you in beer concentrations, and the yeast eats it as a nutrient anyway.`,
      },
      {
        title: 'What Needs to Be Sanitized',
        content: `Before wort touches it, sanitize: fermenter and lid, airlock and stopper, thermometer, hydrometer and test jar, funnel, stirring spoon, anything that touches the wort.

On bottling day, sanitize: bottles (every single one), bottle caps, bottling bucket, siphon and tubing, bottle filler, anything that touches the beer.

Your brew kettle doesn't need sanitizing – the boil sterilizes everything.`,
      },
      {
        title: 'Common Sanitation Mistakes',
        content: `1. Not waiting the full 30 seconds for Star San to work
2. Rinsing Star San with non-sterile water (defeats the purpose)
3. Touching sanitized surfaces with unsanitized hands
4. Setting sanitized equipment on unsanitized surfaces
5. Assuming "clean enough" is the same as sanitized
6. Forgetting to sanitize small things (like the yeast packet scissors)
7. Using old, cloudy, or high-pH Star San solution

Be paranoid about sanitation. It's the difference between great beer and drain pour.`,
      },
    ],
    warnings: [
      'Never rinse Star San with tap water after sanitizing – this introduces bacteria',
      'If it touches your beer after the boil, it must be sanitized. No exceptions.',
      'Infections can take weeks to show up. By then, your beer is ruined.',
    ],
  },
  {
    id: 'first-brew',
    title: '5. Your First Brew Day (Extract Brewing)',
    content: `This is it – brew day! Extract brewing is the perfect way to start. You'll make excellent beer while learning the fundamentals. Allow 2-3 hours total, though active work time is only 1-2 hours. (Note: The timeline below includes some optional steps that may add time.)`,
    subsections: [
      {
        title: 'Before You Start: Checklist',
        content: `**The Night Before**: Clean all equipment with PBW/OxiClean. Gather ingredients. Check you have enough sanitizer. Fill your fermentation vessel with water and let it sit overnight (helps check for leaks). Chill 2-3 gallons of water in your fridge (for cooling wort later).

**Morning Of**: Read your recipe completely. Twice. Lay out all ingredients and equipment. Mix Star San solution. Put a pot of water on to heat (this takes a while). Take a deep breath – you're about to make beer!`,
      },
      {
        title: 'Step-by-Step Process',
        content: `**Step 1: Gather and Sanitize Equipment** (30 minutes before you need it)
Mix Star San solution. Spray or soak your fermenter, airlock, stopper, thermometer, funnel, stirring spoon. Let sit for 30 seconds minimum. Leave items in the Star San bath or on a sanitized surface.

**Step 2: Heat Water** (15-20 minutes)
Put 3-4 gallons of water in your brew kettle. Heat to 155-160°F. This is called "strike water." If your recipe has specialty grains to steep, stop here. If you're using only extract, heat to boiling.

**Step 3: Steep Specialty Grains** (30 minutes) - If applicable
Put crushed specialty grains in a grain bag (like a giant tea bag). When water reaches 155-160°F, remove from heat and add the grain bag. Steep for 20-30 minutes, keeping temperature between 150-170°F. This extracts color and flavor, not fermentable sugars.

After steeping, lift the grain bag out. Let it drip for a minute, but don't squeeze – squeezing can extract tannins that make your beer astringent. Discard the grain bag.

**Step 4: Add Malt Extract** (10 minutes)
Remove the kettle from heat. This is important – extract can scorch on the bottom if added to a hot kettle. Stir in your liquid or dry malt extract until completely dissolved. LME pours like thick honey (warm the container in hot water to help it pour). DME can clump – add slowly while stirring.

**Step 5: Return to Boil and Start Hop Schedule** (60 minutes)
Return kettle to heat and bring to a rolling boil. Watch carefully – the "hot break" (when proteins foam up) can cause a boilover. Reduce heat slightly if needed, but maintain a vigorous boil.

Once boiling steadily, add your bittering hops. Start your timer for 60 minutes. Add hops according to your recipe schedule (typically 60 min, 15 min, and 5 min or flameout). Set phone alarms for each addition.

A vigorous boil is important – it isomerizes hop alpha acids, drives off DMS (a cooked-corn off-flavor precursor), and coagulates proteins. Keep at least 70% of the surface rolling.

**Step 6: Cool the Wort Quickly** (20-60 minutes)
At the end of the 60-minute boil, turn off the heat. Now you need to cool the wort from 212°F to 68-70°F as quickly as possible. Fast cooling prevents infections and improves clarity.

Ice bath method: Put your sealed kettle in a sink or large tub filled with ice water. Stir the ice water around the kettle. Takes 45-60 minutes. Add more ice as it melts.

Wort chiller method: Sanitize an immersion chiller and put it in the wort for the last 15 minutes of the boil. After flameout, run cold water through it. Stir the wort gently. Takes 15-25 minutes.

Cool to 68-72°F for ales, 50-55°F for lagers.

**Step 7: Transfer to Fermenter** (15 minutes)
Sanitize your fermenter, funnel, and anything that touches the wort. Pour or siphon the cooled wort into the fermenter. Splashing is good now – it aerates the wort, which yeast needs to reproduce.

Top up to 5 gallons with pre-chilled water if needed. Stir vigorously for 30-60 seconds to oxygenate.

**Step 8: Take Original Gravity Reading** (5 minutes)
Sanitize your hydrometer and test jar. Draw a sample of wort. Float the hydrometer and read where the liquid level crosses the scale (read at eye level). Record this number – it's your Original Gravity (OG). Should match your recipe target within 0.004-0.006 points.

**Step 9: Pitch Yeast** (5 minutes)
If using dry yeast, you can sprinkle it directly on top (open the packet with sanitized scissors). Or rehydrate first in 1/2 cup of 95°F water for 15 minutes. Liquid yeast can be pitched straight from the vial/packet if fresh.

Put the lid on immediately and seal. Don't open again until fermentation is complete!

**Step 10: Seal Fermenter and Add Airlock** (5 minutes)
Put the sanitized airlock in the fermenter lid. Fill the airlock halfway with water or Star San. This lets CO2 out but keeps oxygen and contaminants out.

**Step 11: Move to Fermentation Location** (5 minutes)
Put your fermenter somewhere with stable temperature, out of direct sunlight, where you won't disturb it. Ideal temperature: 66-70°F for most ales, 48-55°F for lagers. A spare closet or basement corner works great.

**Step 12: Wait** (1-3 weeks)
The hardest step! Don't peek. Don't open the fermenter. Don't move it around. Let the yeast work.`,
      },
      {
        title: 'Tips for Each Step',
        content: `**Grain Steeping**: Keep the grain bag off the bottom of the pot (set it on a colander or false bottom). Temperature too high extracts tannins (astringency).

**Adding Extract**: Remove from heat first! Stirring extract into a hot kettle can scorch it to the bottom, creating caramel flavors you don't want.

**Boiling**: Don't cover the kettle completely – some evaporation is good. If it starts to boil over, a quick spray of water or reduce heat immediately. Have a spray bottle ready.

**Cooling**: The faster the better. Below 80°F, spoilage bacteria slow down significantly. Target 68-70°F before pitching.

**Aeration**: After cooling, wort needs oxygen for yeast health. Splash, shake, or stir vigorously. Once fermentation starts, never add oxygen – it creates off-flavors.`,
      },
      {
        title: 'Common First-Brew Mistakes to Avoid',
        content: `1. Not sanitizing properly (worth repeating!)
2. Pitching yeast into too-hot wort (kills the yeast)
3. Not cooling wort fast enough (increases infection risk)
4. Skipping the hydrometer reading (you won't know when fermentation is done)
5. Using too much heat too fast (boilovers make a huge mess)
6. Squeezing the grain bag too hard (extracts tannins)
7. Opening the fermenter to "check on it" (introduces oxygen and bacteria)
8. Panicking when something small goes wrong (beer is forgiving!)`,
      },
    ],
    tips: [
      'Have all your ingredients and equipment ready before you start heating water',
      'Set timers for hop additions – it\'s easy to lose track of time',
      'Keep a spray bottle of sanitizer handy for last-minute sanitizing',
      'Take notes! Record times, temperatures, and any deviations from the recipe',
      'Stay calm if something goes wrong – beer wants to be made, it\'s quite forgiving',
    ],
  },
  {
    id: 'fermentation',
    title: '6. Fermentation: Where Beer Is Made',
    content: `You've made wort. Now yeast makes it into beer. Fermentation is where the magic happens, and patience is your best friend.`,
    subsections: [
      {
        title: 'Primary Fermentation Explained',
        content: `Primary fermentation is when yeast converts sugars into alcohol and CO2. It happens in three phases:

**Lag Phase** (6-24 hours): No visible activity. Yeast is reproducing and preparing. Don't worry if you see no bubbles yet. Temperature, yeast health, and pitch rate affect lag time.

**Active Fermentation** (2-7 days): This is the exciting part! Bubbles in the airlock, krausen (foam) on top, sometimes violent activity. The fermenter might be warm to the touch from yeast metabolism. This is normal and good. CO2 is heavier than air, forming a protective blanket over your beer.

**Conditioning** (3-14 days): Activity slows, krausen falls, beer begins to clear. Yeast is cleaning up byproducts like diacetyl and acetaldehyde. Don't rush this – let the yeast finish its work.`,
      },
      {
        title: 'What\'s Happening Inside',
        content: `Yeast is eating sugar and producing alcohol, CO2, and flavor compounds (esters and phenols). Temperature affects which flavors develop. Warmer fermentation = more fruity esters. Cooler = cleaner, crisper flavor.

The yeast reproduces rapidly at first (why active fermentation is so vigorous), then switches to eating sugar and making alcohol. When sugars are mostly consumed, yeast flocculates (clumps together) and falls to the bottom as sediment.

Different yeast strains have different characteristics. Some finish fast (5 days), others are slow (3 weeks). Some flocculate tightly (clear beer), others stay suspended (hazy beer). Trust the strain and give it time.`,
      },
      {
        title: 'Temperature Control Importance',
        content: `This cannot be overstated: fermentation temperature is the #1 factor affecting beer flavor (after sanitation).

**Too Hot** (>78°F for most ales): Fusel alcohols (hot, harsh, solvent-like), excessive fruity esters, potentially stuck fermentation as yeast gets stressed.

**Too Cold** (<60°F for most ales): Slow or stalled fermentation, underattenuation (sweet beer), yeast won't clean up diacetyl.

**Big Temperature Swings**: Stress the yeast, create off-flavors, can stall fermentation.

**Ideal**: Consistent temperature in the recommended range for your yeast strain. Most ale yeasts are happy at 66-70°F. Lagers need 48-55°F. Use a fermination chamber (temp-controlled fridge/freezer) if possible, or find the coolest, most stable spot in your house.`,
      },
      {
        title: 'Signs of Active Fermentation',
        content: `**What You'll See**: Bubbles in the airlock (every 10-30 seconds during peak), krausen (thick foam on top, can be 1-3 inches thick), churning visible through clear fermenters, beer appears cloudy with suspended yeast.

**What You Won't Always See**: Sometimes the fermenter lid doesn't seal perfectly and CO2 escapes without bubbling the airlock. This is fine. The CO2 blanket still protects your beer.

**When to Worry**: No activity after 48 hours (check fermentation temperature, pitch more yeast if needed). Foul smell (infection – but note that some yeast strains smell like sulfur during fermentation, which is normal).`,
      },
      {
        title: 'How Long to Ferment',
        content: `**General Timeline**:
- Ales: 1-2 weeks minimum (pale ales, IPAs, stouts)
- Belgian ales: 2-3 weeks (complex flavors need time)
- Lagers: 3-4 weeks primary, then 4-8 weeks lagering
- High-gravity beers: 3-6 weeks (more sugar = longer fermentation)

**When Is It Done?** Take a hydrometer reading. Wait 3 days. Take another reading. If the gravity is the same both times (within 0.002), fermentation is complete. This is your Final Gravity (FG).

Never rely on airlock activity alone – it can stop while fermentation is still going. Always confirm with hydrometer.

**Don't Rush**: Leave beer on the yeast for at least a week after activity stops. The yeast is cleaning up. Patience makes better beer.`,
      },
      {
        title: 'Secondary Fermentation (Optional)',
        content: `Secondary fermentation means transferring beer off the yeast sediment into a clean fermenter for conditioning and clarification.

**When to Do It**: Beers sitting more than 4 weeks, or if you're dry hopping/adding fruit. Not necessary for most ales that ferment in 2 weeks.

**When to Skip It**: Most modern homebrewers skip secondary. Improved yeast health means autolysis (yeast death flavors) takes months, not weeks. Each transfer risks oxidation and infection. Primary-only is fine.

**If You Do Secondary**: Wait until primary is complete. Sanitize everything. Siphon gently to avoid splashing. Leave the trub (sediment) behind.`,
      },
      {
        title: 'Dry Hopping',
        content: `Adding hops during or after fermentation for intense aroma without bitterness.

**Timing**: Add when fermentation slows but before final gravity (days 5-7), or after fermentation completes. Leave for 3-7 days.

**Amount**: 0.5-2 oz per 5 gallons for subtle aroma, up to 4-8 oz for heavily hopped IPAs.

**Method**: Sanitize a mesh bag, add hop pellets, drop in the fermenter, weight it down if needed. Some hops float, creating a "hop cap." You can also add pellets loose.

**When to Harvest**: Remove before packaging, or leave in for fuller flavor (most homebrewers leave it).`,
      },
    ],
    warnings: [
      'DO NOT open the fermenter to "check on it" during active fermentation',
      'DO NOT add oxygen after fermentation starts – creates cardboard flavors',
      'DO NOT bottle before confirming FG is stable – bottle bombs are dangerous',
    ],
  },
  {
    id: 'bottling',
    title: '7. Bottling Day: Carbonation and Packaging',
    content: `Your beer is fermented. Now it's time to bottle and carbonate. Bottling takes 2-3 hours but is straightforward. Patience required: bottles need 2-3 weeks to carbonate.`,
    subsections: [
      {
        title: 'When Your Beer Is Ready to Bottle',
        content: `**Requirements**:
1. Final Gravity stable for 3+ days (same reading twice)
2. Beer has cleared somewhat (may still be slightly hazy)
3. No signs of active fermentation
4. At least 1-2 weeks in primary (2-3 weeks is better)
5. Tastes like flat beer (no off-flavors that won't age out)

**Taste Test**: Draw a small sample when you take your FG reading. It should taste like beer – maybe a bit yeasty or young, but fundamentally beer-like. If it tastes bad (sour, vinegar, band-aid, solvent), something went wrong. Ask for help on a homebrew forum before bottling.`,
      },
      {
        title: 'Equipment Needed',
        content: `- 48-54 clean bottles (12 oz size)
- Bottle caps (get new ones, don't reuse)
- Bottle capper
- Bottling bucket with spigot
- Siphon and tubing
- Bottle filler (or just tubing)
- Priming sugar and small pot
- Sanitizer (Star San)
- Bottle brush
- Patience`,
      },
      {
        title: 'Priming Sugar Explained',
        content: `**Why Priming Sugar?** Bottled beer carbonates naturally. You add a precise amount of sugar at bottling. Remaining yeast in the beer eats this sugar, creating CO2 that dissolves into the beer (can't escape the sealed bottle) = carbonation.

**How Much?** Depends on beer style:
- British ales: 2.0-2.3 volumes CO2 (3-4 oz corn sugar per 5 gal)
- American ales: 2.2-2.7 volumes (4-5 oz per 5 gal)
- Wheat beers: 3.0-4.0 volumes (5-6 oz per 5 gal)
- Belgian ales: 2.5-3.5 volumes (5-5.5 oz per 5 gal)
- Lagers: 2.5-2.8 volumes (4.5-5 oz per 5 gal)

Use a priming sugar calculator online. They factor in temperature and precise volumes.

**Types of Priming Sugar**: Corn sugar (dextrose) is standard – ferments completely, doesn't add flavor. Table sugar (sucrose) works but can add cidery notes. DME adds body. Honey adds honey flavor.`,
      },
      {
        title: 'Calculating Priming Sugar',
        content: `Use an online calculator (BrewersFriend has a good one). Input:
- Beer volume (actual, not target – account for losses)
- Current temperature
- Desired carbonation level
- Sugar type

Example: 5 gallons at 68°F, American Pale Ale (2.5 volumes CO2), using corn sugar = 4.5 oz.

**Dissolve Before Adding**: Boil priming sugar in 1-2 cups of water for 10-15 minutes to sterilize. Let cool. This ensures even distribution and kills any bacteria.`,
      },
      {
        title: 'Step-by-Step Bottling Process',
        content: `**Step 1: Sanitize Everything** (30 minutes)
This is where most bottling time goes. Sanitize bottles (run through dishwasher on sanitize cycle, or soak in Star San), caps, bottling bucket, siphon, tubing, bottle filler. You'll need a LOT of Star San solution.

**Step 2: Prepare Priming Solution** (15 minutes)
Weigh your priming sugar. Boil in 2 cups of water for 10 minutes. Cover and let cool while you set up.

**Step 3: Transfer Beer to Bottling Bucket** (20 minutes)
Pour cooled priming solution into the sanitized bottling bucket. Siphon beer from the fermenter into the bottling bucket, on top of the priming solution. The gentle stirring action of beer flowing in mixes the sugar evenly. Avoid splashing (no oxygen!).

Leave the yeast sediment (trub) behind in the fermenter. Siphon carefully to avoid disturbing it. You'll lose ~1/2 gallon to trub – that's normal.

**Step 4: Fill Bottles** (45 minutes)
Attach sanitized tubing and bottle filler to the spigot. Put the filler in a bottle, press down to fill. Fill to 1-1.5 inches from the top. When you remove the filler, it'll leave proper headspace.

Work assembly-line style: fill 6 bottles, cap 6 bottles, repeat. Makes the process faster.

**Step 5: Cap Bottles** (30 minutes)
Place a sanitized cap on each bottle. Use the capper to crimp it down. Should be tight and secure. Bad seals = flat beer or oxidation.

**Step 6: Store for Conditioning** (2-3 weeks)
Put bottles somewhere dark, room temperature (65-75°F), and safe (in case of rare bottle bombs). Mark them with the brew date and when they'll be ready.

Wait 2 weeks minimum. 3 weeks is better. High-gravity beers need 4-6 weeks. Yeast needs time to carbonate the beer.`,
      },
      {
        title: 'How Much Headspace',
        content: `**Headspace** is the air gap between beer and cap. Too much = more oxygen = staling. Too little = no room for foam = hard to cap without spillage.

**Proper Headspace**: About 1-1.5 inches when the bottle filler is removed. This compresses to about 3/4 inch after capping.

Bottle fillers are spring-loaded and fill from the bottom up, making consistent fill levels easy.`,
      },
      {
        title: 'Bottle Conditioning Timeline',
        content: `**Week 1**: Yeast wakes up and starts consuming priming sugar. Some carbonation begins. Beer is still flat if you open one (don't).

**Week 2**: Carbonation building. Beer is drinkable but may be slightly undercarbonated. Flavors still melding.

**Week 3+**: Properly carbonated. Flavors have melded and smoothed. This is the minimum wait time.

**Patience Pays**: The difference between week 2 and week 3 is significant. Week 4 is even better. Strong beers improve for months.

**Check Carbonation**: After 2 weeks, chill one bottle for 24 hours. Open carefully. If it's flat, wait another week. If it gushes everywhere, you over-primed or bottled before fermentation finished (careful with the rest).`,
      },
    ],
    tips: [
      'Sanitize more bottles than you think you need – some will break or get contaminated',
      'Bottle in the morning after coffee – you want to be alert',
      'Use a bottle tree or racks to keep sanitized bottles organized',
      'Recruit a friend to help – one fills, one caps = much faster',
      'Keep bottles at room temperature during conditioning, then refrigerate when ready to drink',
    ],
    warnings: [
      'Too much priming sugar = overcarbonation = bottle bombs (dangerous!)',
      'Always use a calculator – never guess on priming sugar amounts',
      'If a bottle is gushing, put the whole batch in the fridge to slow carbonation',
    ],
  },
  {
    id: 'enjoying',
    title: '8. Enjoying Your Beer',
    content: `Congratulations! You made beer. Now comes the best part – drinking it!`,
    subsections: [
      {
        title: 'How to Know When It\'s Ready',
        content: `**Minimum**: 2 weeks after bottling for light ales. Most beers are better at 3-4 weeks.

**Test Bottle**: After 2 weeks, chill one bottle for 24 hours. Open it. Listen for a good "pssst" (carbonation escaping). Pour into a glass. It should have a nice head (foam). If it's flat, wait another week.

**Longer Aging**: IPAs are best fresh (drink within 2-3 months). Stouts and strong ales improve for months or even years. Barleywines can age 5+ years.`,
      },
      {
        title: 'Proper Serving Temperature',
        content: `Different styles taste best at different temperatures:

**Cold (38-45°F)**: Light lagers, wheat beers, pilsners. Crisp and refreshing.

**Cool (45-50°F)**: Pale ales, IPAs, amber ales. Hop character shines.

**Cellar (50-55°F)**: Stouts, porters, Belgian ales, English ales. Complex flavors emerge.

**Room Temp (55-60°F)**: Barleywines, imperial stouts, strong Belgian ales. Full flavor complexity.

Too cold suppresses flavors and aromas. Too warm brings out alcohol heat. When in doubt, start cold and let it warm – you can always cool it down again.`,
      },
      {
        title: 'Glassware Basics',
        content: `The right glass enhances the experience:

**Pint Glass**: All-purpose. Good head retention, showcases color.

**Tulip/Snifter**: For aromatic beers (IPAs, Belgians). Concentrates aroma.

**Wheat Beer Glass**: Tall, holds thick head, shows off clarity.

**Stein/Mug**: Traditional lagers, keeps beer cold.

**Wine Glass**: Works surprisingly well for most beer styles.

Always rinse glasses before pouring (removes dust and sanitizer residue). Never put beer in a glass with soap residue – kills the head.`,
      },
      {
        title: 'Evaluating Your Beer',
        content: `**Appearance**: Clear or hazy? Color match your target? Head retention good? Rising carbonation bubbles?

**Aroma**: Hop aroma present? Malt sweetness? Any off-aromas (sulfur, vinegar, band-aid)?

**Flavor**: Balanced or dominated by one element? Finish clean or lingering? Bitterness appropriate? Any off-flavors?

**Mouthfeel**: Carbonation level right? Body (thin, medium, full)? Astringency or smoothness?

Be honest but not harsh. Your first beer might have flaws, but if it tastes like beer and you made it yourself, that's a win!`,
      },
      {
        title: 'Taking Notes for Improvement',
        content: `Keep a brew log. Record:
- Recipe and any adjustments
- Brew day details (OG, timing issues, etc.)
- Fermentation notes (temperature, duration, FG)
- Bottling date and priming sugar amount
- Tasting notes when you drink it
- What you'd change next time

Your memory is not reliable across batches. Written notes help you replicate successes and avoid repeating mistakes.`,
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: '9. Troubleshooting Common Problems',
    content: `Things don't always go perfectly. Here's how to diagnose and fix common issues.`,
    subsections: [
      {
        title: 'Off-Flavors and Their Causes',
        content: `**Diacetyl (Butterscotch/Buttery)**: Caused by incomplete fermentation or premature packaging. Let fermentation complete fully. Raise temperature last 2 days of fermentation for "diacetyl rest." Belgian yeasts naturally produce some diacetyl.

**Acetaldehyde (Green Apple/Fresh-Cut Pumpkin)**: Young beer not fully conditioned. Give it more time. Can also be caused by oxidation or weak yeast.

**DMS (Cooked Corn/Cabbage)**: Weak boil that doesn't drive off DMS precursors, or slow cooling after the boil. Solution: vigorous rolling boil, cool wort quickly, use less pale malt (Pilsner malt is high in DMS precursors).

**Phenolic (Band-Aid/Medicinal/Plastic)**: Wild yeast infection, chlorophenols from chlorine/chloramine in water, or overpitching. Remove chlorine/chloramine from water. Sanitize better. Some Belgian yeasts naturally produce phenolics (clove-like).

**Sour/Vinegar (Acidic)**: Bacterial infection, usually Acetobacter or Lactobacillus. Caused by poor sanitation or oxygen exposure during fermentation/storage. Prevention: sanitize obsessively, minimize oxygen after fermentation starts.

**Fusel Alcohols (Hot/Solvent/Harsh)**: Fermentation temperature too high, overpitching, or low yeast nutrients. Keep fermentation in proper temp range. Don't underpitch or overpitch yeast.

**Metallic**: Old ingredients, water with high iron content, or metal equipment reacting with beer. Use fresh ingredients, check water report, use stainless steel or plastic (not aluminum for long contact).

**Papery/Cardboard (Stale)**: Oxidation. Caused by oxygen exposure after fermentation, or aged beer. Prevent: minimize splashing during transfer and bottling, drink hoppy beers fresh, store bottles cold and dark.`,
      },
      {
        title: 'Fermentation Issues',
        content: `**No Activity in Airlock (After 48 Hours)**:
- Check fermentation temperature (too cold = dormant yeast)
- Check lid seal (CO2 might be escaping without bubbling airlock)
- Check if yeast was old or improperly stored
- Look for other signs (krausen, cloudiness) even without bubbles
- If nothing after 72 hours, pitch more yeast

**Stuck Fermentation (Stops Before Target FG)**:
- Temperature too low – warm it up a few degrees
- Yeast stressed or insufficient – add more yeast
- Lack of nutrients in high-gravity worts – add yeast nutrient
- pH too low/high – check mash pH next time
- Patience – sometimes yeast just needs time

**Overflow/Blowoff**:
- Krausen escapes through airlock during vigorous fermentation
- Prevention: use proper headspace (at least 20% empty), use blowoff tube instead of airlock for first 3 days of active fermentation
- If it happens: clean up quickly, sanitize everything, replace airlock, beer is usually fine`,
      },
      {
        title: 'Carbonation Problems',
        content: `**Flat Beer**:
- Not enough priming sugar – recalculate and add more
- Beer too cold during conditioning – move to warmer spot
- Not enough time – wait another week
- Fermentation completely finished and no viable yeast left – add fresh yeast at bottling (rare)
- Bottle caps not sealing – check caps, try recapping

**Over-Carbonated/Gushing**:
- Too much priming sugar – use a calculator next time
- Bottled before fermentation complete (still sugar left) – always confirm stable FG
- Infection producing extra CO2 – taste for off-flavors
- Immediate action: refrigerate all bottles to slow carbonation, drink cold, open carefully

**Bottle Bombs (Exploding Bottles)**:
- Extreme overcarbonation – dangerous!
- Move all bottles outside or to a safe area
- Refrigerate immediately to slow process
- Open carefully over a sink, or let them slowly vent
- This is WHY you always confirm FG is stable before bottling`,
      },
      {
        title: 'Clarity Issues',
        content: `**Cloudy/Hazy Beer**:
- Young beer – wait longer, beer clears with time
- Yeast still in suspension – chill beer (cold crashes yeast out)
- Chill haze (proteins) – use Irish Moss or Whirlfloc during the boil
- Permanent haze – too much protein (excess adjuncts), incomplete protein break during boil
- Some styles (wheat beer, NEIPA) are supposed to be hazy

**Sediment in Bottles**:
- Normal! Every bottle will have some yeast sediment
- Pour carefully, leaving last half-inch in the bottle
- Sediment is harmless and actually healthy
- Some people drink it (vitamin B!), most leave it behind`,
      },
    ],
    warnings: [
      'If beer smells like sewage, vinegar, or vomit, it\'s infected. Drain pour it.',
      'Bottle bombs are dangerous – if you suspect overcarbonation, refrigerate immediately',
      'Some off-flavors age out (acetaldehyde, sulfur), others don\'t (infection, phenolics)',
    ],
  },
  {
    id: 'next-steps',
    title: '10. Next Steps - Improving Your Craft',
    content: `You've made beer! Now the real fun begins – refining your process and experimenting.`,
    subsections: [
      {
        title: 'Moving to All-Grain Brewing',
        content: `Extract brewing is great, but all-grain gives you complete control over your beer.

**What Is All-Grain?** You start with crushed malted grains, "mash" them in hot water to extract sugars, then rinse (sparge) to collect all the sweet wort. It's more work but incredibly rewarding.

**Additional Equipment Needed**: Mash tun (insulated cooler with false bottom, $50-100), larger brew kettle (10+ gallons, $100-200), grain mill (optional but helpful, $50-150).

**When to Make the Jump**: After 5-10 extract batches, when you understand the process and want more control. All-grain brew days are 6-8 hours vs 4-5 for extract.

**Why Switch?** Fresher flavor, complete control over recipe, cheaper ingredients ($25-35 per batch vs $40-50), and it's more "from scratch" satisfying.`,
      },
      {
        title: 'Building Recipes',
        content: `Start by cloning commercial beers you love. Then modify recipes gradually – change one thing at a time so you learn what each ingredient does.

**Recipe Building Basics**:
1. Choose a style (BJCP guidelines are helpful)
2. Calculate grain bill for target gravity
3. Calculate hop amounts for target IBU
4. Select appropriate yeast
5. Design fermentation schedule

**Software Helps**: BeerSmith, BrewersFriend, or Brewfather. They do calculations and store recipes.

**Start Simple**: Pale malt + one specialty malt + one hop variety + clean ale yeast = simple recipe to learn from. Complexity comes later.`,
      },
      {
        title: 'Advanced Techniques Preview',
        content: `**Water Chemistry**: Adjusting mineral content to match regional brewing profiles or optimize mash pH.

**Yeast Starters**: Growing liquid yeast to proper pitch rates for healthier fermentation.

**Step Mashing**: Multiple temperature rests during mashing to control fermentability.

**Barrel Aging**: Aging beer in spirit barrels for complex flavors.

**Sours and Wild Fermentation**: Intentionally adding bacteria or wild yeast for funky, sour beers.

**Lagering**: Cold conditioning lagers for months to develop clean, crisp profiles.

**High-Gravity Brewing**: Making big beers (8-12%+ ABV) that require special techniques.

Each of these is a deep rabbit hole. Master the basics first.`,
      },
      {
        title: 'Joining Homebrew Communities',
        content: `Homebrewing is better with friends!

**Local Homebrew Clubs**: Most cities have one. Monthly meetings, group buys, competitions, shared knowledge. Find yours via American Homebrewers Association.

**Online Forums**: HomeBrewTalk.com, r/Homebrewing on Reddit, BrewersFriend forums. Ask questions, share recipes, get feedback.

**Homebrew Shops**: Your local shop is a resource – ask questions, buy fresh ingredients, get advice. Support them!

**Social Media**: Instagram and YouTube have huge homebrewing communities. Watch others' brew days, share your own.`,
      },
      {
        title: 'Entering Competitions',
        content: `Competitions give you structured feedback from certified judges.

**Why Compete?** Honest feedback on your beer, see how you stack up, win ribbons and prizes, improve faster.

**Major Competitions**: National Homebrew Competition (NHC), local club competitions, state fairs.

**How to Enter**: Follow BJCP style guidelines strictly, package bottles carefully, enter multiple categories.

**Feedback**: Judges provide score sheets with detailed notes. Even low-scoring entries get valuable feedback.

Don't take low scores personally – even professional brewers started somewhere. Use feedback to improve.`,
      },
      {
        title: 'Resources for Continued Learning',
        content: `**Books**:
- "How to Brew" by John Palmer (the homebrewing bible)
- "The Complete Joy of Homebrewing" by Charlie Papazian (inspiring classic)
- "Brewing Classic Styles" by Jamil Zainasheff (proven recipes)
- "Water" by John Palmer (deep dive on water chemistry)

**Websites**:
- HomeBrewTalk.com (largest forum)
- Brewer's Friend (calculators and recipes)
- BJCP Style Guidelines (beer style authority)
- AHA.org (American Homebrewers Association)

**YouTube Channels**:
- Homebrew Academy
- Bertus Brewery
- City Steading Brews
- Clawhammer Supply

**Podcasts**:
- Brew Strong (technical deep dives)
- Basic Brewing Radio (practical tips)
- The Brewing Network (interviews and discussion)

Keep learning, keep brewing, keep improving!`,
      },
    ],
  },
  {
    id: 'glossary',
    title: '11. Glossary of Brewing Terms',
    content: `Common brewing terminology defined in plain English.`,
    subsections: [
      {
        title: 'Key Terms',
        content: `**ABV (Alcohol By Volume)**: Percentage of alcohol in your beer. Calculated from OG and FG.

**Adjunct**: Non-barley fermentables (corn, rice, sugar, oats). Can be good or cheap depending on use.

**Airlock**: One-way valve that lets CO2 escape fermenter while keeping oxygen/bacteria out.

**Attenuation**: Percentage of sugars fermented by yeast. High attenuation = dry beer. Low = sweet beer.

**Boil**: Rolling boil of wort for 60-90 minutes. Isomerizes hop alpha acids, sterilizes, drives off DMS, coagulates proteins.

**Bottle Conditioning**: Natural carbonation from yeast eating priming sugar in sealed bottles.

**Cold Crash**: Chilling beer to 32-40°F for 1-3 days to drop yeast and proteins out of suspension (clarity).

**Dry Hopping**: Adding hops during/after fermentation for aroma without bitterness.

**FG (Final Gravity)**: Density of beer after fermentation. Lower than OG because sugars converted to alcohol.

**Flocculation**: Yeast clumping and falling out of suspension. High flocculation = clear beer quickly.

**Hot Break**: Protein coagulation early in the boil. Looks like egg-drop soup. Normal and good.

**Hydrometer**: Glass instrument that measures wort/beer density (specific gravity). Floats higher in denser liquid.

**IBU (International Bitterness Units)**: Measurement of bitterness from hops. Pilsner = 25 IBU, Double IPA = 100+ IBU.

**Krausen**: Thick foam on top of fermenting beer. Composed of yeast, proteins, hop particles.

**Lagering**: Aging beer cold (32-45°F) for weeks to months. Smooths flavors, increases clarity.

**Mash**: Soaking crushed grains in hot water (145-158°F) to convert starches to fermentable sugars.

**OG (Original Gravity)**: Density of wort before fermentation. Higher OG = more sugar = more potential alcohol.

**Pitch**: Adding yeast to cooled wort.

**Priming Sugar**: Sugar added at bottling for carbonation.

**Racking**: Transferring beer from one vessel to another, usually leaving sediment behind.

**SRM (Standard Reference Method)**: Beer color measurement. 2 = pale yellow, 40 = black.

**Sparging**: Rinsing grain bed after mashing to extract remaining sugars.

**Trub**: Sediment at bottom of fermenter (yeast, proteins, hop matter). Leave behind when racking.

**Vorlauf**: Recirculating first runnings over grain bed to clarify wort and set the grain bed as a filter.

**Whirlpool**: Stirring wort in a circular motion after the boil to collect trub in center of kettle.

**Wort**: Unfermented beer. Sweet liquid extracted from grains or malt extract.`,
      },
    ],
  },
];

// Export for use in components
export default BEER_BREWING_GUIDE;
