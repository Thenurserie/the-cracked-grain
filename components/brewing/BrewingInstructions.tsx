'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, AlertTriangle } from 'lucide-react';

interface BrewingInstructionsProps {
  activeTab: string;
}

interface ListItem {
  label?: string;
  desc?: string;
  indent?: boolean;
}

interface InstructionSection {
  heading?: string;
  content?: string;
  list?: ListItem[];
  proTip?: string;
  warning?: string;
}

interface Instruction {
  title: string;
  sections: InstructionSection[];
}

const INSTRUCTIONS: Record<string, Instruction> = {
  'recipe-builder': {
    title: 'Building Your Recipe',
    sections: [
      {
        heading: 'Getting Started',
        content: 'Building a beer recipe is both art and science. Start by giving your recipe a memorable name and selecting a beer style (like American IPA, German Pilsner, or Irish Stout). The style selection helps set target parameters for color, bitterness, alcohol content, and overall character. Don\'t worry - you can always adjust these parameters as you learn and develop your palate.'
      },
      {
        heading: 'Brew Method Selection',
        content: 'Choose the brewing method that matches your equipment and experience level:',
        list: [
          { label: 'All-Grain', desc: 'Full control using 100% malted grains. Requires mashing equipment (mash tun, hot liquor tank). This is the most traditional method and gives you complete control over the final product, but requires more equipment and a longer brew day (typically 5-6 hours).' },
          { label: 'Extract (LME/DME)', desc: 'Uses pre-made liquid or dry malt extract. Simpler process perfect for beginners or those with limited space. Brew days are shorter (2-3 hours) and you skip the mashing step entirely. Results can be excellent with quality extracts.' },
          { label: 'Partial Mash', desc: 'Combines malt extract with some grain mashing. Gives you more control than pure extract brewing while being less equipment-intensive than all-grain. A great stepping stone between extract and all-grain brewing.' }
        ],
        proTip: 'New to brewing? Start with extract brewing to learn fermentation and hop timing before investing in all-grain equipment. Many award-winning beers have been made with extract!'
      },
      {
        heading: 'Batch Size & Efficiency',
        content: 'Enter your target finished volume in gallons (typically 5 gallons for homebrewers). Remember to account for losses to trub (sediment), hop absorption, and boil-off. A 5-gallon batch typically needs 6-6.5 gallons pre-boil volume.',
        list: [
          { label: 'Efficiency', desc: 'This is how much sugar you extract from grains during mashing. Set to 65-70% if you\'re a beginner, 72-78% for experienced all-grain brewers, or 100% if using malt extract (since extraction has already been done for you).' }
        ],
        warning: 'Don\'t overestimate your efficiency early on! It\'s better to end up with slightly higher gravity than expected. Track your actual efficiency over several batches and adjust accordingly.'
      },
      {
        heading: 'Boil Time',
        content: 'Standard boil time is 60 minutes for most beers. However, some styles benefit from adjustments: 90-minute boils help reduce DMS (dimethyl sulfide, which creates a cooked corn flavor) in pilsner malts and European lagers. Shorter boils (30-45 minutes) can work for hop-forward New England IPAs where you want to preserve delicate hop aromatics and minimize color development.'
      },
      {
        heading: 'Building Your Fermentables (Grain Bill)',
        content: 'Click \'+ Add Grain\' to start building your grain bill. Think of this as the foundation of your beer - it determines color, body, alcohol content, and much of the flavor.',
        list: [
          { label: 'Base Malts (80-90% of bill)', desc: 'These are the workhorses that provide most of your fermentable sugars. Common choices include 2-Row (clean, neutral), Pilsner (light, slightly sweet), Maris Otter (rich, biscuity), or Munich (adds malty depth and color).' },
          { label: 'Specialty Malts (10-20% of bill)', desc: 'These add color, flavor, and complexity. Crystal/Caramel malts add sweetness and body. Roasted malts provide coffee and chocolate notes. Wheat malts improve head retention and add a soft mouthfeel.' },
          { label: 'Percentage Matters', desc: 'Watch the percentage column - it shows how much each grain contributes to the total. A common beginner mistake is using too many specialty malts, which can create a muddled flavor. Start simple with 1-2 specialty malts max.' }
        ],
        proTip: 'For your first recipe, try 90% base malt and 10% crystal malt. This creates a clean, approachable beer that showcases the hops and yeast. As you gain experience, experiment with more complex grain bills.'
      },
      {
        heading: 'Adding Hops',
        content: 'Hops provide bitterness, flavor, and aroma. The timing of your hop additions dramatically affects the final beer:',
        list: [
          { label: 'Bittering Hops (60 min boil)', desc: 'Added at the start of the boil, these hops isomerize their alpha acids to provide clean bitterness. The long boil time drives off aromatic compounds, leaving pure bitterness behind.' },
          { label: 'Flavor Hops (15-30 min)', desc: 'Mid-boil additions contribute hop flavor with moderate bitterness. This is where you start to get hop character beyond just bitterness.' },
          { label: 'Aroma Hops (0-5 min, Whirlpool)', desc: 'Late additions and whirlpool hops (added after flame-out) provide intense hop aroma with minimal bitterness. These are crucial for hop-forward styles like IPAs.' },
          { label: 'Dry Hop', desc: 'Added during or after fermentation (not during the boil). Dry hopping provides intense aroma and flavor with zero bitterness. Essential for modern IPAs and pale ales.' }
        ],
        warning: 'More hops doesn\'t always mean better beer! Start with balanced recipes and adjust based on your preferences. A common mistake is over-bittering - aim for IBUs appropriate to your style (20-30 for pale ales, 40-70 for IPAs).'
      },
      {
        heading: 'Understanding IBUs',
        content: 'IBU (International Bitterness Units) measures the bitterness in your beer. The calculator shows real-time IBUs as you add hops. Lower gravity worts extract bitterness more efficiently, which is why the calculator accounts for your recipe\'s gravity. Style guidelines: Light lagers (8-12 IBU), Pale Ales (30-45 IBU), IPAs (40-70+ IBU), Imperial Stouts (50-80 IBU).'
      },
      {
        heading: 'Selecting Yeast',
        content: 'Yeast is often called the most important ingredient - it produces alcohol, CO2, and a huge portion of the beer\'s flavor profile.',
        list: [
          { label: 'Ale Yeast (Saccharomyces cerevisiae)', desc: 'Ferments at warmer temperatures (65-72°F). Works quickly (5-7 days primary fermentation). Produces fruity esters and complexity. Used for most beer styles including IPAs, stouts, and Belgian ales.' },
          { label: 'Lager Yeast (Saccharomyces pastorianus)', desc: 'Requires cooler temperatures (48-55°F). Ferments more slowly (7-14 days primary). Produces clean, crisp flavors. Requires temperature control. Used for pilsners, Märzens, and traditional lagers.' },
          { label: 'Attenuation', desc: 'This percentage shows how much sugar the yeast will consume. Higher attenuation (75-85%) creates drier, more alcoholic beers. Lower attenuation (65-75%) leaves more residual sweetness and body. Choose based on your desired final beer character.' }
        ],
        proTip: 'Yeast selection can completely change a recipe! The same grain bill and hops with different yeast will produce noticeably different beers. Try the same recipe with different yeasts to learn their character.'
      },
      {
        heading: 'Understanding Calculated Values',
        content: 'The calculator shows real-time estimates as you build your recipe:',
        list: [
          { label: 'OG (Original Gravity)', desc: 'The density of your wort before fermentation, shown as a specific gravity like 1.050. Higher numbers mean more sugar (and potentially more alcohol). Typical range: 1.040-1.060 for most beers, 1.070+ for big beers.' },
          { label: 'FG (Final Gravity)', desc: 'Estimated density after fermentation. The difference between OG and FG tells you how much sugar was consumed. Typical range: 1.008-1.016 for most beers.' },
          { label: 'ABV (Alcohol By Volume)', desc: 'Calculated from OG and FG. This is your beer\'s alcohol percentage. Session beers: 3-4%, Standard ales: 5-6%, IPAs: 6-7.5%, Big beers: 8%+' },
          { label: 'SRM (Standard Reference Method)', desc: 'Color measurement. Lower numbers are pale (2-4 = pale golden), middle range is amber (10-15), higher numbers are dark (30+ = black). Visual reference helps you anticipate your beer\'s appearance.' },
          { label: 'IBU (International Bitterness Units)', desc: 'Bitterness level from hops. Balance with malt sweetness for best results. The IBU/OG ratio helps gauge balance: 0.5 is malty, 1.0 is balanced, 1.5+ is very hoppy.' }
        ]
      },
      {
        heading: 'Auto-Pricing Features',
        content: 'Ingredient prices are automatically looked up from our shop database as you add items. Each ingredient shows a confidence indicator:',
        list: [
          { label: 'Green checkmark', desc: 'Exact or high-confidence match found in the shop. The price shown is accurate and you can add this item directly to your cart.' },
          { label: 'Yellow alert', desc: 'Possible match with medium confidence. The price is estimated - verify accuracy before using for planning.' },
          { label: 'Gray alert', desc: 'No match found in shop. Enter price manually if you want cost estimates, or source this ingredient elsewhere.' },
          { desc: 'You can always override auto-prices by typing in the price field. Your manual entries are preserved and won\'t be overwritten.' }
        ],
        proTip: 'Use the auto-pricing to compare recipes and estimate brew costs. The cost per bottle/pint helps you understand the economics of homebrewing vs buying commercial beer!'
      },
      {
        heading: 'Recipe Cost Summary',
        content: 'View estimated costs broken down by ingredient category (grains, hops, yeast). The summary calculates total recipe cost and shows cost per 12oz bottle and cost per pint. This helps you understand the economics of your brewing and make informed decisions about ingredient upgrades or substitutions. Remember that homebrewing is rarely cheaper than buying beer - you brew for quality, variety, and the joy of creation!'
      },
      {
        heading: 'Shopping List Generation',
        content: 'Click \'Generate Shopping List\' to create a comprehensive, organized list of all ingredients with quantities and prices. The list is organized by category (grains, hops, yeast, other) and includes estimated totals. You can copy the list to your clipboard for easy sharing or paste into notes, or print it directly for taking to your homebrew shop. The list maintains quantities in appropriate units (lbs for grains, oz for hops, pkg for yeast).'
      },
      {
        heading: 'Saving and Loading Recipes',
        content: 'Sign in to save your recipes to your personal library. Saved recipes include all ingredients, quantities, timings, and notes. You can load saved recipes anytime to brew again or create variations. Use the duplicate feature to create a new recipe based on an existing one - perfect for tweaking recipes over time!',
        warning: 'Guest users can build recipes but can\'t save them! Sign in to preserve your work and track your brewing history.'
      },
      {
        heading: 'Exporting Recipes',
        content: 'Export your recipes to BeerXML format for sharing with other brewers or importing into brewing software. This standardized format is supported by most brewing applications and ensures your recipe can be used anywhere.'
      },
      {
        heading: 'Recipe Design Tips',
        list: [
          { desc: 'Start with proven recipes (clones or style-specific recipes) before creating your own' },
          { desc: 'Change one variable at a time so you can learn cause and effect' },
          { desc: 'Keep detailed notes - your brewing records are more valuable than any book' },
          { desc: 'Respect style guidelines but don\'t be afraid to experiment once you understand the rules' },
          { desc: 'Simple recipes often produce the best beers - don\'t add ingredients just because you can' },
          { desc: 'Let your beer tell you what it needs in the next iteration' }
        ]
      },
      {
        heading: 'Common Mistakes to Avoid',
        list: [
          { desc: 'Using too many specialty malts (keep it to 2-3 max for your first batches)' },
          { desc: 'Over-hopping (more isn\'t always better - balance is key)' },
          { desc: 'Ignoring water chemistry (at least use filtered water and avoid chlorine)' },
          { desc: 'Skipping temperature control for fermentation (this is critical for clean beer)' },
          { desc: 'Rushing the process (good beer takes time - be patient)' },
          { desc: 'Not sanitizing properly (sanitation is 90% of brewing success)' },
          { desc: 'Forgetting to take gravity readings (you need OG and FG for ABV and to know when fermentation is complete)' }
        ],
        warning: 'The most expensive mistake is brewing a batch you don\'t enjoy. Start with styles you like to drink and build from there!'
      }
    ]
  },
  'mash-schedule': {
    title: 'Mash Schedule Designer',
    sections: [
      {
        heading: 'What is Mashing?',
        content: 'Mashing is the hot water steeping process that converts the starches in malted grain into fermentable sugars. This is the foundation of all-grain brewing. During the mash, enzymes naturally present in the malt break down complex starches into simple sugars that yeast can ferment. Temperature is critical - different temperatures activate different enzymes, allowing you to control the body, sweetness, and fermentability of your beer.'
      },
      {
        heading: 'Understanding Input Fields',
        list: [
          { label: 'Grain Weight', desc: 'Total weight of all grains in your recipe (in pounds). This determines how much water you need and affects heat capacity calculations.' },
          { label: 'Grain Temperature', desc: 'Starting temperature of your grain (usually room temperature, 65-70°F). Colder grain requires hotter strike water to hit your target mash temperature.' },
          { label: 'Mash Thickness (qt/lb)', desc: 'Water-to-grain ratio. Typical range is 1.25-1.5 quarts per pound. Thicker mashes (1.25) favor alpha amylase and create more body. Thinner mashes (1.5-2.0) favor beta amylase and create drier, more fermentable wort.' },
          { label: 'Mash Tun Type', desc: 'Your equipment affects heat loss. Insulated coolers lose minimal heat (1-2°F per hour). Metal pots lose more heat and may need recirculation or additional heating to maintain temperature.' },
          { label: 'Expected Heat Loss', desc: 'How many degrees your mash will drop per hour. Coolers: 2-3°F/hour. Direct-fired systems with good insulation: 1-2°F/hour. Adjust based on your experience with your system.' }
        ]
      },
      {
        heading: 'Strike Water Calculation',
        content: 'Strike water is the initial hot water you add to your grain. The calculator determines the precise temperature needed to hit your target mash temperature when combined with room-temperature grain. This calculation accounts for grain temperature, grain weight (grain absorbs heat), mash tun heat absorption (equipment steals heat), and your target mash temperature.',
        proTip: 'Strike water is typically 10-15°F hotter than your target mash temp. Always verify with your thermometer - trust but verify! Pre-heat your mash tun with hot water while you heat your strike water to minimize heat loss to the equipment.'
      },
      {
        heading: 'Types of Mash Schedules',
        list: [
          { label: 'Single Infusion', desc: 'The simplest method: one temperature for the entire mash (usually 60-90 minutes). Works perfectly for well-modified modern malts. This is what most homebrewers use. Target 152-156°F for balanced beers, 148-151°F for dry/hoppy beers, 156-160°F for sweet/malty beers.' },
          { label: 'Step Mashing', desc: 'Multiple temperature rests during the mash. Traditionally used for undermodified malts or specific beer styles. Requires heating capability (direct fire, RIMS, HERMS). Each rest activates different enzymes for specific purposes.' },
          { label: 'Decoction', desc: 'Traditional German technique where you remove part of the mash, boil it, and return it to raise the temperature. Creates rich malt complexity and color. Time-intensive but traditional for certain lagers, Märzens, and Bocks.' }
        ]
      },
      {
        heading: 'Mash Temperature Rests Explained',
        list: [
          { label: 'Acid Rest (95-113°F)', desc: 'Historically used to lower mash pH with undermodified malt. Rarely needed with modern well-modified malts unless you have very alkaline water. Duration: 15-30 minutes if used.' },
          { label: 'Protein Rest (113-131°F)', desc: 'Breaks down large proteins into yeast-usable amino acids. Improves head retention and body. Important for wheat beers and when using high percentages of unmalted adjuncts. Can reduce body in well-modified malts. Duration: 15-20 minutes.' },
          { label: 'Beta Saccharification Rest (144-149°F)', desc: 'Beta amylase creates highly fermentable sugars (maltose). Results in drier, more attenuated beers with less body. Ideal for hoppy beers, saisons, and Belgian strong ales. This enzyme is destroyed above 149°F. Duration: 30-60 minutes.' },
          { label: 'Alpha Saccharification Rest (154-162°F)', desc: 'Alpha amylase creates less fermentable sugars (dextrins and complex sugars). Results in sweeter, fuller-bodied beers. Used for malty styles like stouts, Scottish ales, and English bitters. This is the most common single-infusion temperature range. Duration: 60-90 minutes.' },
          { label: 'Mash Out (168-172°F)', desc: 'Denatures enzymes to lock in your sugar profile and makes the wort more fluid for easier lautering. Not essential but helpful for efficiency and preventing stuck sparges. Duration: 10 minutes.' }
        ],
        warning: 'Temperature precision matters! A 4°F difference can significantly change your beer\'s body and sweetness. Invest in a good thermometer and calibrate it regularly.'
      },
      {
        heading: 'Single Infusion Temperature Guide',
        content: 'For most homebrewers, single infusion at the right temperature is all you need:',
        list: [
          { label: '148-151°F', desc: 'Dry, highly attenuated beers. Use for: IPAs, Saisons, Belgian Strong Ales, West Coast styles. Expect 78-85% apparent attenuation.' },
          { label: '152-153°F', desc: 'Balanced attenuation with moderate body. Use for: American Pale Ales, Amber Ales, most balanced styles. Expect 73-77% apparent attenuation.' },
          { label: '154-156°F', desc: 'Medium body with residual sweetness. Use for: English Ales, Brown Ales, Porters. Expect 68-73% apparent attenuation.' },
          { label: '157-160°F', desc: 'Full body, sweet finish. Use for: Stouts, Scottish Ales, Sweet Stouts, Milk Stouts. Expect 65-70% apparent attenuation.' }
        ]
      },
      {
        heading: 'Using the Mash Timer',
        content: 'Once you\'ve added your strike water and grain, use the built-in timer to track your mash progress. The timer shows elapsed time and can alert you when each step is complete. For step mashing, the timer helps you track each rest period. Audio alerts notify you when it\'s time to move to the next step.',
        proTip: 'Set your timer for 60 minutes for most single infusion mashes. Use that time to heat your sparge water, clean up, or prepare your boil kettle. Efficient brew days are about good time management!'
      },
      {
        heading: 'Sparge Water Calculation',
        content: 'After mashing, you need to rinse the grain bed to extract remaining sugars. The calculator shows how much sparge water you need based on your batch size, grain absorption (grain holds about 0.1-0.125 gallons per pound), equipment dead space, and desired pre-boil volume. Heat sparge water to 168-170°F to stop enzyme activity and improve flow.',
        list: [
          { label: 'Fly Sparging', desc: 'Continuous slow rinse with hot water while draining the mash tun. Traditional method that maximizes efficiency (75-80%+). Requires careful flow management to avoid channeling. Duration: 60-90 minutes total lauter time.' },
          { label: 'Batch Sparging', desc: 'Add all sparge water at once, stir, let settle, then drain. Faster and simpler. Slightly lower efficiency (70-75%) but more forgiving. Most homebrewers prefer this method. Duration: 30-45 minutes total lauter time.' },
          { label: 'No-Sparge', desc: 'Skip sparging entirely - use all water in the initial mash. Requires larger mash tun and uses more grain. Creates richer, fuller-bodied beers. Lowest efficiency (60-65%) but fastest process.' }
        ]
      },
      {
        heading: 'Using Presets',
        content: 'The calculator includes common mash schedule presets for different beer styles. These are starting points based on traditional brewing practices. Select a preset to auto-fill a complete mash schedule, then customize as needed for your system and recipe. Presets include: Single Infusion (most common), Hochkurz (German for "high short" - decoction alternative), Step Mash for wheat beers, and Traditional decoction schedules.'
      },
      {
        heading: 'Saving Custom Schedules',
        content: 'Once you\'ve dialed in a mash schedule that works perfectly for your system, save it as a custom preset. You can reuse these schedules across different recipes, scaling the water volumes automatically based on grain weight. This is especially valuable once you learn your system\'s quirks and heat loss characteristics.'
      },
      {
        heading: 'Tips for Hitting Target Temperatures',
        list: [
          { desc: 'Pre-heat your mash tun with hot water while heating strike water (this prevents the tun from stealing heat)' },
          { desc: 'Measure strike water temperature in the tun, not the kettle (temperature can drop during transfer)' },
          { desc: 'Add grain gradually while stirring to prevent dough balls and ensure even temperature distribution' },
          { desc: 'Check mash temperature after 5 minutes and adjust if needed (add boiling water to raise temp, add cold water to lower it)' },
          { desc: 'Stir every 15-20 minutes to prevent stratification and cold spots' },
          { desc: 'Insulate your mash tun with sleeping bags or blankets in cold weather' },
          { desc: 'Keep detailed notes on how your specific system behaves - every setup is different' }
        ],
        proTip: 'If you miss your target mash temp by a few degrees, don\'t panic! Small variations (2-3°F) won\'t ruin your beer. Make a note and adjust your strike temperature next time.'
      },
      {
        heading: 'Common Mashing Mistakes',
        list: [
          { desc: 'Not pre-heating the mash tun (causes 10-15°F temperature drop)' },
          { desc: 'Adding grain too quickly (creates dough balls that never fully convert)' },
          { desc: 'Sparging too quickly (causes channeling and poor efficiency)' },
          { desc: 'Sparging with water that\'s too hot (>170°F extracts tannins and creates astringency)' },
          { desc: 'Not monitoring pH (mash pH should be 5.2-5.6 for optimal enzyme activity)' },
          { desc: 'Squeezing the grain bag (extract brewers: this extracts tannins)' },
          { desc: 'Letting the mash drop below 145°F (significantly reduces conversion efficiency)' }
        ],
        warning: 'The most common mistake is overthinking it! Mashing is forgiving. If you\'re within 3-4°F of your target and maintain it for 60 minutes, you\'ll get good conversion. Focus on consistency and learn from each batch.'
      }
    ]
  },
  'equipment': {
    title: 'Equipment Profiles',
    sections: [
      {
        heading: 'Why Equipment Profiles Matter',
        content: 'Every brewing system is different. Your equipment\'s volumes, dead space, and efficiency characteristics directly affect your recipe calculations. Setting up accurate equipment profiles ensures that calculated water volumes, grain amounts, and expected gravities match reality. This is the difference between hitting your numbers consistently and constantly adjusting recipes based on guesswork.',
        proTip: 'Create separate equipment profiles for different brewing setups (e.g., "5 Gallon Cooler System" vs "10 Gallon BIAB"). This lets you scale recipes between systems accurately.'
      },
      {
        heading: 'Setting Up Your First Profile',
        content: 'Start with approximate measurements and refine over time. You don\'t need perfect numbers on day one - brewing experience will help you dial in your system\'s actual performance. Use the presets as starting points based on common equipment, then customize based on your actual observations. Track your actual volumes and efficiencies over 3-5 batches to get reliable averages.'
      },
      {
        heading: 'Mash Tun Settings',
        list: [
          { label: 'Mash Tun Volume', desc: 'Total capacity in gallons. Make sure it can hold your grain bill plus water with room to stir. Rule of thumb: you need about 0.4 gallons per pound of grain (includes grain volume + water). A 10-gallon cooler handles 15-20 lb grain bills comfortably.' },
          { label: 'Mash Tun Dead Space', desc: 'Liquid trapped below the drain valve/false bottom. Measure by filling the empty tun and draining completely - what remains is dead space. Typical range: 0.25-0.5 gallons for coolers, 0.1-0.25 gallons for stainless steel with good false bottoms.' },
          { label: 'Heat Loss per Hour', desc: 'Temperature drop during the mash. Well-insulated coolers: 1-2°F/hour. Poor insulation or metal pots: 3-5°F/hour. Measure this during a test mash with hot water only - track temp every 15 minutes for an hour.' },
          { label: 'Grain Absorption Rate', desc: 'How much water the grain absorbs (typically 0.1-0.125 gal/lb). This water is lost and doesn\'t make it to your fermenter. More finely crushed grain absorbs slightly more.' }
        ]
      },
      {
        heading: 'Boil Kettle Settings',
        list: [
          { label: 'Kettle Volume', desc: 'Total capacity. Leave 20-25% headspace to prevent boil-overs. For 5-gallon batches, an 8-10 gallon kettle is ideal. Never fill past 80% of kettle capacity.' },
          { label: 'Boil-Off Rate', desc: 'How much water evaporates per hour during a vigorous boil. Depends on kettle diameter, vigor of boil, and altitude. Typical range: 1.0-1.5 gal/hour for homebrewing. Measure this by boiling water for an hour and measuring the volume loss.' },
          { label: 'Trub and Chilling Loss', desc: 'Volume lost to hop matter, hot break, and what remains in the kettle after transfer. Typical: 0.5-1.0 gallons depending on hop usage and kettle design. Immersion chillers leave more wort in the kettle than counterflow chillers.' },
          { label: 'Post-Boil Shrinkage', desc: 'Wort contracts as it cools (about 4% from boiling to 68°F). The calculator can account for this to hit your target volume at pitching temperature.' }
        ],
        proTip: 'Measure your boil-off rate on a non-brew day by boiling water for an hour. This gives you an accurate number without the stress of an actual brew day. Do this at your typical boil vigor.'
      },
      {
        heading: 'Fermenter Settings',
        list: [
          { label: 'Fermenter Volume', desc: 'Total capacity. Leave 20-30% headspace for krausen (foam during active fermentation). For 5-gallon batches, use 6.5-7 gallon fermenters. High-krausen beers (wheat beers, saisons) need extra headspace.' },
          { label: 'Headspace Requirements', desc: 'Room needed above the wort for fermentation activity. Varies by yeast strain: clean American ale yeasts (15-20%), high-krausen German wheat yeast (30%+), lager yeast (15%).' },
          { label: 'Trub/Yeast Cake Loss', desc: 'Volume lost to sediment after fermentation. Varies by yeast strain and flocculation. Typical: 0.25-0.5 gallons. High-flocculation English yeast leaves more sediment than clean American strains.' }
        ]
      },
      {
        heading: 'Efficiency Values',
        content: 'Efficiency determines how much sugar you extract from grain compared to the theoretical maximum.',
        list: [
          { label: 'Mash Efficiency', desc: 'Sugar extraction during the mash only. Typical range: 85-95% for homebrewers. Affected by crush, water chemistry, and mash thickness/time.' },
          { label: 'Lauter Efficiency', desc: 'How well you rinse sugars from the grain bed. Fly sparging: 90-95%, Batch sparging: 85-90%, No-sparge: 75-80%. Affected by sparge water volume and technique.' },
          { label: 'Brewhouse Efficiency', desc: 'Overall efficiency from grain to fermenter (mash efficiency × lauter efficiency × system losses). This is the number you use in recipe calculations. Beginners: 65-70%, Experienced: 72-78%, Expert systems: 80-85%.' }
        ],
        warning: 'Don\'t obsess over efficiency early on! Many brewers waste time and money chasing 80%+ efficiency when 72% works perfectly fine. Consistent efficiency is more important than high efficiency.'
      },
      {
        heading: 'How to Measure Dead Space',
        content: 'For accurate dead space measurements: Fill your mash tun with a known volume of water (e.g., 2 gallons). Let it sit for 5 minutes to settle completely. Open the valve and drain until flow stops completely. Measure the remaining water (this is dead space). Repeat 2-3 times and average the results. Do the same for your boil kettle and fermenter.',
        proTip: 'Use food coloring in your test water to make measurements easier to read. This also helps you see if your drainage system has any dead zones or flow issues.'
      },
      {
        heading: 'How to Determine Your Efficiency',
        content: 'Track efficiency over several batches to find your average: Brew a simple recipe with a known grain bill (e.g., 10 lbs Pale Malt for 5 gallons). Measure your actual OG (Original Gravity) at pitching temperature. Compare to the recipe\'s predicted OG. Calculate: (Actual OG points / Expected OG points) × 100 = Your efficiency. Example: Expected 1.050 (50 points), got 1.045 (45 points): (45/50) × 100 = 90% efficiency relative to the recipe. Repeat over 3-5 batches to get your average system efficiency.',
        list: [
          { desc: 'Track every batch in a brewing log with recipe, actual OG, actual volume, and efficiency' },
          { desc: 'After 5 batches, calculate your average efficiency and use that in future recipes' },
          { desc: 'Efficiency varies with grain bill size - higher gravity beers often have lower efficiency' },
          { desc: 'Once you know your system, you can reliably predict OG within 2-3 points' }
        ]
      },
      {
        heading: 'Using Equipment Presets',
        content: 'The system includes presets for common homebrew setups: Standard 5-gallon cooler system (most common beginner setup), 10-gallon BIAB (Brew In A Bag) system, 3-vessel brewing system (traditional all-grain), and Extract brewing setup (no mash tun needed). Select a preset as a starting point, then customize based on your actual measurements and observations. Save your customized profile for future use.'
      },
      {
        heading: 'How Profiles Integrate with Tools',
        content: 'Your equipment profile affects every calculation in the brewing tools: The recipe builder uses your efficiency to calculate required grain amounts. The mash calculator uses your tun volume and heat loss to determine strike water temperature and volume. The sparge calculator accounts for your dead space and grain absorption. The pre-boil volume calculation uses your boil-off rate and trub loss. Everything ties together to give you accurate, system-specific brewing numbers.'
      },
      {
        heading: 'Updating Profiles as You Learn',
        content: 'Equipment profiles aren\'t set in stone - they should evolve as you learn your system. After each brew session, note any discrepancies between predicted and actual values. If you consistently overshoot or undershoot your target OG, adjust your efficiency setting. If you always have more or less than expected at certain points, adjust your dead space or loss values. After 5-10 batches, your profile should be dialed in and give you highly accurate predictions.',
        proTip: 'Keep a "system calibration log" separate from your brew logs. Record only the numbers that affect your equipment profile (volumes, efficiencies, temperatures). This makes it easy to spot trends and make adjustments.'
      },
      {
        heading: 'Multiple Profiles for Different Setups',
        content: 'Create different profiles if you brew with different equipment or batch sizes. For example: "Summer Brewing" profile with higher boil-off (outdoor propane burner), "Winter Brewing" with lower boil-off and higher heat loss (indoor electric), "Small Batch" for 2.5-gallon batches, "Large Batch" for 10-gallon batches. Each profile can have completely different characteristics. Switch profiles before creating a new recipe to get accurate calculations for that specific setup.',
        warning: 'Don\'t use the same profile for drastically different batch sizes! A 5-gallon cooler system and a 15-gallon system have different heat loss characteristics, efficiency, and losses. Create separate profiles for each.'
      }
    ]
  },
  'grain-bill': {
    title: 'Grain Bill Calculator',
    sections: [
      {
        heading: 'Purpose of the Grain Bill Calculator',
        content: 'The grain bill is the foundation of your beer - it determines the color, body, alcohol potential, and much of the flavor. This calculator helps you build a balanced grain bill by showing real-time calculations of gravity, color, and cost as you add and adjust grains. Whether you\'re designing a recipe from scratch or tweaking an existing one, this tool helps you understand how each grain contributes to the final beer.',
        proTip: 'Start simple! Your first few recipes should use just 2-3 different grains max. As you gain experience, you can create more complex grain bills.'
      },
      {
        heading: 'Adding Grains to Your Bill',
        content: 'Click "+ Add Grain" to select from the grain database. Each grain has specific characteristics:',
        list: [
          { label: 'Base Malts (80-90% of bill)', desc: 'These provide the bulk of fermentable sugars. Common base malts include: 2-Row (clean, neutral, American standard), Pilsner (light, slightly sweet, lager base), Maris Otter (rich, biscuity, English favorite), Munich (malty, adds depth, can be used as base or specialty), Vienna (toasty, adds color, great for Märzens).' },
          { label: 'Specialty Malts (10-20% of bill)', desc: 'These add color, flavor, body, and complexity. Categories include: Crystal/Caramel malts (add sweetness, body, color - rated by Lovibond like C-40, C-60, C-120), Roasted malts (chocolate, coffee, roasted notes - Chocolate Malt, Roasted Barley, Black Patent), Toasted malts (biscuit, bread crust, nutty - Victory, Biscuit, Brown), Wheat malts (soft mouthfeel, haze, head retention - Wheat Malt, White Wheat).' },
          { label: 'Adjuncts', desc: 'Unmalted grains or sugars. Corn and rice lighten body and color. Oats add silky mouthfeel (great for stouts and NEIPAs). Rye adds spicy character. Sugars (table sugar, honey, Belgian candy sugar) boost alcohol without adding body.' }
        ]
      },
      {
        heading: 'Weight and Percentage Calculations',
        content: 'As you add grains, the calculator shows each grain\'s percentage of the total grain bill. This is crucial for recipe design and understanding balance. Watch these percentages carefully:',
        list: [
          { desc: 'Base malts should be 80-90% of the total for proper fermentability' },
          { desc: 'No single specialty malt should exceed 15-20% (unless it\'s a defining characteristic)' },
          { desc: 'Roasted malts are potent - often 3-5% is enough for flavor impact' },
          { desc: 'The total grain weight determines your potential alcohol - more grain = higher gravity = more alcohol' }
        ],
        warning: 'A common beginner mistake is using too many specialty malts! This creates a muddled, confused flavor profile. Keep it simple - let each ingredient shine.'
      },
      {
        heading: 'Color (SRM) Estimation',
        content: 'The calculator estimates beer color using the SRM (Standard Reference Method) scale. This helps you anticipate your beer\'s appearance:',
        list: [
          { label: '2-4 SRM', desc: 'Pale gold (Light Lagers, Pilsners, Blonde Ales)' },
          { label: '5-8 SRM', desc: 'Gold to amber (Pale Ales, Kölsch, Helles)' },
          { label: '9-14 SRM', desc: 'Deep amber to copper (Amber Ales, Märzens, ESB)' },
          { label: '15-20 SRM', desc: 'Brown (Brown Ales, Porters, Bocks)' },
          { label: '20-30 SRM', desc: 'Dark brown (Stouts, Dark Porters)' },
          { label: '30+ SRM', desc: 'Black (Imperial Stouts, Foreign Export Stouts)' }
        ],
        proTip: 'Color calculation is an estimate! The actual color can vary based on mash pH, boil vigor, and kettle caramelization. Use SRM as a guide, not an absolute prediction.'
      },
      {
        heading: 'Auto-Pricing Features',
        content: 'Each grain is automatically matched to products in our shop database. As you add grains, the system searches for matching products and displays pricing information with a confidence indicator:',
        list: [
          { label: 'Green checkmark', desc: 'Exact or high-confidence match. The ingredient name closely matches a product in the shop. Price is accurate and you can add directly to cart. This is the most reliable pricing.' },
          { label: 'Yellow alert', desc: 'Possible match with medium confidence. The system found a similar product but the match isn\'t perfect. Verify the price and product match before relying on it. You may need to check the shop manually.' },
          { label: 'Gray alert', desc: 'No match found in the shop. This ingredient isn\'t currently available or the name doesn\'t match our inventory. Enter the price manually if you want cost estimates, or source from another supplier.' }
        ],
        warning: 'Auto-pricing is a convenience feature, not a guarantee! Always verify prices before making purchasing decisions, especially for medium-confidence matches.'
      },
      {
        heading: 'Manual Price Override',
        content: 'You can override any auto-price by clicking in the price field and typing a new value. Your manual entries are preserved and won\'t be overwritten by auto-pricing. This is useful when: You get bulk discounts that aren\'t reflected in shop pricing, You source ingredients from a different supplier, You want to track historical prices, or You\'re planning a theoretical recipe and need custom pricing.',
        proTip: 'Use price override to compare organic vs conventional ingredients, or domestic vs imported specialty malts. This helps you make informed decisions about where to splurge and where to save.'
      },
      {
        heading: 'Total Cost Calculation',
        content: 'The calculator shows line-item costs (price per pound × quantity) and a grand total for your grain bill. This helps you: Budget for brew days and plan ingredient purchases. Compare different recipe variations by cost. Understand the impact of ingredient substitutions. Calculate cost per bottle or gallon of finished beer. Remember to add hops and yeast costs for complete recipe pricing!',
        list: [
          { desc: 'Grain bill costs typically range from $15-35 for a 5-gallon batch' },
          { desc: 'Higher gravity beers cost more due to increased grain requirements' },
          { desc: 'Specialty imported malts can significantly increase costs' },
          { desc: 'Buying in bulk (50 lb bags of base malt) dramatically reduces cost per pound' }
        ]
      },
      {
        heading: 'Designing a Balanced Grain Bill',
        content: 'A balanced grain bill creates harmony between malt and other elements (hops, yeast, water). Follow these principles:',
        list: [
          { desc: 'Start with a solid base malt foundation (80-90% of the bill)' },
          { desc: 'Add one "character" malt for the primary specialty flavor (e.g., Crystal 60 for caramel sweetness)' },
          { desc: 'Optionally add one "supporting" malt for complexity (e.g., Chocolate Malt for roasty notes)' },
          { desc: 'Use roasted malts sparingly - they\'re powerful! A little goes a long way' },
          { desc: 'Consider the style - does it traditionally use specific malts?' },
          { desc: 'Think about the final flavor: Do you want it malty-sweet or dry and crisp?' }
        ]
      },
      {
        heading: 'Style Guidelines',
        content: 'Different beer styles have traditional grain bill structures. Use these as starting points:',
        list: [
          { label: 'American Pale Ale', desc: '90% 2-Row, 8% Crystal 40, 2% Wheat (for head retention)' },
          { label: 'Irish Stout', desc: '75% Pale Malt, 15% Flaked Barley, 8% Roasted Barley, 2% Chocolate Malt' },
          { label: 'German Pilsner', desc: '100% Pilsner Malt (simplicity is key)' },
          { label: 'English Bitter', desc: '92% Maris Otter, 5% Crystal 60, 3% Chocolate Malt' },
          { label: 'Belgian Dubbel', desc: '85% Pilsner, 10% Munich, 5% Special B, plus dark candi sugar' },
          { label: 'American IPA', desc: '90% 2-Row, 5% Crystal 20, 5% Wheat (simple base for hop showcase)' }
        ],
        proTip: 'Study commercial beer recipes and clone recipes to understand traditional grain bill structures. Once you understand the rules, you can break them creatively!'
      },
      {
        heading: 'Common Grain Bill Ratios',
        content: 'These tried-and-true ratios work for broad categories of beers:',
        list: [
          { label: 'Pale, hoppy beers', desc: '95% base malt, 5% light crystal or wheat. Keeps the focus on hops with minimal malt interference.' },
          { label: 'Amber, balanced beers', desc: '85% base malt, 12% medium crystal, 3% toasted/biscuit. Creates malt-hop balance with caramel sweetness.' },
          { label: 'Brown ales', desc: '80% base malt, 12% crystal, 5% chocolate, 3% other specialty. Rich malt complexity without roasted harshness.' },
          { label: 'Stouts', desc: '70-75% base malt, 8-10% roasted barley, 5-10% crystal, 5-10% flaked grains. Bold roasted character with body and sweetness.' },
          { label: 'Wheat beers', desc: '50-70% wheat malt, 30-50% base malt. High wheat percentage creates the style\'s characteristic haze and mouthfeel.' }
        ]
      },
      {
        heading: 'Grain Bill Tips',
        list: [
          { desc: 'Calculate your OG target first, then back-calculate required grain weight using your system efficiency' },
          { desc: 'Don\'t be afraid of single-malt beers (100% one base malt) - simplicity often produces the cleanest results' },
          { desc: 'Fresh grain makes better beer - buy what you need and store it properly (cool, dry, dark, sealed)' },
          { desc: 'Crush grain as close to brew day as possible for maximum freshness' },
          { desc: 'Visit your local homebrew shop to see, smell, and taste different malts before using them' },
          { desc: 'Keep a grain journal noting how specific malts taste and perform in your beers' }
        ],
        warning: 'Grain bills look simple on paper but create complex flavors! Change one thing at a time between batches so you can learn how each grain affects the final beer.'
      }
    ]
  },
  'water-chemistry': {
    title: 'Water Chemistry Adjustments',
    sections: [
      {
        heading: 'Why Water Chemistry Matters',
        content: 'Water makes up 90-95% of beer, yet it\'s often overlooked by new brewers. Water chemistry affects mash pH (critical for enzyme activity), mineral content (influences yeast health and flavor), and flavor balance (sulfate enhances hops, chloride enhances malt). The same recipe brewed with different water can produce noticeably different beers. Understanding water chemistry helps you consistently produce better beer and troubleshoot flavor issues.',
        proTip: 'As a beginner, start simple: Use filtered or spring water (avoid chlorinated tap water). Once you can consistently make good beer, then dive into advanced water chemistry. Don\'t let water chemistry paralyze you from brewing!'
      },
      {
        heading: 'Key Minerals and Their Effects',
        list: [
          { label: 'Calcium (Ca) - 50-150 ppm', desc: 'The most important brewing mineral. Calcium aids enzyme function during the mash, helps yeast flocculation, improves beer clarity, protects enzymes from heat damage, and reduces pH. It\'s nearly impossible to have too much calcium in brewing. Target at least 50 ppm, ideally 75-150 ppm. Added via gypsum (calcium sulfate) or calcium chloride.' },
          { label: 'Magnesium (Mg) - 10-30 ppm', desc: 'A yeast nutrient that supports healthy fermentation. Most water has adequate magnesium naturally. Too much (>30 ppm) can create harsh, astringent, or sour flavors. Generally, you don\'t need to add magnesium if you have 10+ ppm in your source water.' },
          { label: 'Sodium (Na) - 0-150 ppm', desc: 'Enhances malt perception and creates a softer mouthfeel at low levels (25-75 ppm). At high levels (>150 ppm), it creates a salty or metallic taste. Some classic beer styles (like Dortmunder Export) traditionally used sodium-rich water. Modern brewing often minimizes sodium unless style-appropriate.' },
          { label: 'Chloride (Cl) - 0-250 ppm', desc: 'Accentuates malt sweetness and creates a fuller, rounder mouthfeel. Promotes perceived fullness and palate smoothness. High chloride beers (100-150 ppm) taste maltier and sweeter. Common in English ales, stouts, and malt-forward beers. Added via calcium chloride. Too much (>200 ppm) can create a minerally taste.' },
          { label: 'Sulfate (SO₄) - 0-350 ppm', desc: 'Accentuates hop bitterness and creates a drier, crisper finish. Promotes a perceived sharpness and hop definition. High sulfate beers (200-300 ppm) taste drier and more aggressively hoppy. Classic in Burton-upon-Trent pale ales and American IPAs. Added via gypsum (calcium sulfate). Too much (>400 ppm) creates harsh, astringent bitterness.' },
          { label: 'Bicarbonate (HCO₃) - Varies by style', desc: 'A pH buffer that resists pH change. High bicarbonate water suits dark beers (the roasted malts lower pH, bicarbonate prevents it from going too low). Low bicarbonate suits pale beers (pale malts don\'t lower pH much, so you need low buffering to reach target mash pH). Most problematic mineral for brewers - often needs to be reduced via dilution or acid additions.' }
        ]
      },
      {
        heading: 'The Sulfate to Chloride Ratio',
        content: 'This ratio is one of the most powerful tools for shaping beer flavor. It determines whether your beer emphasizes malt or hops:',
        list: [
          { label: 'Ratio 0.5:1 or lower (Malt-forward)', desc: 'Low sulfate, high chloride. Creates soft, round, malty beers. Example: 50 SO₄, 100 Cl = 0.5:1 ratio. Best for: English milds, Scottish ales, sweet stouts, malt-forward ambers. Character: Smooth, sweet, rounded mouthfeel.' },
          { label: 'Ratio 1:1 (Balanced)', desc: 'Equal sulfate and chloride. Balanced malt and hop perception. Example: 100 SO₄, 100 Cl = 1:1 ratio. Best for: Pale ales, balanced IPAs, American ambers, most versatile profile. Character: Neither malt nor hops dominate.' },
          { label: 'Ratio 2:1 or higher (Hop-forward)', desc: 'High sulfate, low chloride. Creates dry, crisp, aggressively hoppy beers. Example: 200 SO₄, 75 Cl = 2.7:1 ratio. Best for: West Coast IPAs, Burton pale ales, dry hop-bombs. Character: Crisp, dry, sharp hop bite. Some brewers push to 4:1 or even higher for extreme hop beers!' }
        ],
        proTip: 'Start with a 1:1 ratio to understand your recipe, then adjust the ratio in future batches to emphasize malt or hops. This is easier than changing the recipe itself!'
      },
      {
        heading: 'Target Water Profiles by Style',
        content: 'Historical brewing regions developed water profiles that suit specific styles:',
        list: [
          { label: 'Pilsen (Czech Pilsners)', desc: 'Very soft water. Ca: 10, Mg: 5, Na: 5, SO₄: 5, Cl: 5, HCO₃: 15. Ultra-low minerals showcase delicate malt and noble hops. Requires acid additions to lower mash pH with such low buffering.' },
          { label: 'Burton-upon-Trent (English IPAs)', desc: 'Very high sulfate. Ca: 275, Mg: 40, Na: 25, SO₄: 450, Cl: 50, HCO₃: 300. Creates the classic dry, bitter English IPA character. The extreme sulfate accentuates hops dramatically.' },
          { label: 'Dublin (Irish Stouts)', desc: 'High bicarbonate. Ca: 115, Mg: 4, Na: 12, SO₄: 55, Cl: 19, HCO₃: 280. High alkalinity suits dark roasted malts perfectly. The bicarbonate prevents the mash from becoming too acidic with roasted grains.' },
          { label: 'Munich (Malty German Lagers)', desc: 'Moderate minerals, balanced. Ca: 75, Mg: 18, Na: 2, SO₄: 10, Cl: 2, HCO₃: 150. Moderately hard water with higher bicarbonate suits darker lagers like Märzens and Dunkels.' },
          { label: 'Balanced Profile (American Ales)', desc: 'Moderate, balanced minerals. Ca: 100, Mg: 10, Na: 10, SO₄: 100, Cl: 100, HCO₃: 50. Versatile profile that works for most American ales. Adjust sulfate:chloride ratio based on hop emphasis.' }
        ],
        warning: 'Don\'t slavishly copy historic water profiles! Modern malts are different, and you can build a great beer with simpler water. These are starting points, not requirements.'
      },
      {
        heading: 'Mash pH and Its Importance',
        content: 'Mash pH is the single most important water chemistry parameter. Target mash pH: 5.2-5.6 (measured at room temperature after the mash has rested 10-15 minutes). Why it matters:',
        list: [
          { desc: 'Enzyme activity: Amylase enzymes work best at pH 5.2-5.6. Outside this range, conversion is slower and less complete.' },
          { desc: 'Flavor: Low pH (<5.2) creates thin, tart beer. High pH (>5.8) extracts tannins, causing astringency.' },
          { desc: 'Color: Higher pH darkens wort color. Lower pH keeps pale beers pale.' },
          { desc: 'Hop utilization: Lower pH slightly increases hop bitterness extraction in the boil.' }
        ],
        proTip: 'Invest in a pH meter ($30-50) or pH strips. This is the most valuable water chemistry tool. Measure your mash pH at 10-15 minutes into the mash and adjust if needed.'
      },
      {
        heading: 'Adjusting Mash pH',
        content: 'Different approaches to hitting target mash pH:',
        list: [
          { label: 'Acid Malt', desc: 'Malted barley treated with lactic acid bacteria. Use 1-3% of grain bill to lower pH by 0.1-0.3 points. Natural option preferred by German brewers. Adds subtle grain character.' },
          { label: 'Lactic Acid', desc: 'Food-grade 88% lactic acid. Very effective and predictable. Start with 1 mL per gallon of mash water, measure pH, adjust as needed. Doesn\'t affect flavor at normal levels. Most popular option for homebrewers.' },
          { label: 'Phosphoric Acid', desc: 'Stronger than lactic acid. Use less volume to achieve same pH drop. Completely flavor-neutral. Popular in commercial brewing.' },
          { label: 'Acidulated Malt', desc: 'Same as acid malt - malt treated to lower pH. German Sauermalz. Use up to 10% of grain bill for significant pH drops.' },
          { label: 'Slaked Lime/Chalk', desc: 'Used to raise mash pH (rare need). Only necessary when brewing very pale beers with very soft water or when water is naturally acidic.' }
        ],
        warning: 'Always add acid gradually! You can add more, but you can\'t remove it. Add half your calculated amount, wait 10 minutes, measure, then adjust as needed.'
      },
      {
        heading: 'Common Salt Additions',
        list: [
          { label: 'Gypsum (Calcium Sulfate - CaSO₄)', desc: 'Adds calcium and sulfate. Use to increase hop perception and dry out the finish. Typical addition: 1-4 grams per gallon. Popular for IPAs and hoppy beers.' },
          { label: 'Calcium Chloride (CaCl₂)', desc: 'Adds calcium and chloride. Use to increase malt perception and create fuller mouthfeel. Typical addition: 1-3 grams per gallon. Popular for stouts, porters, English ales.' },
          { label: 'Epsom Salt (Magnesium Sulfate - MgSO₄)', desc: 'Adds magnesium and sulfate. Rarely needed - most water has sufficient magnesium. Can create harsh, sour flavors if overused. Use only if magnesium is deficient (<5 ppm).' },
          { label: 'Table Salt (Sodium Chloride - NaCl)', desc: 'Adds sodium and chloride. Enhances malt character at low levels. Use sparingly (0.5-1 gram per gallon) as too much creates salty flavor. Traditional in some European beer styles.' },
          { label: 'Baking Soda (Sodium Bicarbonate - NaHCO₃)', desc: 'Raises pH and adds sodium/bicarbonate. Use to increase mash pH for dark beers. Typical addition: 1-2 grams per gallon. Careful - too much creates harsh, minerally flavors.' }
        ]
      },
      {
        heading: 'When to Worry About Water (Hint: Not as a Beginner)',
        content: 'Water chemistry importance depends on your brewing level:',
        list: [
          { label: 'Beginner (First 5 batches)', desc: 'Focus: Sanitation, fermentation temperature, using fresh ingredients. Water: Just remove chlorine/chloramine (use campden tablets or carbon filter). That\'s it! Don\'t worry about sulfate:chloride ratios yet.' },
          { label: 'Intermediate (Batches 6-20)', desc: 'Focus: Consistency, recipe development, hitting your numbers. Water: Start adding calcium (gypsum or calcium chloride) to reach 50-100 ppm. Begin measuring and adjusting mash pH with acid. Learn your water\'s base mineral profile.' },
          { label: 'Advanced (Batches 20+)', desc: 'Focus: Fine-tuning flavors, specific style targets, competition brewing. Water: Full mineral adjustments, sulfate:chloride ratio manipulation, building water from RO, pH precision. This is when water chemistry makes a noticeable difference.' }
        ],
        proTip: 'The best advice for beginners: Use bottled spring water or carbon-filtered tap water. Add 1/4 tsp of gypsum per 5 gallons for ales, 1/4 tsp calcium chloride per 5 gallons for lagers/stouts. That\'s good enough to make excellent beer while you learn the basics!'
      },
      {
        heading: 'Starting with Filtered or Spring Water',
        content: 'The easiest path to good brewing water: Buy bottled spring water or use a carbon filter on your tap water. This removes chlorine/chloramine (which creates medicinal off-flavors) without requiring complex calculations. Spring water typically has moderate, balanced minerals that work well for most beers. It\'s a clean slate that you can adjust if desired. Cost: $5-8 for 5 gallons of spring water vs hours of water chemistry research. For most brewers, spring water plus a calcium addition is perfect.',
        list: [
          { desc: 'Avoid distilled or reverse osmosis (RO) water without mineral additions - it lacks calcium for yeast health' },
          { desc: 'Avoid heavily chlorinated tap water - chlorine + phenols = medicinal flavors (chlorophenols)' },
          { desc: 'Test your tap water or get a water report from your utility if you want to use it' },
          { desc: 'Carbon filters remove chlorine but don\'t change mineral content - fine for most brewing' }
        ],
        warning: 'Don\'t let water chemistry intimidate you! Some of the best homebrewers made award-winning beers before water chemistry became popular. It\'s important, but it\'s not magic. Focus on fermentation temperature control first - that makes a bigger difference than water chemistry for most beers.'
      }
    ]
  },
  'calculators': {
    title: 'Essential Brewing Calculators',
    sections: [
      {
        heading: 'ABV (Alcohol By Volume) Calculator',
        content: 'The ABV calculator determines your beer\'s alcohol content based on the sugar consumed during fermentation. You\'ll need two measurements:',
        list: [
          { label: 'OG (Original Gravity)', desc: 'The density of your wort before fermentation, measured with a hydrometer or refractometer. Take this reading at the same temperature as your hydrometer calibration (usually 60°F/15.5°C), or use temperature correction. Typical range: 1.040-1.060 for most ales, 1.070+ for big beers.' },
          { label: 'FG (Final Gravity)', desc: 'The density after fermentation is complete. "Complete" means the gravity hasn\'t changed for 2-3 consecutive days. Typical range: 1.008-1.016 for most beers. Lower FG = drier beer, higher FG = sweeter beer with more body.' },
          { label: 'Formula', desc: 'ABV = (OG - FG) × 131.25. This is the standard formula used by most brewers and is accurate for beers up to about 8% ABV. For higher-gravity beers, slight adjustments improve accuracy, but the difference is minimal for most homebrewing applications.' }
        ],
        proTip: 'Always take gravity readings at the same temperature for consistency. Hydrometers are calibrated at 60°F - warmer samples read low, colder samples read high. Use the temperature correction calculator if needed!'
      },
      {
        heading: 'Taking Accurate Gravity Readings',
        content: 'Gravity measurements are critical for calculating ABV and knowing when fermentation is complete. Here\'s how to get accurate readings:',
        list: [
          { label: 'Using a Hydrometer', desc: 'Fill a sample cylinder with beer (at least 6 inches deep). Float the hydrometer and spin it gently to release bubbles. Let it stabilize and read at eye level where the liquid surface meets the hydrometer stem (ignore the meniscus climbing the glass). Temperature matters: take the reading at 60°F or apply temperature correction. Sanitize everything that touches the beer!' },
          { label: 'Using a Refractometer', desc: 'Place 2-3 drops of wort on the prism. Close the cover and point toward a light source. Read the Brix or SG value through the eyepiece. Before fermentation: converts directly to gravity. After fermentation: alcohol skews the reading - you must use the refractometer correction calculator. Advantage: needs tiny sample (great during fermentation). Requires calibration with distilled water.' }
        ],
        warning: 'Never put your sample back in the fermenter! Bacteria and oxygen contaminate the sample. It\'s only 6-8 oz - just drink it or discard it. Consider it your "brewer\'s tax" for quality control.'
      },
      {
        heading: 'Temperature Correction for Hydrometers',
        content: 'Hydrometers are calibrated at a specific temperature (usually 60°F/15.5°C). Warmer liquids are less dense (read lower than actual). Colder liquids are more dense (read higher than actual). The temperature correction calculator adjusts your reading to the true gravity.',
        list: [
          { desc: 'If your sample is at 70°F and reads 1.050, the actual gravity is about 1.052' },
          { desc: 'If your sample is at 50°F and reads 1.050, the actual gravity is about 1.048' },
          { desc: 'The error is minimal (±0.002) within 10°F of calibration temp' },
          { desc: 'The error becomes significant (±0.005+) more than 20°F from calibration temp' }
        ],
        proTip: 'Cool your sample to room temperature before measuring, or take it at fermentation temperature and use the correction calculator. I keep a small covered cup in the fridge - put the sample in the cup, wait 10 minutes, then measure. Quick and accurate!'
      },
      {
        heading: 'IBU (International Bitterness Units) Calculator',
        content: 'IBUs measure the bitterness in your beer from iso-alpha acids extracted during the boil. The calculator estimates IBUs based on:',
        list: [
          { label: 'Hop weight', desc: 'Amount of hops in ounces or grams. More hops = more bitterness (obviously!).' },
          { label: 'Alpha acid percentage', desc: 'The % of bittering compounds in the hops. Varies by hop variety and harvest year. Bittering hops: 10-14% AA. Aroma hops: 3-6% AA. Dual-purpose: 6-10% AA. Always check your hop package for the exact AA%.' },
          { label: 'Boil time', desc: 'How long the hops boil. Longer boil = more isomerization = more bitterness. 60 min = maximum bitterness, minimal aroma. 15 min = moderate bitterness and flavor. 0 min / whirlpool = minimal bitterness, maximum aroma.' },
          { label: 'Wort gravity', desc: 'Higher gravity wort extracts bitterness less efficiently (the sugars get in the way). This is why big beers need more hops to reach the same IBU level.' },
          { label: 'Batch size', desc: 'Dilution factor - same hops in smaller volume = higher IBUs.' }
        ]
      },
      {
        heading: 'IBU Calculation Methods',
        content: 'Several formulas exist for calculating IBUs. We use the Tinseth formula, which is the most popular among homebrewers:',
        list: [
          { label: 'Tinseth Formula', desc: 'Accounts for wort gravity effect on utilization. Most accurate for homebrewing applications. Slightly conservative (predicts lower IBUs than you might taste). Used by most brewing software.' },
          { label: 'Rager Formula', desc: 'Older formula, still used by some. Tends to predict higher IBUs than Tinseth. Doesn\'t account for gravity as thoroughly.' },
          { label: 'Garetz Formula', desc: 'Most complex, accounts for many factors including hop storage, altitude, and more. Probably overly precise for homebrewing.' }
        ],
        proTip: 'Don\'t obsess over IBU precision! The formulas are estimates - actual bitterness depends on dozens of factors (boil vigor, hop freshness, your palate sensitivity). Use IBUs as a guideline for balance, not an absolute measurement.'
      },
      {
        heading: 'Priming Sugar Calculator',
        content: 'When bottle conditioning, you need to add a precise amount of sugar to create carbonation. Too little = flat beer. Too much = gushers or bottle bombs. The calculator determines the exact amount needed based on:',
        list: [
          { label: 'Batch size', desc: 'Volume of beer to be carbonated (in gallons or liters).' },
          { label: 'Desired CO₂ volumes', desc: 'Different styles need different carbonation levels. Low (1.5-2.0 vol): British ales, stouts. Medium (2.0-2.5 vol): American ales, lagers. High (2.5-3.0 vol): Belgian ales, wheat beers. Very high (3.0-4.0 vol): Belgian styles, some wheat beers.' },
          { label: 'Beer temperature', desc: 'Warmer beer has less residual CO₂. Colder beer retains more CO₂ from fermentation. This affects how much sugar you need to add.' },
          { label: 'Sugar type', desc: 'Different sugars have different weights for the same sweetness. Corn sugar (dextrose): most common, 100% fermentable. Table sugar (sucrose): works fine, slightly different amount needed. DME (dry malt extract): less fermentable, needs more weight.' }
        ],
        warning: 'Always use the calculator! Guessing carbonation sugar leads to under-carbonated or over-carbonated beer. Over-carbonation is dangerous - bottles can explode. Safety first!'
      },
      {
        heading: 'CO₂ Volumes by Style',
        list: [
          { label: '1.5-2.0 volumes', desc: 'British Ales, ESB, Milds, Porters, Dry Stouts - Low carbonation emphasizes malt, creates soft mouthfeel' },
          { label: '2.0-2.4 volumes', desc: 'American Ales, IPAs, Lagers, Pilsners - Standard carbonation, balanced and refreshing' },
          { label: '2.4-2.7 volumes', desc: 'Belgian Blondes, Tripels, Saisons - Higher carbonation, lively and effervescent' },
          { label: '2.7-3.0+ volumes', desc: 'Hefeweizens, Witbiers, some Belgians - Very high carbonation, champagne-like' }
        ],
        proTip: 'When in doubt, use 2.2-2.4 volumes. This is the "Goldilocks zone" that works for almost any beer style and matches commercial beer carbonation levels.'
      },
      {
        heading: 'Avoiding Bottle Bombs',
        content: 'Over-carbonation can cause bottles to explode. This is dangerous and messy. Follow these safety rules:',
        list: [
          { desc: 'Always use the priming calculator - never guess!' },
          { desc: 'Make sure fermentation is completely finished before bottling (stable gravity for 3+ days)' },
          { desc: 'Mix priming sugar thoroughly but gently with the entire batch (avoid creating stratification)' },
          { desc: 'Use quality bottles designed for beer (never use twist-off bottles, wine bottles, or non-pressure-rated glass)' },
          { desc: 'Store carbonating bottles at room temperature (65-72°F) in a safe location' },
          { desc: 'Never exceed 3.0 volumes unless using Belgian-style bottles and appropriate style' },
          { desc: 'Wait at least 2 weeks before refrigerating (carbonation needs time to develop)' },
          { desc: 'If a bottle gushes violently when opened, refrigerate the entire batch immediately to slow carbonation' }
        ],
        warning: 'Bottle bombs are no joke! They can cause serious injury. If you suspect over-carbonation (bottles extremely firm, first bottle gushes violently), immediately refrigerate all bottles and carefully vent them over a sink. When in doubt, err on the side of slightly under-carbonated.'
      }
    ]
  },
  'advanced-calculators': {
    title: 'Advanced Brewing Calculators',
    sections: [
      {
        heading: 'Yeast Starter Calculator',
        content: 'A yeast starter grows yeast cells before pitching, ensuring you have enough healthy cells for complete, clean fermentation. Proper pitching rates prevent off-flavors, stuck fermentations, and stressed yeast. The calculator determines:',
        list: [
          { label: 'Target pitch rate', desc: 'Cells needed based on wort gravity and volume. Standard rates: Ale yeast: 0.75 million cells/mL/°Plato. Lager yeast: 1.5 million cells/mL/°Plato. High gravity (>1.060): increase by 25-50%.' },
          { label: 'Current cell count', desc: 'How many viable cells you have now. Based on: Package size (usually 100 billion for liquid yeast), Package date (viability decreases ~20% per month), Storage conditions (refrigerated vs room temp).' },
          { label: 'Starter size needed', desc: 'Volume of starter to grow enough cells. Typically 1-2 liters for most ale batches, 2-4 liters for lagers or high-gravity beers. Larger batches may need step starters (multiple stages).' }
        ]
      },
      {
        heading: 'Making a Yeast Starter Step-by-Step',
        list: [
          { desc: '1. Calculate DME needed: typically 100g DME per 1L water (creates ~1.040 gravity starter wort)' },
          { desc: '2. Boil DME in water for 10 minutes to sanitize and dissolve' },
          { desc: '3. Cool to room temperature (below 75°F) - use ice bath or let sit overnight' },
          { desc: '4. Pour into sanitized flask or growler' },
          { desc: '5. Pitch yeast package into the cooled starter wort' },
          { desc: '6. Cover with sanitized foil or airlock' },
          { desc: '7. Place on stir plate (ideal) or shake periodically' },
          { desc: '8. Let ferment 24-48 hours until activity slows' },
          { desc: '9. Cold crash in refrigerator 12-24 hours to settle yeast' },
          { desc: '10. Decant liquid (mostly spent wort), pitch yeast slurry into beer' }
        ],
        proTip: 'Make starters 2-3 days before brew day. This gives time for yeast growth, cold crash, and decanting. Fresh, active yeast is the secret to clean fermentation!'
      },
      {
        heading: 'Stir Plate vs Shaking',
        list: [
          { label: 'Stir Plate (Recommended)', desc: 'Constant agitation via magnetic stirrer bar. Continuously oxygenates wort, allowing faster yeast growth and higher cell counts. Can produce 2-3x more cells than static starter. Typical growth: 100 billion → 300+ billion in 24-48 hours. Worth the investment ($30-60 for DIY, $100+ commercial).' },
          { label: 'Intermittent Shaking', desc: 'Shake the flask vigorously every few hours. Better than nothing but less efficient than stir plate. Produces fewer cells (100 billion → 150-200 billion). Fine for moderate-gravity ales if you shake frequently.' },
          { label: 'Static (Not Recommended)', desc: 'Just let it sit. Minimal oxygenation, slowest growth. May actually reduce viability in some cases. Only use if absolutely no other option available.' }
        ]
      },
      {
        heading: 'Decanting Starters',
        content: 'After cold crashing, you have two options:',
        list: [
          { label: 'Decant liquid, pitch slurry (Recommended)', desc: 'Pour off the clear liquid on top, leaving just the yeast sediment. Pitch only the thick slurry. Advantages: No off-flavors from spent starter wort. Smaller volume to pitch. Concentrates the yeast. Most professional approach.' },
          { label: 'Pitch entire starter', desc: 'Pitch everything without decanting. Advantages: Easier, no risk of losing yeast. Disadvantages: Dilutes your beer slightly. Can contribute off-flavors from stressed starter fermentation. Adds more volume to account for.' }
        ],
        proTip: 'For best results: make starter at same or slightly lower gravity than your target beer, use a stir plate, cold crash overnight, decant, and pitch only the slurry. This gives you maximum viable cells with minimum impact on beer flavor!'
      },
      {
        heading: 'Refractometer Calculator',
        content: 'Refractometers measure sugar content via light refraction. They need only 2-3 drops of wort (vs a full hydrometer sample). However, alcohol changes the refractive index, so you can\'t use raw refractometer readings after fermentation starts.',
        list: [
          { label: 'Before Fermentation (Brix → SG)', desc: 'Direct conversion from Brix to Specific Gravity. Formula: SG = 1 + (Brix / 258.6). Example: 12 Brix = 1.048 SG. This is accurate because no alcohol is present yet.' },
          { label: 'During/After Fermentation (Corrected FG)', desc: 'Alcohol distorts the reading. You need both: Original Brix (from pre-fermentation), Current Brix (from refractometer now). The calculator applies correction formulas to determine actual SG. Without correction, refractometer FG readings are useless!' },
          { label: 'Wort Correction Factor (WCF)', desc: 'Accounts for non-sugar dissolved solids. Default is 1.04, but each refractometer can be slightly different. Calibrate your refractometer against hydrometer readings to find your WCF.' }
        ]
      },
      {
        heading: 'Calibrating Your Refractometer',
        list: [
          { desc: '1. Calibrate to zero with distilled water (should read 0 Brix)' },
          { desc: '2. Brew a batch and take both refractometer (Brix) and hydrometer (SG) readings of the wort' },
          { desc: '3. Calculate your Wort Correction Factor: WCF = Hydrometer SG / Refractometer SG' },
          { desc: '4. Use this WCF in the calculator for all future readings' },
          { desc: '5. Typical WCF range: 1.02-1.06 (1.04 is average)' }
        ],
        proTip: 'Calibrate with distilled water before every use! Temperature changes and residue can throw off your readings. Refractometers with ATC (Automatic Temperature Compensation) are worth the extra cost.'
      },
      {
        heading: 'Keg Carbonation Calculator',
        content: 'Force carbonating in kegs is faster than bottle conditioning and more consistent. This calculator helps you determine PSI settings and timeframes. Carbonation depends on:',
        list: [
          { label: 'Beer temperature', desc: 'Colder beer absorbs CO₂ more easily. Most force carbonate at 38-40°F (refrigerator temp). Temperature is critical - same PSI at different temps gives different carbonation levels!' },
          { label: 'Target CO₂ volumes', desc: 'Same as bottling: 2.0-2.5 for most beers. Higher for Belgians/wheats, lower for British ales.' },
          { label: 'PSI required', desc: 'Calculated from temp and CO₂ volumes. Example: 2.4 volumes at 38°F ≈ 12 PSI. Charts and calculators provide exact PSI for any temp/volume combination.' }
        ]
      },
      {
        heading: 'Carbonation Methods',
        list: [
          { label: 'Set and Forget (Recommended)', desc: 'Set regulator to calculated PSI, leave for 7-14 days. Slow, even carbonation. Most consistent results. Least risk of over-carbonation. Best for most brewers.' },
          { label: 'Burst Carbonation', desc: 'Set PSI high (30-40), shake keg, leave 24-48 hours, reduce to serving pressure. Faster (2-3 days vs 2 weeks). Risk of over-carbonation if not careful. Can create harsher bubbles if done too aggressively.' },
          { label: 'Crank and Shake', desc: 'Maximum pressure, rock keg back and forth for 5-10 minutes, let sit overnight. Fastest method (carbonated in 24 hours). Highest risk of over-carbonation. Most physically demanding. Only for experienced keggers!' }
        ],
        proTip: 'Use "set and forget" for your first kegs. It\'s foolproof and produces the best carbonation quality. Once you understand your system, experiment with burst carbonation for faster results.'
      },
      {
        heading: 'Serving Pressure and Line Length',
        content: 'After carbonation, you need to balance serving pressure with line resistance to avoid foam. Too high pressure = foam. Too low pressure = flat beer over time. The balance formula:',
        list: [
          { desc: 'Determine equilibrium PSI for your temp and CO₂ volumes (from calculator)' },
          { desc: 'This is your serving pressure - the pressure needed to maintain carbonation' },
          { desc: 'Calculate line resistance needed: Resistance = PSI × 2-3 feet per PSI' },
          { desc: 'Example: 12 PSI serving pressure needs 24-36 feet of line for balanced pours' },
          { desc: 'Use 3/16" ID beer line (more resistance per foot than larger lines)' },
          { desc: 'Add a restrictor plate or flow control faucet if you want shorter lines' }
        ]
      },
      {
        heading: 'Troubleshooting Foam',
        list: [
          { desc: 'All foam, no beer: serving pressure too high, line too short, or beer too warm. Reduce PSI, increase line length, or cool beer more.' },
          { desc: 'Foamy first pour, then fine: air in lines. Purge lines before pouring, keep beer under constant pressure.' },
          { desc: 'Slowly losing carbonation: serving pressure too low. Increase PSI to equilibrium pressure for your temp.' },
          { desc: 'Perfect at first, foamy after a week: beer warming up. Check keezer/kegerator temperature.' },
          { desc: 'Always foamy despite correct pressure: dirty lines, kinked lines, or restriction in system. Clean lines with PBW and sanitizer, check for kinks.' }
        ],
        warning: 'Temperature is the most common cause of carbonation issues! Keep your kegged beer at a consistent temperature (ideally 38-40°F). Temperature swings cause CO₂ to come out of solution, creating foam and inconsistent pours.'
      },
      {
        heading: 'Dilution and Boil-Off Calculator',
        content: 'Sometimes you miss your target gravity. These calculations help you adjust:',
        list: [
          { label: 'Gravity Too High (Dilution)', desc: 'Add water to reduce gravity. Calculate: Water needed = (Current Volume × (Current Gravity - Target Gravity)) / (Target Gravity - 1.000). Example: 5 gal at 1.060, want 1.050: need ~1 gallon water. Add pre-boiled, cooled water to avoid infection and temperature shock.' },
          { label: 'Gravity Too Low (Boil Longer)', desc: 'Extend boil to evaporate water and concentrate sugars. Calculate: Boil time needed = ((Current Volume - Target Volume) / Boil-off Rate) × 60 minutes. Example: 6 gal at 1.042, want 5 gal at 1.050: boil ~1 more hour at 1 gal/hr boil-off. Watch for color darkening with extended boils!' },
          { label: 'Gravity Too Low (Add DME/Sugar)', desc: 'Add dry malt extract or sugar to increase gravity without changing volume. Calculate: DME needed (lbs) = (Target Points - Current Points) × Volume / 45. Example: 5 gal at 1.045, want 1.055: need ~1.1 lbs DME. Add to boil, stir to dissolve completely.' }
        ],
        proTip: 'Prevention is better than correction! Take a pre-boil gravity reading and compare to your recipe prediction. If you\'re off, adjust before the boil ends. Much easier than trying to fix it after chilling!'
      }
    ]
  },
  'batches': {
    title: 'Batch Tracking & History',
    sections: [
      {
        heading: 'Why Track Your Batches',
        content: 'Detailed batch records are the secret to improving as a brewer. Every batch teaches you something about your system, your process, and your palate. Consistent record-keeping helps you: Identify patterns in your brewing (what works, what doesn\'t), Troubleshoot problems by comparing to past batches, Reproduce successes by following proven recipes and processes, Track efficiency improvements over time, Document your brewing journey and improvement curve, Share recipes with confidence in the results.',
        proTip: 'The best time to take notes is during the brew day, not after! Keep a notebook or phone nearby and record observations in real-time. You\'ll forget critical details if you wait until later.'
      },
      {
        heading: 'Creating a New Batch Entry',
        content: 'Start a batch entry as soon as you begin brewing. Include: Batch name and number (sequential numbering helps tracking), Recipe name and version (reference to your recipe library), Brew date and expected packaging date, Initial observations (weather, water source, grain freshness, hop appearance), Equipment used (if you have multiple systems). You can always add more details as the brew day progresses.',
        list: [
          { desc: 'Take a photo of your setup, ingredients, and grain bill for visual reference' },
          { desc: 'Record ambient temperature and humidity (affects mash heat loss and fermentation)' },
          { desc: 'Note any ingredient substitutions or changes from the original recipe' },
          { desc: 'Log your mental state - tired, stressed brewers make more mistakes!' }
        ]
      },
      {
        heading: 'Batch Status Stages Explained',
        list: [
          { label: 'Planning', desc: 'Recipe selected, ingredients ordered, brew day scheduled. Use this stage to prepare your shopping list and verify you have all equipment. Check ingredient availability and freshness dates.' },
          { label: 'Brewing', desc: 'Active brew day in progress. Record all process details: mash temps, boil times, hop additions, any deviations from plan. Take pre-boil and post-boil gravity and volume measurements.' },
          { label: 'Fermenting', desc: 'Beer is in the fermenter. Log pitching temperature, OG, yeast details, fermentation temperature (target and actual). Record daily observations during active fermentation. Note any unusual activity (slow start, vigorous krausen, stuck fermentation).' },
          { label: 'Conditioning', desc: 'Primary fermentation complete, beer is clearing or cold-crashing. Record FG, calculated ABV. Note any dry hop additions, fining agents, or other conditioning steps. Track temperature and duration.' },
          { label: 'Packaging', desc: 'Beer is bottled or kegged. Record packaging date, priming sugar amount (bottles), or carbonation settings (kegs). Note final volume, any losses, appearance and aroma at packaging.' },
          { label: 'Ready', desc: 'Carbonation complete, beer is ready to drink. Record first taste impressions. This is when you add your formal tasting notes and rating.' },
          { label: 'Archived', desc: 'Batch is finished and documented. Use this for old batches you want to keep in records but don\'t need in active tracking.' }
        ]
      },
      {
        heading: 'Recording Original Gravity (OG)',
        content: 'OG is one of the most important measurements. Take it when you pitch yeast (or immediately before):',
        list: [
          { desc: 'Use a sanitized hydrometer or refractometer' },
          { desc: 'Record temperature of the sample (for correction if needed)' },
          { desc: 'Compare to recipe prediction - this tells you about your brew day efficiency' },
          { desc: 'If significantly off target, note possible causes (crush too coarse, mash temp off, sparge issues)' },
          { desc: 'Save the sample for a side-by-side taste comparison when the beer is done!' }
        ],
        proTip: 'Track the difference between predicted and actual OG over multiple batches. If you\'re consistently 3-4 points low, adjust your equipment profile efficiency down. Consistency is more important than hitting arbitrary efficiency numbers!'
      },
      {
        heading: 'Recording Final Gravity (FG)',
        content: 'FG tells you fermentation is complete and allows ABV calculation:',
        list: [
          { desc: 'Take readings 2-3 days apart - if identical, fermentation is done' },
          { desc: 'Typical FG: 1.008-1.016 for most beers (depends on yeast and recipe)' },
          { desc: 'Compare to recipe prediction - significant deviation indicates fermentation issues' },
          { desc: 'Higher than expected FG: underpitched, wrong temperature, poor yeast health, or unfermentable sugars' },
          { desc: 'Lower than expected FG: over-attenuation, contamination, or different yeast than expected' },
          { desc: 'Calculate ABV: (OG - FG) × 131.25' }
        ],
        warning: 'Don\'t rush to package! If FG is higher than expected and still dropping, fermentation isn\'t done. Wait for stable gravity for 3+ days before bottling or kegging. Packaging too early causes over-carbonation!'
      },
      {
        heading: 'Adding Detailed Notes',
        content: 'Great batch notes include more than just numbers. Record qualitative observations:',
        list: [
          { label: 'Brew Day Notes', desc: 'Mash appearance and smell. Boil vigor and hot break formation. Wort clarity pre-chill. Chilling time and pitching temperature. Any problems, substitutions, or deviations from plan.' },
          { label: 'Fermentation Notes', desc: 'Lag time before visible fermentation. Krausen character (high, low, rocky, foamy). Peak fermentation activity and duration. Temperature deviations. Airlock activity pattern. Clarity during conditioning.' },
          { label: 'Packaging Notes', desc: 'Appearance (color, clarity, haze). Aroma at packaging. Flavor at room temp (young beer character). Priming sugar or carbonation settings. Final volume yielded. Any sediment or floaters.' },
          { label: 'Tasting Notes', desc: 'Appearance (color, clarity, head retention, lacing). Aroma (malt, hops, yeast, other). Flavor (balance, strength, off-flavors, complexity). Mouthfeel (body, carbonation, astringency, alcohol warmth). Overall impression and rating (1-10 or 1-5 stars). Compared to style guidelines and your expectations.' }
        ]
      },
      {
        heading: 'Analyzing Past Batches',
        content: 'Review your batch history regularly to identify patterns:',
        list: [
          { desc: 'Compare efficiency across batches - is it consistent or variable?' },
          { desc: 'Look for seasonal patterns (summer beers fermenting too warm, winter mashes losing too much heat)' },
          { desc: 'Identify your most successful recipes and processes' },
          { desc: 'Find correlations between process and flavor (e.g., lower mash temp always produces drier beers)' },
          { desc: 'Spot recurring problems (always over-carbonated, always missing efficiency, etc.)' },
          { desc: 'Track your favorite batches and repeat them with confidence' }
        ],
        proTip: 'Every 10 batches, review your log and write a "brewing journal entry" summarizing what you\'ve learned. These reflections are incredibly valuable as you progress!'
      },
      {
        heading: 'Learning from Your History',
        content: 'Your brewing records are worth more than any book or online advice. They\'re specific to YOUR system, YOUR ingredients, YOUR process. Use them to:',
        list: [
          { desc: 'Calibrate your equipment profile (efficiency, losses, boil-off rate)' },
          { desc: 'Understand how your fermentation chamber performs in different seasons' },
          { desc: 'Learn which yeast strains you prefer and how they perform for you' },
          { desc: 'Identify which hop varieties you like and which don\'t work for your palate' },
          { desc: 'Track how long each stage takes in your process (helps planning future brew days)' },
          { desc: 'Build confidence in your recipes and processes through documented success' }
        ]
      },
      {
        heading: 'Guest Mode vs Logged-In Storage',
        content: 'Batch tracking requires an account:',
        list: [
          { label: 'Guest Mode', desc: 'You can view the batch tracker and example entries. You can\'t create or save batches. No data persistence across sessions. Good for exploring the feature before committing.' },
          { label: 'Logged-In Mode', desc: 'Full access to create, edit, and track batches. All batches saved to your account permanently. Access from any device. Search and filter your batch history. Export batch data for analysis in spreadsheets.' }
        ],
        warning: 'Brewing without records is like flying blind! Take the time to log your batches. Future you will thank present you for the detailed notes when you\'re trying to recreate that amazing IPA from six months ago.'
      },
      {
        heading: 'Batch Tracking Best Practices',
        list: [
          { desc: 'Start the batch entry before brew day - don\'t rely on memory' },
          { desc: 'Update in real-time during brewing - take notes between steps' },
          { desc: 'Use consistent terminology so you can search and filter later' },
          { desc: 'Include photos - they\'re worth a thousand words for appearance, krausen, etc.' },
          { desc: 'Be honest about problems and failures - they\'re the best learning opportunities' },
          { desc: 'Record both process data (temps, times, volumes) and qualitative observations (smell, appearance)' },
          { desc: 'Review your notes before brewing the same recipe again' },
          { desc: 'Share your best batches with other brewers (privacy settings allow this)' }
        ],
        proTip: 'Create a "brew day checklist" from your batch tracking template. This ensures you record the same information every time, making batches easier to compare!'
      }
    ]
  },
  'inventory': {
    title: 'Ingredient Inventory Management',
    sections: [
      {
        heading: 'Why Track Inventory',
        content: 'Managing your ingredient inventory prevents mid-brew-day surprises and reduces waste. A good inventory system helps you: Avoid "I thought I had that!" moments on brew day, Prevent purchasing duplicates of ingredients you already have, Track ingredient freshness and use old stock first, Plan brew days based on what you have on hand, Reduce waste by using ingredients before they expire, Budget more accurately by knowing what you need vs what you have.',
        proTip: 'The best time to update inventory is immediately after brew day while everything is fresh in your mind. Make it part of your cleanup routine!'
      },
      {
        heading: 'Adding Items to Inventory',
        content: 'Add ingredients when you purchase them or receive shipments. For each item, record:',
        list: [
          { label: 'Ingredient Name', desc: 'Be specific! Not just "Cascade Hops" but "Cascade Whole Hops 2024 Harvest" to track different lots.' },
          { label: 'Category', desc: 'Grains, Hops, Yeast, Adjuncts, Sugars, Other. This helps with filtering and organization.' },
          { label: 'Quantity', desc: 'Current amount on hand in appropriate units (pounds for grain, ounces for hops, packages for yeast).' },
          { label: 'Purchase Date', desc: 'When you acquired it. Helps you track age and use FIFO (First In, First Out).' },
          { label: 'Expiration/Best By Date', desc: 'When it should be used by. Critical for hops, yeast, and specialty ingredients. Less critical for base malts but still relevant.' },
          { label: 'Storage Location', desc: 'Freezer, fridge, basement, garage. Helps you find it quickly and manage storage space.' },
          { label: 'Lot/Batch Number', desc: 'For traceability and quality tracking (especially important for hops with alpha acid values).' },
          { label: 'Cost', desc: 'What you paid. Helps with budgeting and calculating batch costs accurately.' }
        ]
      },
      {
        heading: 'Ingredient Categories',
        list: [
          { label: 'Grains/Malts', desc: 'Base malts, specialty malts, adjunct grains. Store in cool, dry place in sealed containers. Shelf life: 1-2 years for whole grain, 3-6 months for pre-crushed. Track by pounds.' },
          { label: 'Hops', desc: 'Bittering, aroma, dual-purpose hops. Store in freezer in vacuum-sealed or airtight bags. Shelf life: 1-2 years frozen, 6 months refrigerated, weeks at room temp. Track by ounces and alpha acid %.' },
          { label: 'Yeast', desc: 'Liquid and dry yeast packages. Store in refrigerator. Shelf life: 6-12 months depending on type and storage. Liquid yeast viability decreases ~20% per month. Track by packages and manufacture date.' },
          { label: 'Adjuncts', desc: 'Sugars, spices, fruit, coffee, wood chips, etc. Storage varies by type. Track quantities and purchase dates. Note any special handling requirements.' }
        ]
      },
      {
        heading: 'Setting Expiration Dates',
        content: 'Different ingredients have different shelf lives. Track them carefully:',
        list: [
          { desc: 'Hops: Vacuum-sealed in freezer = 2 years, refrigerated = 6 months, room temp = 1-3 months' },
          { desc: 'Yeast: Liquid = 6 months optimal (decreasing viability), Dry = 1-2 years' },
          { desc: 'Base Malts: Whole grain = 1-2 years, Pre-crushed = 3-6 months (loses freshness quickly)' },
          { desc: 'Specialty Malts: Similar to base malts, but roasted malts can last longer due to lower enzymatic activity' },
          { desc: 'Sugars and Syrups: Varies widely - check manufacturer recommendations' },
          { desc: 'Adjuncts: Spices and herbs lose potency in 6-12 months, Fruit should be used quickly or frozen' }
        ],
        warning: 'Old ingredients don\'t always make bad beer, but they make inconsistent beer! Fresher ingredients provide more predictable results and better flavor.'
      },
      {
        heading: 'Low Stock Warnings',
        content: 'Set minimum quantities for ingredients you brew with regularly. The system alerts you when stock drops below the threshold. This is especially useful for:',
        list: [
          { desc: 'Base malts - buy in bulk (50 lb bags) and replenish when running low' },
          { desc: 'Favorite hop varieties - stock up during harvest season (September-November)' },
          { desc: 'House yeast strains - keep multiple packages on hand for spontaneous brew days' },
          { desc: 'Sanitizer and cleaning supplies - never run out of the essentials!' }
        ],
        proTip: 'Set low-stock alerts to trigger when you have enough for one more batch. This gives you time to restock before you\'re completely out!'
      },
      {
        heading: 'Planning Brew Days with Inventory',
        content: 'Use your inventory to plan what to brew next:',
        list: [
          { desc: 'Filter by "Expiring Soon" to use up aging ingredients' },
          { desc: 'Check available quantities before finalizing a recipe' },
          { desc: 'Design recipes around what you have to reduce purchasing' },
          { desc: 'Substitute ingredients based on current stock (e.g., use Cascade instead of Centennial if you\'re out)' },
          { desc: 'Plan bulk brew days when you have excess ingredients that need to be used' },
          { desc: 'Create a "brew queue" based on ingredient availability and freshness' }
        ]
      },
      {
        heading: 'Inventory Deduction After Brewing',
        content: 'After each brew day, update your inventory to reflect what you used:',
        list: [
          { desc: 'Deduct grain quantities used (be precise - use actual weights, not recipe amounts)' },
          { desc: 'Reduce hop inventory by ounces used in the recipe' },
          { desc: 'Mark yeast packages as used (or note if you harvested and stored yeast slurry)' },
          { desc: 'Update any adjuncts, sugars, or specialty ingredients consumed' },
          { desc: 'Note any spillage, waste, or damaged ingredients separately' }
        ],
        proTip: 'Keep your phone or tablet near your brewing area. Update inventory in real-time as you weigh and add ingredients. This is more accurate than trying to remember later!'
      },
      {
        heading: 'Guest Mode vs Logged-In Storage',
        list: [
          { label: 'Guest Mode', desc: 'Can view example inventory layouts. Cannot add or modify inventory items. No data persistence. Good for exploring the feature before creating an account.' },
          { label: 'Logged-In Mode', desc: 'Full inventory management capabilities. Create, edit, and delete items. Set custom low-stock alerts. Track purchase history. Sync across devices. Export inventory for spreadsheet analysis.' }
        ],
        warning: 'Without inventory tracking, you\'re relying on memory and visual inspection. This leads to over-purchasing (duplicates), waste (expired ingredients), and brew day delays (missing critical items).'
      },
      {
        heading: 'Inventory Management Best Practices',
        list: [
          { desc: 'Do a full inventory audit every 3-6 months - physically check what you actually have' },
          { desc: 'Use FIFO (First In, First Out) - use older ingredients before newer ones' },
          { desc: 'Label everything with purchase/manufacture dates when you receive it' },
          { desc: 'Store ingredients properly - cool, dark, dry for grains; freezer for hops; fridge for yeast' },
          { desc: 'Take inventory before placing orders to avoid duplicates' },
          { desc: 'Track bulk purchases separately (e.g., "55 lb sack of 2-Row" vs individual pounds)' },
          { desc: 'Note any quality issues (off smells, clumping, discoloration) in the item notes' },
          { desc: 'Keep packaging and labels for reference (especially important for hop alpha acid values)' }
        ]
      },
      {
        heading: 'Storage Tips by Category',
        list: [
          { label: 'Grain Storage', desc: 'Cool (below 70°F), dry (below 65% humidity), dark, sealed containers. Food-grade buckets with gamma lids work great. Check for bugs/insects monthly. Crushed grain should be used within weeks or frozen.' },
          { label: 'Hop Storage', desc: 'Freezer is essential for long-term storage. Vacuum seal if possible. Label with variety, alpha acid %, crop year, and date stored. Never store at room temperature for more than a few days.' },
          { label: 'Yeast Storage', desc: 'Refrigerate at 38-40°F (don\'t freeze liquid yeast!). Store upright to keep yeast in suspension. Bring to room temp before use. Check manufacture date - make starters for yeast >3 months old.' },
          { label: 'Other Ingredients', desc: 'Spices: airtight containers, cool and dark. Fruit: freeze immediately if not using soon. Coffee: vacuum-sealed, cool and dark. Wood chips: in original packaging, dry location.' }
        ],
        proTip: 'Invest in a vacuum sealer for hops and specialty grains. The $50-100 cost pays for itself in extended shelf life and reduced waste!'
      }
    ]
  },
  'guides': {
    title: 'Brewing Guides Library',
    sections: [
      {
        heading: 'Available Brewing Guides',
        content: 'Our comprehensive guide library covers brewing techniques from beginner to advanced. Each guide includes step-by-step instructions, photos, diagrams, and tips from experienced brewers. Guides are organized by topic and difficulty level to help you find exactly what you need.',
        list: [
          { desc: 'Extract Brewing Basics - Perfect first brew guide for beginners' },
          { desc: 'Your First All-Grain Brew - Transitioning from extract to all-grain' },
          { desc: 'Yeast Handling and Starters - Proper yeast management for clean fermentation' },
          { desc: 'Fermentation Temperature Control - DIY and commercial solutions' },
          { desc: 'Kegging vs Bottling - Pros, cons, and setup guides for both' },
          { desc: 'Troubleshooting Off-Flavors - Identifying and fixing common flavor issues' },
          { desc: 'Cleaning and Sanitation - The most important step in brewing' },
          { desc: 'Water Chemistry Basics - Understanding and adjusting brewing water' },
          { desc: 'Recipe Formulation - Designing your own recipes from scratch' },
          { desc: 'Advanced Techniques - Decoction mashing, step mashing, and more' }
        ]
      },
      {
        heading: 'Guide Categories',
        list: [
          { label: 'Getting Started', desc: 'Absolute beginner guides covering equipment, first batches, and fundamental techniques. Start here if you\'ve never brewed before or only brewed a few batches.' },
          { label: 'Brewing Techniques', desc: 'Process-focused guides covering mashing, lautering, boiling, chilling, and fermentation. These help you improve your process and consistency.' },
          { label: 'Ingredients', desc: 'Deep dives into grains, hops, yeast, and water. Learn how each ingredient affects your beer and how to select and use them effectively.' },
          { label: 'Recipe Development', desc: 'Guides for designing balanced recipes, understanding style guidelines, and formulating your own creations.' },
          { label: 'Advanced Topics', desc: 'Complex techniques like water chemistry, yeast culturing, barrel aging, and sour beer production. For experienced brewers ready to level up.' },
          { label: 'Troubleshooting', desc: 'Problem-solving guides for common issues: off-flavors, stuck fermentations, clarity problems, and more.' },
          { label: 'Equipment', desc: 'Setup guides for mash tuns, brew stands, fermentation chambers, kegging systems, and more. Includes DIY and commercial options.' }
        ]
      },
      {
        heading: 'Difficulty Levels',
        list: [
          { label: 'Beginner', desc: 'Accessible to complete novices. Minimal equipment required. Focus on basic techniques and building confidence. Success-oriented with straightforward processes.' },
          { label: 'Intermediate', desc: 'Assumes basic brewing knowledge. May require specific equipment. Introduces new techniques and ingredients. Builds on fundamental skills.' },
          { label: 'Advanced', desc: 'For experienced brewers. Requires specialized equipment or ingredients. Complex processes with multiple steps. Assumes strong foundation in brewing science.' }
        ],
        proTip: 'Don\'t skip beginner guides even if you\'re experienced! They often contain tips and tricks that even advanced brewers find valuable. Fundamentals matter at every level!'
      },
      {
        heading: 'Using Guides During Brew Day',
        content: 'Guides are designed to be brew-day companions. Access them on your phone or tablet while brewing. Key features for brew day use:',
        list: [
          { desc: 'Printable versions - download PDF guides to print for offline use' },
          { desc: 'Step-by-step checklists - check off each step as you complete it' },
          { desc: 'Time estimates - know how long each step should take' },
          { desc: 'Critical warnings highlighted - don\'t miss important safety or quality points' },
          { desc: 'Troubleshooting sections - quick help if something goes wrong' },
          { desc: 'Equipment lists - verify you have everything before starting' }
        ]
      },
      {
        heading: 'Product Links in Guides (New Feature)',
        content: 'Many guides now include direct links to recommended products from our shop. When a guide mentions specific ingredients or equipment, you\'ll see quick links to view products, check prices and availability, read product reviews, and add directly to cart. This integration makes it easy to go from reading a guide to purchasing everything you need for that technique or recipe.',
        list: [
          { desc: 'Ingredient links show current pricing and stock status' },
          { desc: 'Equipment links include specifications and user reviews' },
          { desc: 'Alternative products suggested if exact match is out of stock' },
          { desc: 'Bundle deals highlighted when buying multiple related items' }
        ],
        proTip: 'Bookmark guides you use frequently! This creates your personal brewing reference library for quick access during brew days.'
      },
      {
        heading: 'Quick Shop Boxes',
        content: 'Throughout guides, you\'ll find "Quick Shop" boxes that bundle all ingredients or equipment needed for that section. These are curated collections that save you time:',
        list: [
          { desc: '"First All-Grain Brew Kit" - everything needed for your first all-grain batch' },
          { desc: '"IPA Hop Pack" - complementary hops for West Coast IPA' },
          { desc: '"Yeast Starter Essentials" - DME, flask, stir bar, and sanitizer' },
          { desc: '"Water Chemistry Starter Kit" - salts, acids, test strips, and instructions' }
        ],
        warning: 'Product links are provided for convenience, but always verify you\'re buying what you actually need for your specific system and recipe!'
      },
      {
        heading: 'Progression Path (Beginner → Advanced)',
        content: 'We recommend a learning progression that builds skills systematically:',
        list: [
          { label: 'Stage 1: Extract Brewing (Batches 1-5)', desc: 'Focus on sanitation, fermentation management, and packaging. Learn recipe basics with extract kits. Master these fundamentals before moving to all-grain.' },
          { label: 'Stage 2: All-Grain Transition (Batches 6-15)', desc: 'Build or buy all-grain equipment. Learn mashing, lautering, and sparging. Focus on hitting target numbers consistently. Experiment with grain bills.' },
          { label: 'Stage 3: Process Refinement (Batches 16-30)', desc: 'Dial in your system efficiency. Start water chemistry adjustments. Experiment with yeast starters and harvesting. Develop signature recipes.' },
          { label: 'Stage 4: Advanced Techniques (Batches 30+)', desc: 'Step mashing, decoction, kettle souring, barrel aging, mixed fermentation, competition brewing. Refine your craft at an expert level.' }
        ],
        proTip: 'Don\'t rush the progression! Mastering fundamentals is more valuable than trying advanced techniques before you\'re ready. Many brewers skip steps and develop bad habits that are hard to break later.'
      },
      {
        heading: 'Guide Updates and New Releases',
        content: 'Guides are living documents that we update regularly with: New techniques and best practices, Updated product recommendations, User-submitted tips and photos, Seasonal brewing guides, Style-specific deep dives. Check back monthly for new guides and updates to existing content. Follow our blog or newsletter for announcements about new guide releases.',
        list: [
          { desc: 'Seasonal guides released quarterly (summer brewing, winter lagers, etc.)' },
          { desc: 'Style spotlights monthly featuring deep dives into specific beer styles' },
          { desc: 'Technique videos added to popular guides for visual learners' },
          { desc: 'User success stories and variations added to guide comments' }
        ]
      }
    ]
  }
};

export function BrewingInstructions({ activeTab }: BrewingInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const instructions = INSTRUCTIONS[activeTab as keyof typeof INSTRUCTIONS];

  if (!instructions) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-card border-2 border-amber/30 rounded-lg p-4 flex items-center justify-between hover:border-gold hover:bg-amber/5 transition-all"
        aria-label={isOpen ? 'Close instructions' : 'Open instructions'}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gold">How to Use: {instructions.title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gold flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gold flex-shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 bg-card border border-amber/20 rounded-lg p-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
          {instructions.sections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              {section.heading && (
                <h3 className="text-lg font-semibold text-gold">{section.heading}</h3>
              )}
              {section.content && (
                <p className="text-cream/80 text-sm leading-relaxed">{section.content}</p>
              )}
              {section.list && (
                <ul className="space-y-2">
                  {section.list.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className={`text-cream/80 text-sm ${item.indent ? 'ml-6' : ''}`}
                    >
                      {item.label ? (
                        <>
                          <span className="text-amber font-medium">{item.label}:</span>{' '}
                          {item.desc}
                        </>
                      ) : (
                        <span className="flex items-start">
                          <span className="text-amber mr-2">•</span>
                          <span>{item.desc}</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {section.proTip && (
                <div className="mt-3 p-3 bg-amber/10 border border-amber/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-amber flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-amber font-semibold text-sm">Pro Tip</div>
                      <div className="text-cream/80 text-sm mt-1">{section.proTip}</div>
                    </div>
                  </div>
                </div>
              )}
              {section.warning && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-red-500 font-semibold text-sm">Common Mistake</div>
                      <div className="text-cream/80 text-sm mt-1">{section.warning}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
