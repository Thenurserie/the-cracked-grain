'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BeerBrewingGuide } from './BeerBrewingGuide';

const GUIDES = {
  'Starter Kit': [
    {
      title: 'Extract Brew Day SOP',
      difficulty: 'Beginner',
      time: '4-5 hours',
      content: {
        overview: 'Extract brewing is the perfect entry point into homebrewing. This method uses pre-concentrated malt extract (either liquid or dry) instead of starting from raw grain, cutting your brew day time in half while still producing excellent beer. This complete standard operating procedure will walk you through every step of your first extract brew day, from setup to cleanup. Extract brewing is how most professional brewers started, and many continue using this method for quick batches or recipe testing. Expect your first brew day to take 4-5 hours, though subsequent batches will go faster as you develop your workflow. The beauty of extract brewing is that it removes the complexity of mashing while maintaining complete control over hops, yeast, and fermentation - the elements that truly define your beer\'s character.',
        steps: [
          'Begin by sanitizing all equipment that will touch cooled wort: fermenter, airlock, stopper, funnel, thermometer, hydrometer, and anything else post-boil. Use Star San solution mixed to package directions (typically 1 oz per 5 gallons water). Fill a spray bottle with sanitizer and keep it handy throughout brew day.',
          'Heat 2.5-3 gallons of water in your brew kettle to 155-160°F. If using tap water, run it through a carbon filter or let it sit overnight to dissipate chlorine. Chlorine can create off-flavors (medicinal/band-aid) in your finished beer.',
          'Place specialty grains (if included in your recipe) in a grain bag and steep in the hot water for 20-30 minutes, maintaining temperature between 150-170°F. These grains add color, flavor, and body. Think of this like making tea - you\'re extracting flavor and color, not converting starches. Gently stir occasionally.',
          'Remove grain bag and let it drain naturally over the kettle. Don\'t squeeze - this can extract harsh tannins. Discard spent grains (they make excellent compost). Bring the water to a full rolling boil.',
          'Once boiling, remove kettle from heat. Add your malt extract (liquid or dry) slowly while stirring constantly to prevent scorching on the bottom. Liquid malt extract (LME) flows easier if you warm the container in hot water first. Dry malt extract (DME) can clump, so sprinkle it slowly while stirring vigorously.',
          'Return kettle to heat and bring back to a boil. Watch carefully - the wort will want to boil over (called a "boil-over"). Once you achieve a rolling boil, start your 60-minute timer. This is when you add your first hop addition (bittering hops).',
          'Add hops according to your recipe schedule. Typical schedule: bittering hops at 60 minutes, flavor hops at 15 minutes, aroma hops at 5 minutes (time remaining in boil). Set timers for each addition. Hops added early contribute bitterness, while late additions contribute flavor and aroma.',
          'During the boil, prepare your ice bath or sanitize your wort chiller. Also sanitize about 2 gallons of water to use for topping up the fermenter. You can boil this water and let it cool, or use pre-packaged sanitized water.',
          'At the end of the 60-minute boil, cool the wort as rapidly as possible to 65-75°F. Speed is critical here - the faster you cool, the better the cold break (protein coagulation) and lower the infection risk. Ice bath method: place kettle in sink filled with ice water, stirring wort occasionally. Immersion chiller method: circulate cold water through the chiller while gently stirring. Target cooling time: 20-30 minutes.',
          'Transfer cooled wort to your sanitized fermenter. If using a funnel, make sure it\'s sanitized. Pour from a height to introduce oxygen (aeration), which yeast need for healthy reproduction. You can also shake the fermenter vigorously for 30-60 seconds.',
          'Add sanitized water to reach your target volume (typically 5 gallons for a standard recipe). Take a gravity reading with your hydrometer - this Original Gravity (OG) tells you the sugar content and helps calculate final alcohol percentage. Record this number.',
          'Pitch (add) your yeast when wort temperature is in the range specified on the yeast package (typically 65-75°F for ale yeast). If using liquid yeast, shake the package well first. Dry yeast can be sprinkled directly on top (no need to rehydrate for most strains, though it doesn\'t hurt).',
          'Seal the fermenter with a sanitized stopper and airlock. Fill the airlock halfway with sanitizer or vodka. Place fermenter in a temperature-stable location away from direct sunlight. Ideal fermentation temperature for most ales: 65-70°F.',
          'Clean all your equipment immediately - dried-on wort and hop residue becomes much harder to remove later. Use hot water and a mild, unscented cleaner (like PBW or OxiClean Free). Rinse thoroughly.'
        ],
        tips: [
          'Read through the entire recipe before starting. Prep and measure all ingredients ahead of time - this is called "mise en place" and prevents scrambling mid-brew.',
          'Maintain a vigorous, rolling boil to drive off DMS (dimethyl sulfide), which creates a cooked corn flavor. If your boil isn\'t vigorous, you may need a stronger heat source or partially uncovered lid during heating (remove lid completely during boil).',
          'Cool wort as quickly as possible - every minute in the 80-140°F "danger zone" increases infection risk. An immersion wort chiller is one of the best investments you can make.',
          'Aeration is critical for healthy fermentation. Yeast need oxygen during their reproduction phase. Shake the fermenter vigorously for 30-60 seconds, or pour wort from a height to create splashing and bubbles.',
          'Keep detailed notes on a brew day sheet: recipe, actual gravity readings, temperatures, timing, any variations. These notes become invaluable for troubleshooting and recipe refinement.',
          'Don\'t panic if you don\'t see airlock activity immediately. Some fermentations start within 6 hours, others take 24-48 hours. As long as you pitched healthy yeast at proper temperature, fermentation will begin.',
          'Stable temperature is more important than exact temperature. A beer fermenting consistently at 72°F will turn out better than one swinging between 65-75°F.',
          'Resist the urge to open the fermenter or take gravity readings during the first week. Let the yeast work undisturbed.'
        ]
      }
    },
    {
      title: 'Fermentation Guide',
      difficulty: 'Beginner',
      time: '2-4 weeks',
      content: {
        overview: 'Fermentation is where the magic happens - yeast converts sugar into alcohol and CO2, transforming sweet wort into beer. This is arguably the most critical phase of brewing, yet it\'s also the simplest: your main job is to create the right environment and then leave the yeast alone to do their work. Understanding fermentation helps you produce cleaner, more consistent beer and troubleshoot issues when they arise. Most fermentation problems stem from poor temperature control, insufficient yeast, or inadequate sanitation - all easily preventable. Primary fermentation typically takes 1-2 weeks for ales, 2-3 weeks for lagers, though some high-gravity beers may need longer. The key is patience: rushing fermentation leads to off-flavors, while giving yeast adequate time results in clean, well-attenuated beer. This guide covers everything from pitch to package.',
        steps: [
          'Place your sealed fermenter in a temperature-stable location away from direct sunlight. Ideal locations: interior closet, basement, temperature-controlled fermentation chamber. Avoid areas with large temperature swings like garages or rooms with windows. For most ale yeasts, target 65-70°F. Lagers require cooler temperatures, typically 48-55°F.',
          'Monitor airlock activity starting 6-12 hours after pitching yeast. You should see bubbles forming in the airlock within 24 hours for most ales (sometimes up to 48 hours is normal). Vigorous bubbling usually peaks around day 2-3, then gradually slows. Note: lack of airlock activity doesn\'t always mean fermentation isn\'t happening - sometimes CO2 escapes around the lid rather than through the airlock.',
          'Primary fermentation phase (Days 1-7): This is the active fermentation period. Yeast reproduce rapidly, consuming oxygen and nutrients. Temperature will rise 5-10°F above ambient due to exothermic fermentation. You may see a thick layer of krausen (foam) on top - this is normal and healthy. Resist the urge to open the fermenter or take samples during this critical phase.',
          'Mid-fermentation (Days 7-10): Activity slows significantly. Krausen begins falling back into the beer. Most of the fermentable sugars have been consumed. The beer will start to clear as yeast and proteins drop out of suspension. This is a good time for your first gravity reading to check fermentation progress.',
          'Take your first gravity reading 7-10 days after pitching (for standard-gravity ales). Sanitize your wine thief or turkey baster, carefully draw a sample, and measure with your hydrometer. Compare to your Original Gravity. Most beers will be at or near Final Gravity by day 10. Don\'t worry if it\'s not there yet - high-gravity beers need more time.',
          'Check for terminal gravity (fermentation complete): Take another gravity reading 2-3 days after your first reading. If the gravity is the same both days, fermentation is complete. Typical Final Gravity for ales: 1.010-1.018. If gravity is still dropping, give it a few more days and check again. Never bottle while gravity is still dropping - you\'ll create bottle bombs.',
          'Optional - Secondary fermentation: For most beers, secondary fermentation is unnecessary and may even introduce oxidation risk. However, it\'s useful for: extended aging (barleywines, imperial stouts), fruit or spice additions, dry hopping large amounts, or clearing very cloudy beers. If transferring to secondary, do so gently to minimize oxygen exposure and leave sediment behind.',
          'Optional - Dry hopping: If your recipe calls for dry hops, add them during the final 3-5 days of fermentation. Sanitize the outside of the hop package, open the fermenter briefly, dump in the hops, and reseal. The small amount of CO2 still being produced will help protect against oxygen. Dry hop at fermentation temperature (65-70°F) for best aroma extraction.',
          'Cold crash (optional but recommended): 2-3 days before bottling or kegging, lower temperature to 35-40°F if possible. This causes yeast and proteins to drop out of suspension, dramatically improving beer clarity. Not essential for bottle-conditioned beers (you need some yeast in suspension), but even 24 hours of cold crashing helps. If you don\'t have temperature control, skip this step.',
          'Final preparation for packaging: Your beer should be at terminal gravity (stable for 2+ days), clear or clearing, and taste like beer (not sweet wort). Sample a bit - it should taste mostly like beer, though it will improve significantly with carbonation and conditioning. Common flavors at this stage: slightly yeasty, flat (no carbonation), not quite finished. If it tastes bad (sour, buttery, solvent-like), see troubleshooting guides.'
        ],
        tips: [
          'Stable temperature is infinitely more important than hitting exact temperature. A beer held at steady 72°F will turn out better than one swinging between 65-75°F each day.',
          'Avoid opening the fermenter unnecessarily. Every time you open it, you risk introducing oxygen (leads to oxidation/staling) or contamination. If you must open it (dry hopping, taking samples), work quickly and sanitize everything.',
          'Different yeast strains have different optimal fermentation schedules. US-05 is done in 7-10 days. Belgian strains may need 14-21 days. Lager strains need 3-4 weeks plus lagering time. Always check your specific yeast\'s datasheet.',
          'Take detailed notes: pitch date, temperature readings, gravity readings, visible activity, flavors at packaging. These notes help you identify patterns and improve your process.',
          'Trust your gravity readings more than calendars. A beer at terminal gravity after 8 days is ready. A beer still dropping after 16 days needs more time. The yeast are done when they say they\'re done.',
          'Fermentation temperature = beer temperature, NOT room temperature. Active fermentation can raise beer temperature 5-10°F above ambient. Use a stick-on thermometer on the fermenter or a thermowell to measure actual beer temperature.',
          'If fermentation never starts (no activity after 48 hours, no gravity drop after 72 hours), you may have dead yeast or temperature issues. Pitch a fresh packet of yeast and ensure temperature is in range.',
          'The airlock is not a reliable indicator of fermentation. Some fermenters leak CO2 around the lid. Judge fermentation by gravity readings and visual activity (krausen, clarity), not bubbles.'
        ]
      }
    },
    {
      title: 'Bottling Day',
      difficulty: 'Beginner',
      time: '2-3 hours',
      content: {
        overview: 'Bottling day is when your beer finally comes together - you\'ll add priming sugar for carbonation, package your beer, and start the final conditioning phase. While kegging is faster and easier (we\'ll cover that later), bottling is how most homebrewers start, and it\'s perfectly capable of producing professional-quality beer. The keys to successful bottling are sanitation (preventing infection), gentle handling (avoiding oxidation), and proper priming (achieving correct carbonation). Expect your first bottling session to take 2-3 hours for a 5-gallon batch. This includes setup, sanitizing, filling approximately 50 bottles, and cleanup. After bottling, your beer needs 2 weeks at room temperature for the yeast to carbonate it, followed by at least a few days of cold conditioning. The wait is tough, but proper conditioning makes a dramatic difference in your beer\'s quality.',
        steps: [
          'Before starting, verify fermentation is complete: gravity should be stable (same reading 2-3 days apart) and beer should taste like flat beer (not sweet wort). If gravity is still dropping, wait longer - bottling too early creates bottle bombs (over-carbonated bottles that can explode). Make sure you have enough bottles: ~50 12-oz bottles or ~25 22-oz bottles per 5-gallon batch.',
          'Clean all bottles thoroughly. Even new bottles can have dust. Rinse with hot water and inspect for debris. If bottles are dirty, soak in PBW/OxiClean solution for 30 minutes, then scrub with a bottle brush. Rinse thoroughly. Clean bottles are essential - you can\'t sanitize a dirty bottle.',
          'Sanitize all bottling equipment: bottles, caps, bottling bucket, siphon/racking cane, bottling wand, tubing, priming sugar pot, and stirring spoon. Use Star San mixed to package directions (typically 1 oz per 5 gallons water). For bottles: fill each with a few inches of sanitizer, swirl to coat the inside, dump into next bottle. Or use a bottle rinser attachment for faster work. No-rinse sanitizers like Star San don\'t need rinsing - air dry or use immediately.',
          'Calculate and prepare priming sugar: For 5 gallons of beer at desired 2.4-2.5 volumes of CO2 (typical for ales), use 3/4 cup (5 oz by weight) corn sugar OR 2/3 cup (4.6 oz) table sugar. Bring 2 cups of water to a boil, add sugar, stir to dissolve, boil for 2 minutes to sanitize. Cover and let cool to room temperature. You can also use priming sugar calculators online for exact volumes and different styles.',
          'Add cooled priming solution to sanitized bottling bucket. Don\'t add hot priming solution - it can kill yeast and create thermal currents that don\'t mix evenly. Pour it in the bottom of the bucket before transferring beer so mixing happens naturally during transfer.',
          'Gently transfer beer from fermenter to bottling bucket using auto-siphon and tubing. Start siphon (following manufacturer directions), then let gravity do the work. Keep the siphon intake above the yeast cake - you want clear beer, not sediment. Minimize splashing and turbulence - oxygen is beer\'s enemy at this stage. Fill from the bottom of the bottling bucket so beer flows up and over priming solution, mixing gently.',
          'Attach bottling wand to tubing. The spring-loaded tip prevents flow until pressed against bottle bottom, giving you excellent fill control. Place bottle on floor or low surface, bottling bucket on counter above (gravity fed). Press wand to bottle bottom, let fill to the brim. When you remove wand, liquid level will drop to perfect fill height (about 1 inch from top).',
          'Fill each bottle consistently: press wand to bottom, fill to brim, remove wand. Work at a steady pace - don\'t rush, but don\'t dawdle either. Minimize headspace at the top (the wand does this automatically if you fill to the brim while it\'s inserted). Consistent fill levels ensure consistent carbonation across all bottles.',
          'Cap bottles immediately after filling using a bottle capper. Center the cap on the bottle, place capper over it, and press down firmly (or pull handles together, depending on capper style). You should feel the cap crimp onto the bottle with a satisfying crunch. Test by gently trying to pull the cap off - it shouldn\'t move.',
          'Label your bottles with the beer name and bottling date. Masking tape and marker work great. You\'ll be amazed how quickly you forget what\'s what, especially if you brew multiple batches. Date is critical - it tells you when the beer is ready and helps you track aging.',
          'Store bottles upright at room temperature (65-75°F) for at least 2 weeks. The residual yeast in the beer will consume the priming sugar and produce CO2, which dissolves into the beer creating carbonation. Week 1: yeast consume sugar, pressure builds. Week 2: CO2 dissolves into beer. After 2 weeks, refrigerate at least 24 hours before drinking - cold temperatures help CO2 absorption and improve flavor.',
          'Sample one bottle at the 2-week mark. Chill for 24 hours first. Open carefully over a sink - if you\'re nervous about over-carbonation, you can "burp" it first (crack the cap slightly to release pressure, then recap and wait 24 hours). If carbonation is light, give remaining bottles another week at room temperature. If it\'s good, move all bottles to cold storage.',
          'Clean equipment immediately after bottling - dried-on beer becomes sticky and difficult to remove. Rinse everything with hot water. Soak bottling bucket and tubing in cleaning solution if needed. Hang tubing to dry to prevent mildew. Store caps in a dry location.'
        ],
        tips: [
          'Use a bottling wand (spring-loaded bottle filler) - it\'s the single best tool for consistent fills and reduced oxidation. They cost $5-10 and last forever.',
          'Avoid splashing at all costs. Oxygen exposure during packaging causes cardboard/stale flavors (oxidation) that develop over days/weeks. Transfer gently, don\'t splash when filling.',
          'Priming sugar amount is critical. Too little = flat beer. Too much = over-carbonated beer or bottle bombs. Use a calculator for precision, especially for high-gravity beers or different CO2 volumes.',
          'Bottle condition at consistent room temperature (65-75°F). Cooler temps slow yeast activity. Warmer temps risk over-carbonation. Find a stable spot and leave them alone.',
          'Wait the full 2 weeks before sampling. Week 1 samples are usually flat and disappointing. Week 2 is when carbonation really develops. Patience pays off.',
          'If you have a few bottles with light carbonation after 2 weeks, try gently inverting them once (to rouse yeast) and giving them another week warm. Different bottles can carbonate at different rates.',
          'Save your bottles! Rinse immediately after pouring. A quick rinse prevents dried-on beer crud. Store upside-down after rinsing.',
          'Consider oxygen-absorbing caps for hoppy beers like IPAs. They help reduce oxidation and keep hop character fresher longer. Standard caps work fine for most beers.',
          'Brown bottles protect against light damage (skunking). Green or clear bottles look cool but need to be stored in complete darkness. Light + hops = skunk.',
          'Alternative priming options: DME (dried malt extract) adds subtle malt character. Honey adds subtle honey notes. Commercial carbonation drops are convenient but more expensive.'
        ]
      }
    }
  ],
  'Brewing Basics': [
    {
      title: 'Getting Started Brew Day',
      difficulty: 'Beginner',
      time: '6-8 hours',
      content: {
        overview: 'Your first all-grain brew day is a significant milestone in homebrewing, representing the transition from extract brewing to complete control over every aspect of your beer. This comprehensive workflow covers the entire brew day from start to finish, including setup, mashing, lautering, boiling, and cleanup. All-grain brewing takes longer than extract brewing (6-8 hours for your first batch) but gives you complete creative control and typically costs less per batch. The process involves converting starches in crushed grain into fermentable sugars through mashing, collecting those sugars through lautering and sparging, then boiling with hops. While the day is long, most of it involves waiting and monitoring rather than active work. This guide assumes you have basic brewing knowledge and equipment - if this is your very first brew, start with extract brewing first to learn the fundamentals.',
        steps: [
          'Preparation (night before or morning of): Gather and organize all ingredients - base malts, specialty grains, hops (labeled by addition time), yeast, and any water treatment salts. Check that all equipment is present and functional: mash tun, brew kettle, burner, thermometer, hydrometer, fermenter, wort chiller, and all small tools. Measure out your grain bill and crush it fresh if possible (pre-crushed is fine). Mix sanitizer solution and fill a spray bottle. Set up your brewing area with clear workspaces for different stages. Having everything organized prevents scrambling mid-brew and reduces mistakes.',
          'Water preparation and heating (60-90 minutes before mash): Calculate your strike water volume (typically 1.25-1.5 quarts per pound of grain) and heat it to strike temperature (typically 8-15°F higher than your target mash temperature, depending on your system - use a strike water calculator). If treating your water chemistry, add salts to the strike water now. While water heats, prepare your mash tun - if it\'s new or cold, preheat it by filling with hot tap water, letting it sit 10 minutes, then dumping. Heat your sparge water separately (typically 170°F) - you\'ll need enough to collect your target pre-boil volume. This is a good time to double-check your recipe and set timers.',
          'Dough-in and mash (60-90 minutes): Add heated strike water to your mash tun, then slowly add crushed grain while stirring continuously to prevent dough balls (dry clumps of grain). Stir thoroughly for 2-3 minutes to ensure even water distribution and temperature throughout the mash. Check your mash temperature - target is typically 148-158°F depending on desired body (lower = drier, higher = fuller). If temperature is off by more than 3°F, adjust by adding small amounts of hot or cold water while stirring. Close the mash tun lid and insulate with sleeping bags or blankets. Set timer for 60 minutes. Check temperature every 20 minutes - if it drops more than 2-3°F, consider adding heat or better insulation next time.',
          'Mash out and vorlauf (20 minutes): Ten minutes before the end of your mash, heat the grain bed to 170°F by adding boiling water or applying direct heat if your system allows (this is called "mash out" and stops enzyme activity while making the wort more fluid). Begin vorlauf by slowly draining wort from the bottom of the mash tun into a pitcher, then gently pouring it back over the top of the grain bed. Repeat this recirculation for 10-15 minutes until the wort runs relatively clear (it won\'t be crystal clear, but should have no grain particles and be translucent rather than cloudy). Vorlauf sets the grain bed as a filter, preventing a stuck sparge later.',
          'Lautering and sparging (60-90 minutes): Slowly drain the first runnings (the wort beneath the grain bed) into your boil kettle, maintaining a slow, steady flow - target is about 1 quart per minute. As you drain, gently sprinkle or spray your 170°F sparge water over the top of the grain bed to rinse remaining sugars from the grain. Maintain about 1-2 inches of water above the grain bed at all times to prevent channeling and oxidation. Continue until you\'ve collected your target pre-boil volume (typically 6-6.5 gallons for a 5-gallon batch). Take a gravity reading of your wort - this tells you your mash efficiency. If gravity is too low, you can sparge longer; if too high, you can add water.',
          'Boil and hop additions (60-90 minutes): Bring wort to a vigorous, rolling boil. Watch carefully during the early stages - wort wants to boil over (hot break). Once you achieve steady boiling, start your timer. Add bittering hops at the start of the boil (60 or 90 minutes remaining, depending on recipe). Set alarms for each subsequent hop addition - typical schedule includes additions at 60 min (bittering), 15-20 min (flavor), 5 min (aroma), and sometimes flame-out/whirlpool (0 min). During the boil, sanitize all your fermentation equipment: fermenter, airlock, stopper, thermometer, hydrometer, funnel, and anything else touching cooled wort. A vigorous boil is essential for driving off DMS (cooked corn flavor) and achieving good hot break (protein coagulation).',
          'Cooling and transfer (30-45 minutes): At the end of the boil, turn off heat and begin cooling wort as rapidly as possible. Target is to get from boiling to pitching temperature (65-75°F for ales) in under 30 minutes. Use a wort chiller (immersion or counterflow) or ice bath. Stir gently during cooling to speed the process and create a whirlpool to settle the trub (hop and protein debris) in the center. Once cooled, carefully transfer wort to your sanitized fermenter, leaving as much trub behind as possible but don\'t stress about perfect clarity. Pour from a height or splash to aerate the wort - yeast need oxygen for healthy reproduction.',
          'Pitching yeast and final steps (15 minutes): Take and record your Original Gravity (OG) reading with your sanitized hydrometer. Compare to recipe target - being within 0.004 points is excellent. If using dry yeast, you can sprinkle it directly onto the wort surface (though rehydrating in warm water for 15 minutes is ideal). If using liquid yeast, shake the package vigorously and pitch the entire contents. Give the fermenter one final shake or swirl to mix the yeast throughout. Seal with sanitized stopper and airlock (filled with sanitizer or vodka). Place in your fermentation area (stable 65-70°F for ales, away from direct sunlight). Mark your calendar for gravity check in 7-10 days.',
          'Cleanup (30-45 minutes): Don\'t neglect this crucial step - dried-on wort, hop residue, and grain debris become exponentially harder to remove if left to dry. Immediately rinse all equipment with hot water. Soak anything with stuck-on material in hot water with PBW or OxiClean. Scrub with soft brushes or sponges (don\'t use abrasive pads that can scratch and harbor bacteria). Rinse everything thoroughly - no cleaner residue should remain. Hang tubing and hoses to dry. Store grain for composting (spent grain makes excellent compost or animal feed). Wipe down your brewing area. A clean workspace makes the next brew day more pleasant.'
        ],
        tips: [
          'Prep everything the night before: crush grain, measure hops into labeled containers, check equipment, fill sanitizer spray bottle. Brew day morning should be execution, not preparation.',
          'Use a detailed brew day checklist - even experienced brewers use them. It prevents forgotten hop additions, missed temperature checks, or skipped sanitization steps. Laminate your checklist so you can check off items with dry-erase marker.',
          'Keep detailed notes on everything: actual temperatures, volumes, gravities, timing, any deviations from the plan. These notes are invaluable for improving your process and troubleshooting issues. Include observations about clarity, color, and aroma at each stage.',
          'Stay organized throughout the day: clean as you go, keep a "dirty" area separate from your "clean/sanitized" area, label everything. A chaotic workspace leads to mistakes and contamination risk.',
          'Don\'t rush - especially during lautering and sparging. Slow and steady produces clearer wort and better efficiency. Rushing can cause stuck sparges, cloudy wort, and tannin extraction.',
          'Temperature control is critical during mashing - even 5°F can significantly affect your beer\'s body and fermentability. Invest in a good thermometer and check it regularly. Digital thermometers are faster and easier to read than analog.',
          'If something goes wrong, don\'t panic. Homebrewing is remarkably forgiving. Missed temperature by a few degrees? Off by half a gallon? Forgot a hop addition? Your beer will almost certainly turn out fine. Learn from it and adjust next time.',
          'Hydration and nutrition: brew day is long. Have water, snacks, and a meal plan. Dehydration and low blood sugar lead to mistakes and make cleanup feel miserable.',
          'The biggest time-saver for future brews: take notes on your timeline. Note when you started each phase and how long it actually took. This helps you plan more accurately next time and identify bottlenecks to improve.',
          'Consider having a helper for your first all-grain brew day. An extra pair of hands makes everything easier and safer, especially when handling large volumes of hot water.'
        ]
      }
    },
    {
      title: 'Sanitation 101',
      difficulty: 'Beginner',
      time: '30 minutes',
      content: {
        overview: 'Sanitation is the single most important factor in producing clean, infection-free beer. While proper technique, temperature control, and recipe formulation all matter, nothing ruins beer faster than poor sanitation practices. Understanding the difference between cleaning and sanitizing, knowing when each is required, and developing consistent sanitation habits will prevent 90% of brewing problems. The good news: sanitation is straightforward and doesn\'t require excessive paranoia - just consistent, thoughtful practices. The key principle is simple: anything that touches your beer after the boil must be sanitized. Boiling kills all microorganisms, but once wort cools below 170°F, it becomes vulnerable to contamination from wild yeast, bacteria, and mold. This guide covers essential sanitation practices, common sanitizers, and building reliable sanitation routines into your brew day.',
        steps: [
          'Understand cleaning vs. sanitizing: Cleaning removes visible dirt, debris, oils, and organic material using soap, detergents, or specialized brewing cleaners (PBW, OxiClean Free). Sanitizing kills or significantly reduces microorganisms using chemical solutions (Star San, iodophor) or heat. You cannot sanitize a dirty surface - cleaning must always happen first. Think of it this way: cleaning makes equipment physically clean and ready to be sanitized; sanitizing makes clean equipment microbiologically safe. Never skip the cleaning step, even if equipment looks clean - invisible beer residue, oils from hands, or microscopic material can harbor bacteria.',
          'Clean all equipment immediately after use: The single best sanitation practice is cleaning equipment immediately after you finish with it. Dried-on wort, beer residue, hop material, and yeast become exponentially harder to remove after drying. Rinse equipment with hot water right away. For stuck-on material, soak in hot water with PBW (Powdered Brewery Wash) or unscented OxiClean for 30-60 minutes, then scrub with soft brushes or sponges. Never use abrasive scrubbers or steel wool - they create scratches that harbor bacteria. Rinse thoroughly with hot water until no cleaner residue remains. Hang tubing and hoses to dry completely before storage.',
          'Prepare sanitizer solution before brew day: Mix your sanitizer according to package directions well before you need it. For Star San (most popular no-rinse sanitizer): mix 1 oz (6 tsp or 30ml) per 5 gallons of water. Use cool water if possible - Star San works better in lower pH water and warm water reduces its shelf life. For iodophor: mix 1 oz per 5 gallons. Mixed Star San solution lasts weeks to months if stored in a sealed container and remains clear and foamy - once it turns cloudy or stops foaming, it\'s no longer effective. Fill a spray bottle with sanitizer solution and keep it handy throughout brew day for quick spot-sanitizing.',
          'Sanitize all post-boil equipment: Everything that touches cooled wort (below 170°F) must be sanitized. This includes: fermenter and lid, airlock and stopper, thermometer, hydrometer and sample tube, funnel, stirring spoon, siphon/auto-siphon and tubing, bottling wand, bottles and caps (for bottling day), and kegs (for kegging day). The easiest method: fill your fermenter with sanitizer solution, submerge smaller items inside it, let everything sit for 2-5 minutes (Star San only needs 30 seconds but 2 minutes ensures coverage), then drain. For bottles: fill each with a few inches of sanitizer, swirl to coat interior, dump into next bottle - or use a bottle rinser attachment.',
          'Allow proper contact time and coverage: Sanitizers need direct contact with surfaces for the specified time. Star San requires only 30 seconds of contact but 2 minutes is better for peace of mind. Iodophor requires 2 minutes minimum. Ensure sanitizer reaches all surfaces - swirl it around bottles, spin tubing to coat the interior, ensure fermenter lid grooves are filled. For complex equipment like racking canes or bottling wands, pump sanitizer through them or let them soak completely submerged. Don\'t assume surface contact - visually confirm or use enough time that you\'re certain.',
          'No-rinse sanitizers don\'t need rinsing: Star San and iodophor (at proper concentrations) are no-rinse sanitizers - you can use equipment immediately after draining without rinsing. In fact, rinsing with tap water re-introduces potential contaminants and defeats the purpose. Simply drain sanitizer and use immediately. The tiny amount of remaining sanitizer won\'t harm your beer or yeast. Some brewers worry about foam from Star San - "don\'t fear the foam" is a common saying. The foam is harmless and actually indicates the solution is still active. If you\'re using bleach (not recommended but sometimes used), you MUST rinse thoroughly as bleach can harm yeast and create off-flavors.',
          'Maintain a "clean" and "dirty" zone during brew day: Organize your workspace into distinct areas - a "dirty" zone for handling hot wort, spent grain, and pre-boil equipment, and a "clean" zone for sanitized post-boil equipment. Once you sanitize something (fermenter, hoses, etc.), keep it in the clean zone and don\'t let it touch anything from the dirty zone. This mental separation prevents contamination from careless handling. For example: don\'t set your sanitized fermenter lid down on the same counter where you just dumped spent grain. Use clean surfaces, sanitized foil, or keep lids floating in sanitizer solution.',
          'Sanitize your hands and anything that might touch beer: Before handling sanitized equipment or touching anything that will contact wort, wash your hands thoroughly with unscented soap. Consider keeping a spray bottle of Star San to spray your hands before handling fermenters, taking samples, or adding dry hops. If you drop something, touch something questionable, or are unsure about contamination - re-sanitize. It takes 30 seconds and prevents weeks of disappointment. Common contamination sources: dirty hands, pets rubbing against equipment, dust in the air, unsanitized measuring cups or funnels.',
          'Special attention to hard-to-clean items: Some equipment requires extra care. Plastic fermenters can develop scratches over time that harbor bacteria - inspect regularly and replace if heavily scratched (every 2-3 years typically). Silicone or rubber gaskets, o-rings, and tubing can trap material in microscopic crevices - replace these annually or when they look worn. Bottle caps are one-time use only (they deform when crimped). Airlocks should be disassembled and cleaned thoroughly - biofilm can build up inside. Auto-siphons have internal parts that need periodic disassembly and cleaning. When in doubt, replace cheap parts rather than risk infection.',
          'Heat sanitization as an alternative: If you don\'t have chemical sanitizers, you can use heat. Immerse equipment in water at 170°F or higher for at least 5 minutes, or use your dishwasher\'s sanitize cycle (if it reaches 170°F+). This works well for bottles, small tools, and fermenters. However, heat can\'t reach inside tubing effectively and may warp some plastics. Chemical sanitizers are more versatile and practical for most homebrewing applications. The boil itself is your primary heat sanitization - anything in the boil kettle during the boil is sanitized by definition.'
        ],
        tips: [
          'Clean is NOT the same as sanitized. Cleaning removes dirt. Sanitizing kills microbes. You must clean first, then sanitize. Never skip the cleaning step - you cannot sanitize a dirty surface effectively.',
          'Make extra sanitizer solution - far more than you think you\'ll need. It\'s better to have too much than to run out mid-brew and scramble to make more. Mixed Star San keeps for weeks in a sealed container, so excess isn\'t wasted.',
          'Keep a spray bottle of sanitizer handy throughout brew day and packaging day. Use it to spray hands, quickly sanitize dropped items, or hit surfaces that might contact beer. This spray bottle is your best friend.',
          'If in doubt, sanitize again. It only takes 30 seconds and provides complete peace of mind. "Better safe than sorry" absolutely applies to sanitation. When you think "should I re-sanitize this?" the answer is always yes.',
          'Star San works better in acidic water (pH below 3). If you have hard water, it may not work as effectively. Consider using distilled or RO water for mixing Star San, or acidify your water slightly.',
          'Don\'t sanitize before you need to - sanitize right before use. If you sanitize your fermenter in the morning but don\'t fill it until evening, sanitize it again. Sanitized surfaces don\'t stay sanitized forever in open air.',
          'Trust the process - proper sanitation doesn\'t require paranoia or obsessive behavior. Following consistent practices is far more important than extreme measures. You don\'t need to sanitize in a sterile cleanroom or wear gloves.',
          'Learn to recognize contamination: sour or funky smells, unexpected cloudiness, unusual surface film, or off-flavors like vinegar, Band-Aid, or barnyard. If you get an infection, deep-clean and replace soft goods (tubing, gaskets) before brewing again.',
          'Brewing before the boil (mashing, lautering) requires cleaning but not sanitization - the boil will kill everything. Save your sanitizer for post-boil equipment only. This saves time and sanitizer.',
          'Some brewers use "sani-rinse" before packaging: mix a small amount of Star San and rinse kegs or bottles with it just before filling, even if already sanitized. This provides an extra barrier against contamination.'
        ]
      }
    },
    {
      title: 'Water Chemistry Intro',
      difficulty: 'Intermediate',
      time: '1 hour',
      content: {
        overview: 'Water chemistry is often described as the "graduate level" of homebrewing, but understanding the basics can dramatically improve your beer quality - particularly for hop-forward and delicate styles. Water makes up 90-95% of beer, and its mineral content affects mash pH, hop perception, malt character, and yeast health. The good news: you don\'t need to be a chemist to make meaningful improvements. This introduction focuses on the essential minerals and practical adjustments that make the biggest difference. Many professional brewers credit water chemistry as the final piece that elevated their beers from good to great. While you can make excellent beer without adjusting water chemistry, understanding these principles helps troubleshoot issues like harsh bitterness, flat malt flavor, or poor efficiency, and allows you to dial in specific characteristics for different beer styles.',
        steps: [
          'Obtain your water report from your municipality: Most cities publish annual water quality reports online - search "[your city] water quality report" or contact your water utility directly. These reports show mineral content including calcium, magnesium, sodium, sulfate, chloride, and bicarbonate, along with pH. If you have well water or want precise measurements, consider sending a sample to Ward Labs (widely used by homebrewers, costs about $30). Save this report as your baseline. Note: municipal water can vary seasonally, so if you notice changes in your beer character at different times of year, seasonal water variation might be the cause.',
          'Understand the key minerals and their effects: Six minerals matter most in brewing. Calcium (Ca): 50-150 ppm ideal range, promotes enzyme activity during mashing, helps yeast health, aids in protein coagulation and beer clarity - the single most important mineral to get right. Magnesium (Mg): 10-30 ppm, supports yeast health in small amounts but contributes harsh bitterness above 30 ppm. Sulfate (SO4): enhances hop bitterness and creates a dry, crisp finish - use 50-150 ppm for balanced beers, 150-300+ ppm for very hoppy IPAs. Chloride (Cl): enhances malt sweetness and fullness - use 50-100 ppm for hoppy beers, 100-150 ppm for malt-forward beers. Sodium (Na): enhances malt sweetness but can taste salty above 150 ppm - generally keep below 100 ppm. Bicarbonate (HCO3): creates alkalinity that resists pH changes - beneficial for dark beers, problematic for pale beers.',
          'Test and understand mash pH: Mash pH (measured at room temperature) should fall in the 5.2-5.6 range for optimal enzyme activity and extraction. Pale beers need the lower end (5.2-5.4), while dark beers can go higher (5.4-5.6). Buy pH strips or a digital pH meter (calibrate regularly). Take your first pH reading 10 minutes into your mash. If pH is too high (above 5.6), add small amounts of lactic acid or acidulated malt. If too low (below 5.2), add calcium carbonate or baking soda. The grain bill itself affects pH - dark roasted malts are acidic and naturally lower pH, while pale malts produce higher mash pH. This is why water chemistry interacts closely with your recipe.',
          'Match water profiles to beer styles (general guidelines): Pale, hoppy beers (IPAs, Pale Ales): low bicarbonate, moderate calcium (75-150 ppm), high sulfate (150-300 ppm), low-moderate chloride (50-100 ppm) - creates a dry, crisp finish that showcases hops. Malt-forward beers (Oktoberfest, Brown Ale, Scottish Ale): moderate calcium (50-100 ppm), low sulfate (50-100 ppm), moderate-high chloride (100-150 ppm) - enhances malt sweetness and body. Dark beers (Stouts, Porters): can handle higher bicarbonate (150-250 ppm), moderate calcium and chloride - alkalinity balances acidity from dark grains. Pilsners: very soft water with low minerals across the board (25-50 ppm calcium, minimal sulfate and chloride) - creates delicate character. These are starting points, not rigid rules.',
          'Learn the sulfate-to-chloride ratio concept: The ratio of sulfate to chloride (SO4:Cl) dramatically affects hop versus malt perception. Ratio of 3:1 or higher = very hoppy, dry, bitter character. Ratio of 2:1 = balanced but hop-leaning. Ratio of 1:1 = balanced. Ratio of 1:2 = malt-forward, fuller body. Ratio of 1:3 or lower = very malty and sweet. For example, an IPA might have 250 ppm sulfate and 75 ppm chloride (3.3:1 ratio), while a Marzen might have 75 ppm sulfate and 125 ppm chloride (0.6:1 ratio). This ratio is one of the most powerful tools for shaping beer character.',
          'Make your first water adjustments using brewing salts: Start simple with two salts: gypsum (calcium sulfate) and calcium chloride. For a hoppy beer like an IPA: add 1 tsp gypsum per 5 gallons to boost sulfate and calcium. For a malty beer like an amber: add 1 tsp calcium chloride per 5 gallons to boost chloride and calcium. Add salts directly to your strike water, stir to dissolve. Use a water calculator (Bru\'n Water is popular and free) to predict the resulting mineral concentrations and pH. Take detailed notes. Start with conservative additions - you can always add more next time, but you can\'t remove excess. Taste the difference between batches to learn how minerals affect your specific palate and system.',
          'Consider starting with RO or distilled water: If your tap water is heavily mineralized, has chlorine/chloramine, or produces inconsistent results, consider building your water from scratch using reverse osmosis (RO) or distilled water. This gives you a blank canvas - start at zero and add only what you want. RO water costs $0.30-1.00 per gallon at grocery stores or water stores (or invest in an RO system for $150-300). For a standard ale with RO water, start with: 1/2 tsp calcium chloride + 1/2 tsp gypsum per 5 gallons. This provides baseline calcium and balanced sulfate/chloride. Adjust from there based on style. Many professional breweries use RO water for this exact reason - complete control and consistency.',
          'Deal with chlorine and chloramine: Municipal water often contains chlorine (easier to handle) or chloramine (more persistent) to prevent bacterial growth. Both create medicinal, Band-Aid-like off-flavors in beer. Chlorine can be removed by: carbon filtration (Brita filter or inline carbon filter), or letting water sit overnight (chlorine evaporates). Chloramine requires: carbon filtration with extended contact time, or adding Campden tablets (1/2 tablet per 5-10 gallons, crush and dissolve in water 10 minutes before use). Campden tablets are cheap, reliable, and widely used by homebrewers. If you detect chemical or medicinal flavors in your beer, chloramine is a likely culprit.',
          'Document everything and iterate: Keep detailed records of your water additions, resulting beer character, and any pH measurements. Over time, you\'ll develop an intuition for what works in your system with your water source. Change one variable at a time so you can isolate the effects. Compare beers side-by-side when possible - brew the same recipe with and without water adjustments to really understand the impact. Water chemistry is iterative - each batch teaches you something new. Don\'t expect perfection on your first attempt, but do expect noticeable improvements once you dial things in.'
        ],
        tips: [
          'Start with RO or distilled water if you want complete control and consistent results. Building water from scratch is easier than trying to modify highly mineralized tap water, especially when starting out.',
          'Focus on calcium first - getting calcium in the 50-150 ppm range improves mash efficiency, yeast health, and beer clarity. If you do nothing else with water chemistry, ensure adequate calcium levels.',
          'Sulfate enhances hop bitterness and dryness - increase it for IPAs, Pale Ales, and hop-forward beers. Gypsum (calcium sulfate) is the easiest way to boost sulfate while also adding beneficial calcium.',
          'Chloride enhances malt sweetness and body - increase it for Ambers, Stouts, Marzens, and malt-forward styles. Calcium chloride is the standard way to boost chloride along with calcium.',
          'The sulfate-to-chloride ratio is more important than absolute concentrations for shaping hop/malt balance. A 2:1 or 3:1 ratio emphasizes hops; a 1:2 or 1:3 ratio emphasizes malt.',
          'Use Bru\'n Water or another water calculator - it handles the complex chemistry calculations and prevents mistakes. Input your source water and desired targets, and it tells you exactly how much of each salt to add.',
          'Campden tablets (potassium metabisulfite) are the easiest way to remove chlorine and chloramine. One tablet treats 20 gallons, costs pennies, and works in minutes. Every brewer should have these on hand.',
          'Mash pH matters more than most brewers realize - if you\'re getting astringency, harsh bitterness, or poor efficiency, check your mash pH. Most issues fall in the too-high category. Add acid (lactic or phosphoric) to lower pH.',
          'Don\'t add salts to your entire water volume - add them to mash water and/or sparge water depending on your goals. Many brewers add salts only to mash water for pH control, using plain RO for sparging.',
          'Be patient and systematic - water chemistry improvements are often subtle on single batches but dramatic when comparing beers brewed 6 months apart. Trust the process and keep learning.'
        ]
      }
    },
    {
      title: 'Understanding Hops',
      difficulty: 'Beginner',
      time: '30 minutes',
      content: {
        overview: 'Hops are the spice of beer, providing bitterness to balance malt sweetness, contributing flavor and aroma compounds, and acting as a natural preservative. Understanding hop varieties, their characteristics, and how to use them effectively is essential for any brewer beyond the beginner stage. The hop world has exploded in recent decades - from a handful of noble European varieties to hundreds of cultivars from around the world, each with unique flavor and aroma profiles. Modern hops can deliver everything from classic floral and earthy notes to tropical fruit, citrus, pine, dank cannabis, and even fruit punch flavors. This guide covers hop fundamentals: varieties and their uses, alpha acid and IBU calculations, addition timing and its effects, dry hopping techniques, and proper storage. Mastering hops opens up endless creative possibilities and is key to brewing outstanding IPAs, Pale Ales, and any hop-forward beer.',
        steps: [
          'Learn the three hop categories and their uses: Bittering hops have high alpha acid content (10-17%+) and are used primarily for adding bitterness rather than flavor or aroma - examples include Magnum, Warrior, Columbus. These are workhorses added early in the boil. Aroma hops have lower alpha acids (3-7%) but intense aromatic compounds - examples include Saaz, Hallertau, Tettnanger. These are noble hops used in traditional European styles, added late in the boil or as dry hops. Dual-purpose hops fall in between (6-12% alpha acids) and work for both bitterness and aroma - examples include Cascade, Centennial, Chinook, Simcoe. Most American craft beer hops are dual-purpose, making them versatile and popular.',
          'Understand alpha acid percentage and IBUs: Alpha acids are the primary bittering compounds in hops, measured as a percentage of the hop cone\'s weight. A hop with 12% alpha acids contains 12% alpha acids by weight. During the boil, alpha acids isomerize (chemically convert) into iso-alpha acids, which are soluble and taste bitter. Longer boil times = more isomerization = more bitterness. IBUs (International Bitterness Units) measure the concentration of iso-alpha acids in finished beer. A light lager might have 10-15 IBUs, a balanced pale ale 30-40 IBUs, and a double IPA 60-100+ IBUs. Use brewing software or online calculators to determine how much hops to add at each time to hit your target IBUs. Alpha acid percentages vary by crop year, so always check the package.',
          'Master hop addition timing and its effects on beer: The fundamental rule: boil time determines the contribution. 60-90 minute additions (start of boil): Maximum bitterness, minimal flavor/aroma - alpha acids fully isomerize, but volatile aromatic compounds boil off. Use high-alpha bittering hops here for efficiency and cost-effectiveness. 15-30 minute additions (mid-boil): Moderate bitterness plus some hop flavor - you get partial isomerization plus some retained flavor compounds. This is the "flavor hop" addition. 5-10 minute additions (late boil): Minimal bitterness, strong hop flavor and some aroma - aromatic compounds are preserved but still partially volatilized. 0-minute additions (flame-out/whirlpool): No bitterness, maximum flavor and aroma - add hops after turning off heat, let steep 10-20 minutes while cooling. Some isomerization still occurs if wort is hot. Dry hopping (post-fermentation): Zero bitterness, maximum aroma - adds intense hop aroma with no bitterness at all.',
          'Explore hop varieties and flavor profiles: Hops are categorized by origin and flavor. Noble hops (European): Saaz (Czech Pilsner), Hallertau, Tettnanger, Spalt - floral, spicy, earthy, herbal notes used in lagers and traditional German/Czech styles. American C-hops: Cascade (grapefruit, floral), Centennial (citrus, floral), Columbus/Tomahawk (dank, pungent), Chinook (pine, grapefruit) - the classic American craft beer hops. New school American hops: Citra (tropical fruit, mango, lime), Mosaic (mango, berry, tropical), Simcoe (pine, passion fruit, earthy), Amarillo (orange, floral). Southern Hemisphere: Galaxy (passion fruit, peach), Nelson Sauvin (white wine, gooseberry), Motueka (lime, tropical). British hops: East Kent Goldings (earthy, honey), Fuggle (earthy, woody, floral). Experiment with single-hop beers to learn each variety\'s character.',
          'Try dry hopping for intense hop aroma: Dry hopping means adding hops directly to the fermenter after active fermentation is complete, typically during the final 3-7 days before packaging. This adds massive hop aroma without any bitterness because there\'s no heat to isomerize alpha acids. Use 0.5-2 oz per gallon depending on desired intensity (IPAs often use 1-2 oz/gallon). Sanitize the outside of the hop package, open the fermenter briefly, dump hops directly in, and reseal. Keep temperature at 65-70°F for best extraction. After 3-5 days, the beer has absorbed most of the aromatic compounds - longer doesn\'t necessarily mean more aroma and can extract grassy, vegetal flavors. Cold crash after dry hopping to drop hop particles out before packaging.',
          'Learn pellet hops vs. whole cone hops: Pellet hops are processed into small pellets - they\'re more compact, store better, and are easier to measure and use. They break apart in the boil, releasing oils quickly. Most homebrewers use pellets exclusively. Whole cone hops (or "leaf hops") are intact hop flowers - they look beautiful, create a more natural hot break, and some claim subtly better flavor, but they take up more space, absorb more wort (losses), and are harder to store. For practical purposes, pellets are superior for homebrewing. Cryo hops are a newer form: concentrated lupulin glands (the yellow powder containing oils and acids) with plant material removed - they\'re more potent and create less vegetal character, but cost more. Use at half the rate of regular pellets.',
          'Understand hop freshness and degradation: Hops degrade over time, losing alpha acids and aromatic oils - old hops contribute less bitterness and stale, cheesy aromas instead of fresh hop character. Check the harvest year (printed on package) and alpha acid percentage. Fresh hops should smell vibrant and aromatic when you open the package. If they smell like cheese, grass clippings, or have a stale odor, they\'re past prime. Hops stored at room temperature degrade rapidly (weeks to months). Vacuum-sealed hops in the freezer last 1-2 years with minimal degradation. Opened hops should be resealed (vacuum sealing or squeezing out air from bag) and frozen immediately. For maximum freshness, buy hops only as needed and use within the year.',
          'Calculate hop utilization and efficiency: Not all alpha acids in hops convert to bitterness - utilization depends on boil time, wort gravity, and boil vigor. A 60-minute boil in standard gravity wort (1.050) typically achieves 25-30% utilization - meaning only 25-30% of the alpha acids isomerize into bitterness. Higher gravity wort reduces utilization (sugar interferes with isomerization), so high-gravity beers need more hops to achieve the same IBUs. Vigorous boils increase utilization by improving mixing and isomerization. Brewing software handles these calculations automatically, but understanding the concept helps you troubleshoot if your beer is more or less bitter than expected. Late hop additions have very low utilization (5-10% or less), which is why they don\'t add much bitterness.',
          'Experiment and document your hop usage: Keep detailed notes on hop varieties, amounts, timing, and the resulting beer character. Brew the same recipe multiple times, changing only the hop schedule, to understand how timing affects the beer. Try single-hop beers where you use only one variety throughout - this teaches you that hop\'s specific character. Blend hops for complexity: for example, use Magnum for clean bittering, Centennial for flavor, and Citra for aroma. Smell and taste hops in their raw form to develop sensory memory. Buy small quantities of many varieties rather than large quantities of one - variety teaches you more. Join online communities to learn which hops work well together and which new varieties are worth trying.',
          'Consider terroir and crop year variations: Like wine grapes, hops vary by growing region and year. Cascade from Yakima Valley may taste different from Cascade grown in New Zealand. A drought year might produce hops with higher alpha acids and different oil profiles than a wet year. Always check the actual alpha acid percentage on your specific package rather than using generic values from brewing software - this ensures accurate IBU calculations. Many brewers keep notes like "2024 Simcoe was intense and dank" or "prefer 2023 Citra for tropical fruit." This level of detail is advanced, but awareness helps you understand year-to-year variations in your beers.'
        ],
        tips: [
          'Higher alpha acid percentage means more bittering potential per ounce, making high-alpha hops cost-effective for bittering. But alpha acids don\'t determine flavor or aroma - a 15% hop isn\'t "better" than a 5% hop, just different.',
          'Late boil additions (5-10 minutes) and flame-out additions preserve hop flavor and aroma much better than early additions. If you want hop character, add hops late and dry hop.',
          'Dry hopping for 3-5 days is optimal for most beers. Longer doesn\'t necessarily extract more aroma and can lead to grassy, vegetal flavors. Monitor by smell - when the aroma peaks, package soon after.',
          'Always keep hops frozen and vacuum-sealed or in airtight containers with minimal air. Hops are delicate and degrade quickly at room temperature. Buy only what you\'ll use within a year.',
          'Single-hop beers are the best education: brew a simple pale ale or IPA using only one hop variety throughout. You\'ll learn that hop\'s character intimately and can blend intelligently later.',
          'The "Columbus/Tomahawk/Zeus" hops (often called CTZ) are genetically identical and can be used interchangeably. Similarly, many hops have aliases or slight variations - research before buying to avoid duplicates.',
          'Hop oils matter as much as alpha acids for aroma and flavor: myrcene (herbal, resinous), humulene (woody, earthy), caryophyllene (spicy, woody), and farnesene (floral, woody). Advanced brewers look at oil content, but for beginners, focus on variety characteristics and timing.',
          'IBU calculations are estimates, not absolutes. Two beers with the same calculated IBUs can taste very different in perceived bitterness due to malt sweetness, alcohol level, and hop variety. Use IBUs as guidelines, not gospel.',
          'For hoppy styles like IPAs, distribute your hops across multiple additions rather than one giant addition. For example: small bittering addition at 60 min, larger additions at 10 min and 0 min, plus dry hop. This creates complexity and layered hop character.',
          'Don\'t be afraid to experiment with unconventional timing: some brewers do "hop bursting" (all hops late in boil for low bitterness and high flavor), "first wort hopping" (hops added during lautering), or double dry hopping (two separate dry hop additions). These techniques produce unique results.'
        ]
      }
    },
    {
      title: 'Malt & Grain Basics',
      difficulty: 'Beginner',
      time: '30 minutes',
      content: {
        overview: 'Malt is the soul of beer, providing fermentable sugars, body, color, and the malt flavors that balance hop bitterness. Understanding different types of malt and grain, their characteristics, and how to combine them into effective grain bills is foundational to recipe design and all-grain brewing. Malted grain (usually barley) has been soaked, allowed to germinate, and then kilned to develop enzymes that convert starches into fermentable sugars during mashing. Different kilning temperatures and times produce wildly different flavors and colors - from pale, bready base malts to dark, roasty, coffee-like roasted malts. This guide covers the main categories of brewing grains: base malts that provide the bulk of fermentable sugars, specialty malts that add color and flavor, and adjunct grains that contribute unique characteristics. Learning to "read" a grain bill and understand how each component affects the finished beer is an essential skill for all-grain brewing.',
        steps: [
          'Understand base malts - the foundation of every grain bill: Base malts make up 60-100% of your grain bill and provide the majority of fermentable sugars. They\'re kilned at low temperatures to preserve the enzymes (alpha-amylase and beta-amylase) needed to convert starches to sugars during mashing. Main varieties: 2-Row Pale Malt (North American standard, clean, neutral, slightly grainy flavor, 1.8°L color), Pilsner Malt (lightly kilned, delicate malt sweetness, slightly honey-like, 1.5-2°L, traditional for lagers and Belgian styles), Maris Otter (British, rich malty flavor, biscuity, nutty, 3-4°L, classic for British ales), Pale Ale Malt (similar to 2-Row but slightly toastier, 2.5-3.5°L), Vienna Malt (toasty, bready, amber color, 3-4°L, can be used as 100% of grain bill), and Munich Malt (rich malty sweetness, bread crust, 6-10°L, adds depth). You can use a single base malt or blend several for complexity.',
          'Learn about crystal/caramel malts and the Lovibond scale: Crystal malts (also called caramel malts) are specialty malts that add color, sweetness, body, and flavor without contributing fermentable sugars - they\'re "pre-converted" during malting and contain unfermentable sugars. They\'re measured on the Lovibond (°L) scale which indicates color intensity. Common varieties: Crystal 10-20°L (very light, sweet, honey-like), Crystal 40-60°L (medium amber, caramel, toffee flavors - most versatile), Crystal 80-90°L (dark amber, raisin, dark fruit), Crystal 120°L+ (dark brown, burnt sugar, raisin, prune). Use 5-15% of grain bill typically. Too much creates cloying sweetness and one-dimensional character. British Crystal malts taste slightly different from American - they\'re often nuttier and less sweet.',
          'Explore roasted malts for color and intense flavor: Roasted malts are kilned or roasted at high temperatures, creating dark colors and intense roasted, coffee, chocolate, or burnt flavors. These are used in small amounts (1-10% of grain bill) for dark beers. Varieties include: Chocolate Malt (350-450°L, smooth chocolate, coffee, nutty - the most versatile dark malt), Roasted Barley (unmalted barley roasted until very dark, 500-600°L, dry, acrid, coffee, burnt - signature flavor of Irish stouts), Black Patent Malt (500-600°L, sharp, acrid, burnt, use sparingly), Carafa Special (German, de-husked for smoother flavor, less astringency, available in I/II/III for increasing darkness). Even 2-3% of roasted malt can dramatically affect beer color and flavor. Start conservatively and increase in subsequent batches if desired.',
          'Understand specialty malts for specific characteristics: Beyond base, crystal, and roasted malts, many specialty malts add specific characteristics. Biscuit/Victory Malt (biscuity, toasted bread flavor, 25-30°L), Aromatic Malt (intense malt aroma, bread crust, 20-25°L), Brown Malt (dry, toasted, biscuit, coffee, 50-70°L), Special B (Belgian, intense dark fruit, raisin, plum, 120-180°L), Melanoidin Malt (enhances malt aroma and red color, bread crust, 20-30°L), Honey Malt (sweet, subtle honey character), and Acidulated Malt (lowers mash pH naturally, useful for pale beers with alkaline water). These are typically used at 3-10% of grain bill for accent and complexity.',
          'Learn about adjunct grains and their uses: Adjuncts are non-barley grains or unmalted ingredients that contribute specific characteristics. Flaked Oats (creamy mouthfeel, haze, smoothness - used in Oatmeal Stouts and New England IPAs at 5-20%), Flaked Wheat or Wheat Malt (head retention, haze, light grain flavor - used in Hefeweizens, Witbiers, and NEIPAs at 10-50%), Flaked Barley (smooth mouthfeel, head retention - used in stouts at 5-10%), Rye Malt (spicy, dry, earthy character at 5-20%), Corn/Rice (lightens body, dries out beer, used in American lagers), and Unmalted Wheat (protein for head retention and haze). Most adjuncts lack enzymes, so they must be mashed with base malt that provides enzymes for conversion. Flaked adjuncts are pre-gelatinized and can be added directly to the mash.',
          'Calculate grain bill percentages and balance: A typical all-grain recipe might look like: 85% base malt (provides fermentables and enzymes), 10% crystal malt (adds color, body, sweetness), 5% specialty malt for character (biscuit, chocolate, etc.). This is just a starting point. Simpler beers use less variety: a pilsner might be 100% pilsner malt, while a complex Belgian might have 6-8 different malts. When designing grain bills, think in percentages rather than absolute weights - it scales better. For a 10-pound grain bill targeting 5 gallons at 1.050 OG, 85% base = 8.5 lbs, 10% crystal = 1 lb, 5% specialty = 0.5 lbs. Use brewing software to predict Original Gravity and adjust grain amounts to hit your target.',
          'Match grains to beer styles and understand conventions: Different styles have traditional grain bill structures. American Pale Ale/IPA: 90-95% 2-Row, 5-10% crystal 40-60°L. English Bitter: 85-90% Maris Otter, 5-10% crystal 60-80°L, 2-5% biscuit or chocolate for color. Stout: 70-80% pale malt, 5-10% roasted barley, 5-10% flaked barley, 5-10% chocolate malt. Hefeweizen: 50-60% wheat malt, 40-50% pilsner malt. Oktoberfest: 50% Munich, 40% Vienna, 10% crystal 20°L. These are guidelines, not rules - many great beers break conventions. Study commercial beer grain bills (available online) to learn patterns, then experiment.',
          'Understand grain crush and freshness: Grain must be crushed (milled) before mashing to expose the starchy interior while keeping husks mostly intact. Proper crush looks like cracked grain with visible white interior and mostly intact husks (husks form the filter bed during lautering). Too fine = stuck sparges and astringency from tannin extraction. Too coarse = poor extraction and low efficiency. Most homebrew shops will crush grain for you using roller mills. If you buy whole (uncrushed) grain, crush it within 24-48 hours of brewing for best freshness - crushed grain oxidizes and loses freshness quickly. If buying pre-crushed, use within 2 weeks. Store whole grain in sealed containers in a cool, dry place - it lasts 6-12 months easily. Check for musty smells or mold before using.',
          'Learn to "read" and analyze grain bills: When you see a recipe, analyze the grain bill to predict beer character. High percentage of base malt (90%+) = clean, simple, dry beer that showcases hops or yeast. Moderate specialty malts (10-20%) = balanced beer with malt character and complexity. Heavy specialty malts (20%+) = rich, sweet, malty beer with lots of residual body. Look for roasted malts to predict dark color and roasted flavors. Notice crystal malt percentages - 5% is subtle, 15% is prominent, 20%+ is very sweet and full-bodied. This analytical skill helps you understand recipes and modify them intelligently.',
          'Experiment with single malt beers (SMaSH): The best way to learn individual grain characteristics is brewing Single Malt and Single Hop (SMaSH) beers. Use one base malt and one hop variety - this isolates each ingredient\'s contribution. Try: 100% 2-Row with Cascade, 100% Maris Otter with East Kent Goldings, 100% Pilsner with Saaz, 100% Munich with Hallertau. These simple beers teach you what each malt tastes like without complexity masking the character. Keep detailed notes on flavor, body, color, and compare side-by-side. This foundation makes you a better recipe designer and helps you troubleshoot issues in more complex beers.'
        ],
        tips: [
          'Base malts should be 60-100% of your grain bill - they provide the enzymes needed for starch conversion and the bulk of fermentable sugars. You cannot mash specialty malts or adjuncts alone without base malt enzymes.',
          'Crystal/caramel malts add sweetness, body, and color, but too much creates cloying, one-dimensional beer. Use 5-15% for most styles. If your beer tastes overly sweet or syrupy, reduce crystal malt in the next batch.',
          'Roasted malts are powerful - a little goes a long way. Start with 3-5% for subtle color and flavor, increase gradually. A beer with 10% roasted barley will taste very dark, dry, and roasted.',
          'Freshly milled grain extracts better than pre-crushed grain that\'s been sitting for weeks. If possible, buy whole grain and crush within 24-48 hours of brewing, or buy pre-crushed and use within 2 weeks.',
          'Different base malts have different flavors - 2-Row is neutral, Maris Otter is biscuity and rich, Pilsner is delicate and slightly sweet, Munich is malty and bread-like. Choose base malt to complement your beer style.',
          'The Lovibond (°L) scale measures color, but darker doesn\'t always mean stronger flavor. Crystal 120°L adds dark color and raisin flavor, while Chocolate Malt (400°L) adds even darker color with coffee/chocolate flavor. Read descriptions, not just numbers.',
          'When substituting grains, match both color and character. Crystal 60°L and Biscuit Malt are both ~25-30°L but taste completely different. Crystal is sweet and caramel-like; Biscuit is dry and toasted.',
          'Adjuncts like oats and wheat affect mouthfeel and head retention dramatically - even 5-10% makes a noticeable difference. Flaked oats create creamy, silky texture perfect for stouts and NEIPAs.',
          'Buy grain in bulk if you brew frequently - base malt costs $1-2/lb in bulk vs. $2-3/lb in small quantities. Store in sealed buckets or bins in a cool, dry place. Buy specialty malts by the pound as needed.',
          'Taste your grains raw (chew a few kernels) to develop sensory memory. Base malts taste grainy and slightly sweet. Crystal malts taste sweet and candy-like. Roasted malts taste coffee-like and bitter. This helps you predict how they\'ll affect your beer.'
        ]
      }
    }
  ],
  'All-Grain Brewing': [
    {
      title: 'Single Infusion Mash',
      difficulty: 'Intermediate',
      time: '90 minutes',
      content: {
        overview: 'The single infusion mash is the most common and straightforward all-grain mashing technique, used for 90% of homebrewed beers and many commercial ales. The concept is simple: mix crushed grain with hot water at a calculated temperature, hold that temperature for 60 minutes, and let enzymes convert starches into fermentable sugars. Unlike step mashing (which uses multiple temperature rests), single infusion uses one constant temperature throughout the mash. This method works because modern malts are well-modified and contain plenty of enzymes, making complex temperature programs unnecessary for most styles. Single infusion mashing is perfect for American and British ales, IPAs, stouts, and most beer styles except traditional lagers and some specialized European styles. The key to success is hitting and maintaining your target mash temperature, which determines the fermentability and body of your finished beer.',
        steps: [
          'Calculate strike water volume and temperature: Strike water is the initial hot water you mix with grain to begin the mash. Volume: use 1.25-1.5 quarts of water per pound of grain (thicker mash = 1.25 qt/lb favors beta-amylase and drier beer; thinner mash = 1.5 qt/lb favors alpha-amylase and easier lautering). For a 10-pound grain bill, use 3.1-3.75 gallons strike water. Temperature: your strike water must be hotter than your target mash temperature because adding room-temperature grain will cool it down. Calculate using a strike water calculator or this formula: Strike Temp = (Target Mash Temp - Room Temp) × (0.2 / water-to-grain ratio) + Target Mash Temp. For most systems, strike water should be 10-15°F above your target mash temperature. If targeting 152°F mash, heat strike water to 165-167°F.',
          'Heat strike water and prepare mash tun: Heat your calculated volume of water to strike temperature. If you\'re using treated water or adding brewing salts, add them now. Stir to ensure even temperature throughout - water can stratify with hot zones and cool zones. While water heats, prepare your mash tun: if it\'s new or has been sitting cold, preheat it by filling with hot tap water, closing the lid for 5-10 minutes, then dumping (this prevents the tun from absorbing heat from your strike water and lowering your mash temp). Measure and prepare your crushed grain - have it ready to add quickly once strike water reaches temperature.',
          'Dough in - add grain to strike water: Pour the heated strike water into your mash tun. Slowly add crushed grain while stirring continuously with a large spoon or mash paddle. Add grain gradually over 2-3 minutes while stirring constantly - this prevents dough balls (clumps of dry grain that don\'t hydrate properly and reduce efficiency). Stir thoroughly for 2-3 minutes after all grain is added, ensuring no dry pockets remain and the mixture is uniform. The grain-water mixture should resemble thick oatmeal with no dry spots. Break up any clumps you see.',
          'Check and adjust mash temperature: Immediately after dough-in, check your mash temperature by stirring gently and inserting your thermometer into the grain bed (not touching the bottom). Target temperatures: 148-152°F produces a highly fermentable, dry, crisp beer with light body (more beta-amylase activity). 152-156°F produces a balanced beer with moderate body (mixed enzyme activity). 156-158°F produces a full-bodied, sweet beer with less fermentability (more alpha-amylase activity, denatures beta-amylase). If you\'re within 2-3°F of target, you\'re fine. If too cold, add small amounts of boiling water while stirring (add slowly - it\'s easier to warm than cool). If too hot, add small amounts of cold water or let it sit with the lid open.',
          'Cover and maintain temperature for 60 minutes: Close the mash tun lid and insulate it to maintain temperature. Wrap with sleeping bags, blankets, or use a cooler-style mash tun (which insulates naturally). Set timer for 60 minutes - this is sufficient time for complete starch conversion in well-modified modern malts. Check temperature every 20 minutes by gently stirring and measuring. Temperature dropping 3-5°F over 60 minutes is normal and acceptable. If temperature drops more than 5°F, add insulation or consider direct-fire mashing for next batch (some systems allow applying gentle heat during the mash). The mash is working as long as temperature stays above 145°F - below that, enzyme activity slows significantly.',
          'Optional - perform iodine test for conversion: Near the end of your mash (around 50-60 minutes), you can test whether starch conversion is complete using an iodine test. Draw a small sample of wort into a white bowl or plate. Add 1-2 drops of iodine (tincture of iodine from pharmacy). If the sample turns blue-black, starch is still present (not fully converted) - continue mashing. If the sample stays amber/brown with no color change, conversion is complete. Most modern malts convert completely in 45-60 minutes, so this test is optional unless you\'re troubleshooting low efficiency. Never add iodine-contaminated samples back to your mash - discard them.',
          'Mash out - raise temperature to 170°F (optional but recommended): Mash out is the process of raising mash temperature to 170°F for 10 minutes before lautering. This stops enzyme activity (preventing further conversion), denatures enzymes so they don\'t make the wort hazy, and makes the wort more fluid and easier to lauter. Methods: add boiling water while stirring (easiest for most homebrewers - calculate the amount using online mash out calculators), or apply direct heat if your system allows (stir constantly to prevent scorching). Bring temperature to 168-170°F and hold for 10 minutes. Mash out isn\'t strictly necessary but improves clarity and lautering efficiency. If you can\'t mash out, just proceed to lautering - your beer will still be fine.',
          'Prepare for lautering and begin vorlauf: After mash out (or after the 60-minute mash if skipping mash out), prepare to transition to lautering. Heat your sparge water to 170°F while the mash finishes. Let the mash settle for 5 minutes undisturbed - this allows the grain bed to compact naturally. Begin vorlauf (recirculation): slowly drain 1-2 quarts of wort from the bottom of the mash tun into a pitcher, then gently pour it back over the top of the grain bed. Repeat this 5-10 times until the wort runs relatively clear (translucent, not cloudy, with no grain particles). Vorlauf sets the grain bed as a filter and prevents a stuck sparge later. Now you\'re ready to begin lautering and sparging.',
          'Troubleshooting common single infusion issues: Missed target temperature by 5°F+ = adjust immediately with hot or cold water additions while stirring. Temperature dropped 10°F+ during mash = add more insulation next time, or use a cooler-style mash tun instead of a kettle. Low efficiency (gravity below target) = check grain crush (too coarse?), stir more during dough-in, extend mash time to 75-90 minutes, or adjust water chemistry (low mash pH reduces efficiency). Stuck sparge during lautering = grain was crushed too fine, didn\'t vorlauf properly, or grain bed compacted - add rice hulls to grain bill next time (5-10% by weight) to improve flow.'
        ],
        tips: [
          'Lower mash temperatures (148-152°F) favor beta-amylase enzyme, which produces more fermentable sugars, resulting in drier, crisper, more attenuated beer with lighter body - ideal for IPAs, Pilsners, and dry styles.',
          'Higher mash temperatures (154-158°F) favor alpha-amylase enzyme, which produces more complex, less-fermentable sugars, resulting in sweeter, fuller-bodied beer with lower attenuation - ideal for Stouts, Browns, and malt-forward styles.',
          'Insulate your mash tun aggressively - temperature stability is more important than hitting an exact target. A mash held at steady 154°F will produce more consistent results than one that swings from 152°F to 158°F.',
          'Stir gently but thoroughly during dough-in to eliminate dough balls. Dough balls are pockets of dry grain that don\'t convert, reducing efficiency and potentially causing stuck sparges.',
          'Use a reliable thermometer and check it periodically in ice water (should read 32°F) and boiling water (212°F at sea level). A bad thermometer ruins batches by giving false temperature readings.',
          'The 60-minute mash time is a guideline, not a law. Modern malts often convert completely in 45 minutes. High-adjunct mashes (lots of wheat, oats, or unmalted grains) may need 75-90 minutes.',
          'Thinner mashes (1.5 qt/lb) are more forgiving for beginners, easier to stir, and flow better during lautering. Thicker mashes (1.25 qt/lb) save sparge water volume and slightly favor drier beer.',
          'Mash pH matters - target 5.2-5.6 (measured at room temperature). If your beer consistently tastes harsh or astringent, check mash pH and adjust water chemistry. Most issues are "too high pH" from alkaline water.',
          'Don\'t stress over perfection - homebrewing is forgiving. A mash temperature off by 3-5°F or a mash time of 55 or 65 minutes instead of exactly 60 won\'t ruin your beer.',
          'Keep detailed notes on your mash temperatures, times, and resulting beer character. Over time you\'ll learn how your specific system behaves and can fine-tune temperatures for desired body and attenuation.'
        ]
      }
    },
    {
      title: 'Step Mashing Guide',
      difficulty: 'Advanced',
      time: '2-3 hours',
      content: {
        overview: 'Step mashing involves multiple temperature rests during the mash, each targeting specific enzymatic processes to achieve precise control over beer character. While modern well-modified malts make step mashing unnecessary for most beers, it\'s valuable for traditional European styles (especially German lagers), high-adjunct beers (wheat beers, beers with oats/rye), and when using under-modified malts. Step mashing allows you to break down proteins for better head retention and clarity, create complex fermentability profiles with both highly fermentable and less fermentable sugars, and achieve characteristics difficult with single-infusion mashing. The technique requires more time, attention, and equipment (direct-heat mash tun or precise infusion calculations) but produces distinctive results. Common step mash schedules include the traditional German hochkurz (short mash with protein rest), and multi-rest schedules for Pilsners and Hefeweizens. This guide covers the theory, practical execution, and when step mashing is worth the extra effort.',
        steps: [
          'Acid rest (optional, 95-113°F, 15-20 minutes): This rest targets phytase enzyme which naturally lowers mash pH by releasing phosphates from the malt. Historically important for lagers brewed with very soft water, it\'s largely unnecessary with modern water treatment. If using RO water with no mineral additions for a pale lager, an acid rest can help achieve proper mash pH naturally. However, most brewers skip this rest and adjust pH with lactic acid or acid malt instead - it\'s faster and more predictable. If including an acid rest, start with strike water around 100-105°F, add grain, and hold at 95-113°F for 15-20 minutes before raising temperature.',
          'Protein rest (122-131°F, 15-30 minutes): This rest targets protease and peptidase enzymes which break down large proteins into smaller peptides and amino acids. Benefits include: improved head retention (proteins form foam), better clarity (large proteins removed), and essential for under-modified malts or high-adjunct beers (wheat, oats, rye contain lots of protein). Modern malts are well-modified and don\'t need protein rests - in fact, excessive protein rest can harm head retention by breaking down too many foam-positive proteins. Use protein rest for: Hefeweizens (improves clarity and mouthfeel), beers with 20%+ wheat/oats/rye, or under-modified Pilsner malts. Skip it for: standard ales with well-modified malt. Target 122-131°F for 15-20 minutes (longer can be detrimental). Raise temperature after protein rest to saccharification temperature.',
          'Beta-amylase rest (140-150°F, 20-40 minutes): This optional rest favors beta-amylase enzyme, which produces highly fermentable maltose sugars, resulting in drier, more attenuated beer. Use this rest when you want maximum dryness and high attenuation - for example, Brut IPAs, very dry Pilsners, or Belgian styles with low finishing gravity. Hold at 145-150°F for 20-40 minutes. The wort at this temperature will be very thin and sweet-tasting. This rest is uncommon in standard step mashes but can be useful for specific goals. Most step mashes skip directly from protein rest to alpha-amylase-dominant temperatures (154°F+).',
          'Alpha-amylase rest / main saccharification (148-158°F, 30-60 minutes): This is the primary conversion rest where both alpha and beta-amylase convert starches to sugars. The exact temperature determines enzyme balance: 148-152°F favors beta-amylase (more fermentable sugars, drier beer), 152-156°F is balanced, 156-158°F favors alpha-amylase (more dextrins, fuller body). For step mashing, you might use multiple saccharification rests to create complexity. Example: Rest at 148°F for 20 minutes (dry, fermentable sugars) + Rest at 156°F for 30 minutes (body and dextrins) = complex fermentability profile with both dryness and body. This is the heart of the step mash schedule. Total saccharification time should be 45-75 minutes across all rests to ensure complete conversion.',
          'Mash out (168-172°F, 10 minutes): Just like single infusion mashing, finish with mash out to stop enzyme activity, denature enzymes for clarity, and make wort more fluid for easier lautering. Raise temperature to 168-170°F and hold for 10 minutes. For step mashing, this is especially important because you\'ve spent so much time at lower temperatures with active enzymes - you want to definitively stop conversion before lautering. Mash out also helps if you had extended rests below 150°F, ensuring you don\'t extract too many highly fermentable sugars during the long lauter.',
          'Methods for raising temperature between rests: Direct heat method (easiest): if your mash tun allows it, apply gentle heat while stirring constantly to prevent hot spots and scorching. Electric mash tuns or kettles on low burners work well. Stir continuously and monitor temperature closely - raise 5-10°F at a time, checking frequently. Infusion method (traditional): add calculated amounts of boiling water to raise temperature. Use infusion calculators to determine how much boiling water to add for each temperature step. This method is more authentic but dilutes your mash and requires careful calculations. Decoction method (advanced/traditional): remove a portion of thick mash (grain and water), boil it separately, then return it to the main mash to raise temperature. This is traditional for German styles and adds unique malt character but is very labor-intensive.',
          'Example step mash schedule for German Pilsner: Strike at 122°F for protein rest. Protein rest: 122°F for 20 minutes (improves head retention, breaks down wheat/proteins). Raise to 148°F: add boiling water or direct heat. Beta rest: 148°F for 30 minutes (creates dry, fermentable wort). Raise to 158°F: add boiling water or direct heat. Alpha rest: 158°F for 40 minutes (adds body and malt character). Raise to 170°F for mash out: 10 minutes. This schedule creates a complex malt profile with dryness and body, characteristic of traditional Pilsners. Total time: ~2 hours including temperature raises.',
          'Example step mash schedule for American Hefeweizen: Strike at 122°F for protein rest. Protein rest: 122-131°F for 15 minutes (handles high wheat protein content). Raise to 152°F. Saccharification rest: 152°F for 60 minutes (balanced fermentability). Raise to 168°F for mash out: 10 minutes. This simplified schedule handles the protein from wheat while maintaining a straightforward saccharification. Total time: ~1.5 hours.',
          'When to use step mashing vs. single infusion: Use step mashing for: traditional German lagers (Pilsner, Helles, Marzen), Hefeweizens and wheat beers with 40%+ wheat, high-adjunct beers (oats, rye), under-modified malts, or when you want very specific fermentability profiles. Use single infusion for: American ales (IPA, Pale Ale), British ales (bitters, stouts), simple lagers with well-modified malt, or any beer where time is limited. For 90% of homebrewing, single infusion is simpler, faster, and produces equivalent or better results. Step mashing is about authenticity, tradition, and niche applications.',
          'Monitor and troubleshoot during step mashing: Track temperatures carefully - use a reliable digital thermometer and check every 5-10 minutes during rests. If temperature drops during a rest, gently apply heat or add small amounts of boiling water. Stir gently between temperature checks to ensure even heat distribution. Perform iodine test before mash out to ensure complete conversion - if starch remains, extend the final saccharification rest. Document your temperature raise method and times - this helps you refine the process and improve consistency on future batches.'
        ],
        tips: [
          'Protein rest (122-131°F for 15-20 minutes) improves head retention and clarity, especially important for wheat beers, under-modified malts, or high-adjunct beers. Skip it for modern pale ales and IPAs - it can harm head retention by over-degrading proteins.',
          'Multiple saccharification rests (e.g., 20 min at 148°F + 40 min at 156°F) create complex fermentability profiles with both dry and full-bodied characteristics - this is the main advantage of step mashing over single infusion.',
          'Use step mashing for high-adjunct beers (wheat, oats, rye) - the protein rest handles the extra protein load and improves clarity and mouthfeel. Single infusion often produces hazy, protein-heavy beers with these adjuncts.',
          'Step mashing is NOT necessary for well-modified modern malts - most American 2-Row, Maris Otter, and even Pilsner malts are so well-modified that protein rests provide minimal benefit and can be detrimental.',
          'Direct-heat mashing requires constant stirring to prevent scorching - never leave the mash tun unattended while applying heat. Use very low heat and raise temperature slowly (5°F every few minutes).',
          'Infusion calculations are complex - use online calculators rather than doing the math by hand. You need to account for grain temp, current mash temp, target temp, and water volume. Get it wrong and you overshoot or undershoot your target.',
          'Step mashing adds 1-2 hours to brew day compared to single infusion - make sure the benefits justify the time. For authenticity and traditional lagers, absolutely. For a quick pale ale? Not worth it.',
          'Decoction mashing (boiling portions of mash) is traditional for German styles and adds unique melanoidin malt character, but it\'s extremely labor-intensive. Try it once for the experience, then decide if the character difference is worth the effort.',
          'Keep detailed notes on your step mash schedule, actual temperatures achieved, time at each rest, and resulting beer character. This helps you refine schedules and understand which rests contribute most to your specific goals.',
          'If you\'re new to all-grain brewing, master single infusion mashing first before attempting step mashing. Understanding the fundamentals makes step mashing easier and more effective.'
        ]
      }
    },
    {
      title: 'Mash Water Planning',
      difficulty: 'Intermediate',
      time: '30 minutes',
      content: {
        overview: 'Accurate water volume calculations are essential for hitting target pre-boil and post-boil volumes, achieving desired Original Gravity, and ensuring consistent results batch after batch. Water planning involves calculating how much strike water to use for mashing, how much sparge water to rinse sugars from grain, and accounting for losses throughout the process (grain absorption, evaporation, dead space, and trub). While brewing software handles these calculations automatically, understanding the principles helps you troubleshoot issues, optimize your system, and improve consistency. Every brewing system has unique losses and characteristics - documenting your actual volumes and losses allows you to dial in precise calculations for your specific equipment. This guide covers the fundamental calculations, system-specific adjustments, and how to refine your water planning over multiple batches.',
        steps: [
          'Calculate strike water volume (mash water): Strike water is the initial water volume mixed with grain to begin the mash. Standard ratio: 1.25-1.5 quarts of water per pound of grain. Thicker mash (1.25 qt/lb) = more concentrated, favors beta-amylase (drier beer), requires more sparge water. Thinner mash (1.5 qt/lb) = more dilute, favors alpha-amylase (fuller beer), easier lautering, requires less sparge water. Example: For 12 lbs of grain at 1.5 qt/lb ratio: 12 lbs × 1.5 qt/lb = 18 quarts = 4.5 gallons strike water. For 10 lbs at 1.25 qt/lb: 10 × 1.25 = 12.5 quarts = 3.1 gallons. Choose your ratio based on style and system - 1.5 qt/lb is a good starting point for beginners.',
          'Calculate grain absorption loss: Grain absorbs water during mashing and retains it after lautering, reducing your collectible wort volume. Rule of thumb: 0.1-0.125 gallons absorbed per pound of grain (varies with grain crush and moisture content). Example: 12 lbs grain × 0.1 gal/lb = 1.2 gallons lost to grain absorption. This water stays with the spent grain and doesn\'t contribute to your wort volume. Measure this on your system by collecting and measuring spent grain, then dumping it to see how wet it is - over time you\'ll learn your specific absorption rate.',
          'Calculate target pre-boil volume: This is how much wort you need to collect before boiling to end up with your target batch size after boil. Pre-boil volume = Post-boil volume + Evaporation loss + Cooling shrinkage. Post-boil volume = Final batch size (5 gallons for typical homebrew). Evaporation loss depends on boil time and vigor: typical is 1-1.5 gallons per hour for vigorous boil. For 60-minute boil: 1-1.25 gallons loss. For 90-minute boil: 1.5-2 gallons loss. Cooling shrinkage: ~4% volume loss (wort contracts as it cools from 212°F to pitching temp). For 5-gallon batch with 60-min boil: 5 gal + 1.25 gal evaporation + 0.25 gal shrinkage = 6.5 gallons pre-boil target.',
          'Calculate sparge water volume: Sparge water is the hot water you rinse through the grain bed to extract remaining sugars and reach your pre-boil volume. Formula: Sparge water = Pre-boil volume + Grain absorption + Kettle dead space - Strike water. Example: Target 6.5 gal pre-boil, using 4.5 gal strike water, 12 lbs grain (1.2 gal absorption), 0.5 gal kettle dead space: Sparge = 6.5 + 1.2 + 0.5 - 4.5 = 3.7 gallons sparge water. Heat this water separately to 170°F before you begin lautering. Always prepare 10-20% extra sparge water in case you need it.',
          'Account for dead space and trub losses: Dead space is wort that remains in your system and can\'t be collected. Sources include: Kettle dead space (wort below the pickup tube or valve, typically 0.25-0.75 gallons), Mash tun dead space (wort under the false bottom, typically 0.25-0.5 gallons), Trub and hop material (hops, proteins, and break material left in kettle, typically 0.25-0.75 gallons depending on hop additions). Measure your system-specific losses by collecting into a graduated vessel and noting actual vs. expected volumes. Add these losses to your pre-boil volume calculation to ensure you collect enough wort.',
          'Factor in boil-off rate and determine it for your system: Boil-off rate varies dramatically based on kettle size, shape, heat source, and boil vigor. Measure yours: Heat 5 gallons water to boiling. Boil vigorously for exactly 60 minutes. Measure remaining volume. The difference is your hourly boil-off rate. Example: Started with 5 gal, ended with 3.75 gal = 1.25 gal/hour boil-off. Document this and use it for all future calculations. Electric systems often have lower boil-off (0.75-1 gal/hr). Propane systems with wide kettles can have high boil-off (1.5-2 gal/hr). Adjust your pre-boil volume based on your actual boil time (60 vs. 90 minutes).',
          'Use brewing software to integrate all calculations: Manual calculation is valuable for understanding, but brewing software (BeerSmith, Brewfather, Bru\'n Water) makes planning much easier. Enter your system parameters once: grain absorption rate (0.1 gal/lb), boil-off rate (1.25 gal/hr), mash tun dead space (0.5 gal), kettle dead space (0.5 gal), trub loss (0.5 gal), etc. The software then calculates strike water, sparge water, and expected volumes automatically for every recipe. Over time, refine these parameters based on actual measurements to improve accuracy.',
          'Measure and document actual volumes for each batch: Calibrate your system by measuring actual volumes at each stage: Volume of strike water heated. Volume collected pre-boil (after lautering). Volume post-boil (into fermenter). Volume packaged (bottles or keg). Compare to software predictions and note variances. Over 3-5 batches, patterns emerge - maybe you consistently collect 0.5 gal more than predicted, or lose 0.25 gal more to trub. Adjust your system parameters in brewing software to match reality. This iterative refinement produces highly accurate predictions.',
          'Adjust calculations for high-gravity or parti-gyle brewing: High-gravity beers (OG >1.070) require more grain in the same mash tun volume, which can limit your strike water volume and require more sparge water. Parti-gyle brewing (collecting multiple runnings for different beers) requires careful planning of first vs. second runnings volumes. Big beers may require thicker mashes (1.0-1.25 qt/lb) and extended sparging or even multiple sparges. Plan water volumes carefully and be prepared to adjust on the fly - you may need to add water mid-sparge if you\'re not hitting pre-boil volume targets.',
          'Troubleshoot common water volume issues: Collected too little wort pre-boil = used too little sparge water, or grain absorbed more than expected, or mash tun losses higher than estimated - next time increase sparge volume by the shortage amount. Collected too much wort pre-boil = used too much sparge water, or boil-off rate is higher than you thought - boil longer to reach target volume, or reduce sparge volume next time. Wort gravity too low = collected too much water relative to grain - reduce total water or increase grain bill. Wort gravity too high = collected too little water - add water to hit target gravity. Always prioritize hitting volume targets over gravity targets - you can add water to dilute, but you can\'t add gravity.'
        ],
        tips: [
          'Start with 1.25-1.5 qt/lb water-to-grain ratio for mashing. 1.5 qt/lb is easier for beginners (thinner mash, easier to manage). 1.25 qt/lb is more traditional and slightly favors drier beers (thicker mash).',
          'Thicker mashes (1.0-1.25 qt/lb) favor beta-amylase enzyme activity, producing more fermentable sugars and drier beer. They also improve efficiency slightly but can be harder to stir and more prone to stuck sparges.',
          'Thinner mashes (1.5-2.0 qt/lb) favor alpha-amylase enzyme activity, producing more dextrins and fuller-bodied beer. They\'re easier to manage, stir, and lauter, making them better for beginners.',
          'Measure everything during your first 5-10 batches - strike water, pre-boil volume, post-boil volume, boil-off rate. These measurements let you dial in your system and produce highly accurate predictions.',
          'Grain absorption is the biggest variable - it depends on grain moisture content, crush, and how hard you squeeze the grain bag or compact the mash. Measure it on your system and use your actual number, not generic estimates.',
          'Evaporation rate depends on boil vigor, kettle geometry, and heat source. Wide shallow kettles evaporate faster than tall narrow ones. Vigorous boils evaporate faster than gentle boils. Measure your specific rate.',
          'Always heat 10-20% extra sparge water beyond your calculation. It\'s better to have excess than to run short mid-sparge. Leftover sparge water is just hot water - you can use it for cleanup.',
          'If you consistently miss volumes by the same amount (e.g., always 0.5 gal short), adjust your software parameters rather than manually correcting each batch. This builds system knowledge into your process.',
          'Use a sight glass or volume markings on your kettle to measure volumes accurately. Graduations marked in gallons or liters eliminate guesswork and improve consistency.',
          'Don\'t stress over 0.25-0.5 gallon variances - homebrewing has inherent variability. As long as you\'re within 10% of target volumes and can hit your gravity targets, your system is working fine.'
        ]
      }
    },
    {
      title: 'Water Chemistry Advanced',
      difficulty: 'Advanced',
      time: '1-2 hours',
      content: {
        overview: 'Advanced water chemistry goes beyond basic mineral additions to achieve precise pH control, style-specific water profiles, and professional-level water treatment. This includes understanding residual alkalinity, mash pH dynamics, the interplay between grain bill and water alkalinity, and how to build water profiles from RO water that exactly match famous brewing regions (Burton-on-Trent for IPAs, Pilsen for lagers, Dublin for stouts). While basic water chemistry improves your beer, advanced techniques allow you to nail specific style characteristics, troubleshoot persistent off-flavors related to water, and achieve consistency across batches. This level of control is especially important for delicate styles (Pilsners, IPAs) where water plays a starring role. The tools required include a calibrated pH meter, quality brewing salts, acids (lactic or phosphoric), and water chemistry software for calculations. Mastering advanced water chemistry is often cited as the final step that takes homebrewers from advanced to expert level.',
        steps: [
          'Start with complete water analysis (all ions): Obtain a full water report showing calcium, magnesium, sodium, sulfate, chloride, bicarbonate, pH, and alkalinity. Municipal reports often provide this; for wells or precise measurements, use Ward Labs. Understand each ion\'s role: Calcium (50-150 ppm) aids enzyme activity, yeast health, protein coagulation. Magnesium (10-30 ppm) supports yeast, but excess creates astringency. Sodium (<150 ppm) enhances malt at low levels, tastes salty above 150 ppm. Sulfate (varies by style) enhances hop bitterness and dry finish. Chloride (varies by style) enhances malt sweetness and fullness. Bicarbonate creates alkalinity - use to calculate residual alkalinity.',
          'Calculate and understand residual alkalinity (RA): RA is the alkalinity remaining after calcium and magnesium react with malt acidity. Formula: RA = Alkalinity (as CaCO3) - [(Ca/1.4) + (Mg/1.7)]. This number determines how well your water can handle the acidity of your grain bill. Pale beers need low/negative RA (-50 to 0) because pale malts are not very acidic. Dark beers need moderate/high RA (50-150+) because dark roasted malts are very acidic and need alkalinity to buffer them to proper pH. If your RA doesn\'t match your style, adjust with acid (to lower RA) or alkaline salts like baking soda (to raise RA). Use Bru\'n Water\'s RA calculator for precision.',
          'Measure and adjust mash pH to optimal range (5.2-5.6): Mash pH affects enzyme activity, extraction efficiency, tannin extraction, and finished beer flavor. Target: 5.2-5.4 for pale beers, 5.4-5.6 for dark beers (measured at room temperature, not mash temperature). Measure pH 10-15 minutes into the mash after grain and water are mixed. Too high (>5.6)? Add lactic acid or phosphoric acid in small increments (1-2 mL at a time for 5-gallon batch), stir, re-measure. Too low (<5.2)? Add calcium carbonate or baking soda in small amounts (very rare with pale malts and alkaline water). Document additions and resulting pH to refine calculations for future batches. Most pH issues are "too high" from alkaline water.',
          'Build style-specific mineral profiles from RO water: Starting with RO (reverse osmosis) water gives you complete control. Research classic water profiles: Burton-on-Trent (pale ales, IPAs): high calcium (250+ ppm), very high sulfate (400-800 ppm), moderate chloride (50-100 ppm) - creates dry, hoppy character. Pilsen (Czech Pilsner): very soft, low minerals across the board (25-50 ppm calcium, 5-10 ppm sulfate/chloride) - showcases delicate malt and hops. Munich (Oktoberfest, Bocks): moderate calcium (75-100 ppm), low sulfate (10-20 ppm), moderate chloride (50-100 ppm), moderate bicarbonate (150-250 ppm) - enhances malt character. Dublin (Stouts): moderate calcium (100-150 ppm), low sulfate (50 ppm), moderate chloride (50-100 ppm), high bicarbonate (150-300 ppm) - handles dark malt acidity.',
          'Add brewing salts to match target profile: Using water chemistry software, calculate salt additions to reach your target. Common salts: Gypsum (CaSO4) - adds calcium and sulfate. Calcium chloride (CaCl2) - adds calcium and chloride. Epsom salt (MgSO4) - adds magnesium and sulfate (use sparingly). Baking soda (NaHCO3) - adds sodium and bicarbonate (raises alkalinity). Table salt (NaCl) - adds sodium and chloride (use rarely). Chalk (CaCO3) - adds calcium and carbonate (raises alkalinity, poorly soluble). Add salts to strike water, stir to dissolve. For example, to build Burton water from RO for a 5-gallon IPA: 2 tsp gypsum, 1/2 tsp calcium chloride, pinch of Epsom salt. Always measure salts by weight (grams) rather than volume for precision.',
          'Use acid additions for pale beers with alkaline water: If brewing pale beers (Pilsners, IPAs) with alkaline tap water (bicarbonate >100 ppm), you\'ll need acid additions to hit proper mash pH. Options: Lactic acid (88% solution): 1 mL lowers pH of 5 gallons by approximately 0.1 pH units (varies with alkalinity) - add directly to mash or strike water. Phosphoric acid (10% solution): similar to lactic but more neutral flavor. Acidulated malt: German malt acidified with lactic acid, use 1-5% of grain bill to naturally lower pH. Use water chemistry software to calculate exact acid needs based on your water alkalinity and grain bill. Start with calculated amount minus 20%, then measure and add more if needed.',
          'Test finished beer flavor and iterate: Brew the same recipe multiple times with different water profiles to understand the impact. Try an IPA with high sulfate (3:1 sulfate:chloride ratio) vs. balanced (1:1 ratio) vs. chloride-forward (1:2 ratio) - taste side by side. Notice how high sulfate creates dry, crisp, accentuated bitterness while high chloride creates smooth, round, full malt character. Keep detailed notes on water additions, mash pH, and tasting notes. Over time you\'ll develop intuition for which profiles work best for your palate and system.',
          'Troubleshoot water-related off-flavors: Astringent, harsh, grainy flavors = mash pH too high (>5.8), usually from alkaline water with pale grain bills - add acid. Metallic flavors = excess iron or copper in water, old pipes, or unlined kettles. Medicinal/plastic/band-aid flavors = chlorine or chloramine in water - use carbon filter or Campden tablets. Salty flavors = excess sodium (>150 ppm) - reduce sodium additions. Mineral/chalky flavors = excess calcium or sulfate - reduce gypsum. Most water issues manifest as harsh or astringent character rather than specific flavors.',
          'Advanced technique - water blending for partial control: If you can\'t use RO water or want to work with your tap water, blend tap with distilled/RO to dilute minerals and alkalinity. Example: tap water has 200 ppm bicarbonate (too high for pale ale). Blend 50% tap + 50% RO = 100 ppm bicarbonate (more manageable). Add brewing salts to the blend to achieve target profile. This costs less than 100% RO but gives you significant control. Calculate blends using water chemistry software.',
          'Verify with pH meter and calibrate regularly: Invest in a quality pH meter ($50-150) rather than relying on pH strips (inaccurate). Calibrate before each use with pH 4.0 and 7.0 calibration solutions. Measure mash pH at room temperature (hot liquid affects readings) - draw a sample, cool to room temp, measure. Store electrode in storage solution, not water. Replace electrode annually or when it won\'t calibrate properly. A properly maintained pH meter is your most important water chemistry tool.'
        ],
        tips: [
          'Pale beers need low alkalinity and low residual alkalinity (-50 to 0 RA) - high alkalinity with pale malts produces harsh, astringent beer due to mash pH creeping above 5.6. Add acid or use RO water.',
          'Dark beers can handle high alkalinity (150-250+ ppm bicarbonate) because dark roasted malts are acidic and need buffering to avoid excessively low mash pH (<5.0) which creates sour, acidic flavors.',
          'Calcium is the single most important mineral - ensure 50-150 ppm in all beers. It aids mash enzyme activity, yeast flocculation, protein coagulation, and beer clarity. Add calcium via gypsum or calcium chloride.',
          'Target sulfate:chloride ratios to shape hop/malt balance: 3:1 or higher for very hoppy beers, 1:1 for balanced, 1:3 or lower for very malty beers. This ratio matters more than absolute concentrations.',
          'Use Bru\'n Water spreadsheet (free) or other water chemistry software - don\'t try to calculate salt additions manually. The chemistry is complex and software handles it reliably.',
          'Lactic acid is preferred over phosphoric for most homebrewers - it\'s easier to find, has softer flavor impact, and is traditional in German brewing. Start with small additions (1-2 mL) and measure pH before adding more.',
          'Measure mash pH at room temperature, not mash temperature - pH electrodes are calibrated for room temp and hot liquid gives false readings. Cool a sample to 68-72°F before measuring.',
          'If your tap water is heavily mineralized (TDS >250 ppm) or has high chlorine/chloramine, seriously consider brewing with RO water - it\'s easier to build from scratch than fix problem water.',
          'Water chemistry improvements are subtle on individual batches but dramatic when comparing beers months apart. Trust the science and keep refining - the results accumulate.',
          'Join online brewing communities (HomeBrewTalk, Reddit r/Homebrewing) to learn regional water chemistry tips and get feedback on your water profiles - experienced brewers can spot issues quickly.'
        ]
      }
    },
    {
      title: 'Hop Schedule Design',
      difficulty: 'Intermediate',
      time: '45 minutes',
      content: {
        overview: 'Designing an effective hop schedule is a creative and technical process that defines your beer\'s bitterness level, flavor complexity, and aroma intensity. A well-designed hop schedule balances bittering additions (for clean bitterness to balance malt), flavor additions (for mid-palate hop character), aroma additions (for nose and finish), and dry hopping (for intense aromatics). The timing and quantity of each addition determines what the hop contributes - early additions isomerize alpha acids into bitterness while volatile aromatics boil off, while late additions and dry hops preserve delicate oils and aromas. Different styles demand different approaches: a West Coast IPA might front-load bitterness and dry hop heavily, while an English bitter uses modest, traditional hop additions throughout the boil. This guide covers determining appropriate IBU targets for your style, distributing hop additions across the timeline, calculating quantities, choosing varieties for each role, and advanced techniques like hop bursting and whirlpool additions.',
        steps: [
          'Determine target IBU range for your style: IBUs (International Bitterness Units) measure hop bitterness in finished beer. Research typical ranges: Light lagers (10-20 IBU), Wheat beers (15-25 IBU), Blonde ales (15-30 IBU), Pale ales (30-50 IBU), IPAs (40-70 IBU), Double IPAs (60-100+ IBU), Stouts (30-60 IBU). These are guidelines - modern craft versions often push boundaries. Consider also the BU:GU ratio (IBU divided by Original Gravity minus 1.000): 0.3-0.5 = malty and sweet, 0.5-0.7 = balanced, 0.7-1.0 = hoppy and bitter, 1.0+ = very hoppy (Double IPAs, West Coast IPAs). For example, a 1.060 IPA at 60 IBU has BU:GU of 60/60 = 1.0, firmly in hoppy territory.',
          'Plan your bittering addition (early boil, 60-90 minutes): Bittering hops are added at the beginning of the boil to maximize isomerization of alpha acids into bitterness. Use high-alpha hops (10-15%+) for efficiency and cost: Magnum, Warrior, Columbus, Nugget. Calculate the amount needed to achieve 60-70% of your target IBUs - you\'ll get the rest from later additions. Example: Target 50 IBU total, aim for 30-35 IBU from bittering addition. Use brewing software to calculate weight needed based on hop alpha acid percentage and boil time. For clean, neutral bitterness, use noble or mild hops like Magnum. For assertive, resinous bitterness, use Columbus or Chinook.',
          'Add flavor hops at mid-boil (15-30 minutes remaining): Flavor additions strike a balance - some alpha acids isomerize into bitterness, but aromatic compounds partially survive the boil. This creates the "flavor" layer of hop character: less volatile than aroma, more persistent than pure bitterness. Typical timing: 20 minutes for moderate flavor + some bitterness, 15 minutes for strong flavor + light bitterness. Use dual-purpose or aroma hops that complement your style: Cascade, Centennial, Chinook for American character, or East Kent Goldings, Fuggle for English ales. Add 0.5-1.5 oz per 5 gallons depending on desired intensity. This addition is optional in modern hoppy beers that focus on late additions.',
          'Add aroma hops late in boil (5-10 minutes, flameout, whirlpool): Late additions preserve delicate hop aromatics - oils like myrcene, linalool, and geraniol that create citrus, floral, fruity, and piney aromas. Timing options: 5-10 minutes = minimal bitterness, good aroma retention. Flameout/0 minutes = add hops when heat is turned off, steep while cooling. Whirlpool at 170-180°F = lower temp preserves even more aromatics, creates "hop flavor" without bitterness. Use aromatic hop varieties: Citra (tropical, mango), Mosaic (berry, tropical), Amarillo (orange), Galaxy (passion fruit), Simcoe (pine, passion fruit). Add 1-3 oz per 5 gallons for IPAs, 0.5-1 oz for balanced ales. Longer steep times (15-30 min at flameout) extract more character.',
          'Design dry hop additions post-fermentation (3-7 days before packaging): Dry hopping adds intense hop aroma with zero bitterness - the most impactful way to create hop-forward beers. Plan dry hop rate based on style: 0.5-1 oz/gallon for hoppy pale ales, 1-2 oz/gallon for IPAs, 2-4 oz/gallon for Double IPAs and hazy IPAs. Choose aromatic varieties: use 1-3 different hops for complexity (e.g., Citra + Mosaic + Amarillo). Add hops when fermentation is complete (or near complete for biotransformation benefits). Contact time: 3-5 days is optimal - longer doesn\'t add more aroma and can create grassy, vegetal character. Consider hop schedule: single dry hop during cold crash, or double dry hop (one addition mid-fermentation, one post-fermentation).',
          'Balance bittering vs. late/dry hop contributions: Modern hop schedules often minimize bittering hops and maximize late/dry additions for softer bitterness and intense aroma. Example traditional IPA (50 IBU total): 1 oz Magnum at 60 min (35 IBU), 0.5 oz Cascade at 20 min (8 IBU), 1 oz Cascade at 5 min (5 IBU), 1 oz Cascade dry hop (0 IBU). Example modern IPA (50 IBU total): 0.5 oz Magnum at 60 min (25 IBU), 2 oz mixed hops at flameout/whirlpool (20 IBU), 4 oz mixed hops dry hop (0 IBU). The modern schedule produces softer, rounder bitterness with massive aroma.',
          'Use brewing software to calculate and track additions: Use BeerSmith, Brewfather, or free calculators to input hop varieties, alpha acid percentages, weights, and timing. Software calculates IBU contributions and total beer IBUs. Advantages: accounts for hop utilization (decreases with wort gravity and shorter boil times), adjusts for alpha acid variations (each crop year differs), and prevents over/under-hopping. Always use actual alpha acid percentage from your hop package, not generic values. Print hop schedule with quantities and timings to reference during brew day.',
          'Consider advanced techniques: Hop bursting - skip bittering hops entirely, use all hop additions at 20 minutes and later for huge flavor/aroma with moderate bitterness. Achieves "juicy" IPA character. First wort hopping - add hops to kettle during lautering before boil begins, claimed to create smoother bitterness (debated). Mash hopping - add hops to mash, claimed to increase hop flavor complexity (experimental). Double or triple dry hopping - multiple dry hop additions at different stages for layered aroma. Each technique produces unique results - experiment to learn preferences.',
          'Match hop varieties to style traditions: American ales: Cascade, Centennial, Chinook, Simcoe, Citra, Mosaic. English ales: East Kent Goldings, Fuggle, Challenger. German lagers: Hallertau, Tettnanger, Saaz, Magnum. Belgian ales: Saaz, East Kent Goldings, Styrian Goldings. New England IPAs: Citra, Mosaic, Galaxy, Nelson Sauvin (tropical, fruit-forward). West Coast IPAs: Simcoe, Amarillo, Columbus (pine, resin, dank). While you can break conventions, understanding traditional pairings helps create authentic interpretations.',
          'Document results and iterate: Keep detailed notes on hop varieties, amounts, timings, and resulting beer character. Note perceived bitterness (does 50 calculated IBU taste balanced or harsh?), hop flavor intensity, aroma strength, and how quickly aroma fades. Brew the same recipe with modified hop schedules: more late hops, less bittering, different dry hop rate. Compare side-by-side to understand how each change affects the beer. Over time, you\'ll develop intuition for designing schedules that produce your desired character.'
        ],
        tips: [
          'Front-load hops (60+ minute additions) for clean, firm bitterness with minimal hop flavor or aroma. This is the traditional approach for balanced beers and lets malt and yeast shine.',
          'Back-load hops (20 min and later, plus dry hop) for intense hop flavor and aroma with softer bitterness. This is the modern craft beer approach for hop-forward styles like IPAs and Pale Ales.',
          'Whirlpool/steep additions at 170-180°F (after turning off heat) add massive hop flavor and aroma with minimal bitterness - the secret weapon of modern IPAs. Steep for 15-30 minutes while cooling.',
          'Dry hop rate of 0.5-2 oz per gallon is typical - 0.5-1 oz for hoppy pale ales, 1-2 oz for IPAs, 2+ oz for hazy/juicy IPAs. More isn\'t always better - beyond 2 oz/gal often produces grassy or vegetal notes.',
          'Use high-alpha bittering hops (Magnum, Warrior, Columbus) for clean, cost-effective bittering - they provide neutral bitterness without dominating flavor. Save expensive aromatic hops for late additions.',
          'Calculate IBUs using software but trust your palate - two beers with the same IBUs can taste very different based on malt sweetness, alcohol, and hop variety. Perceived bitterness matters more than numbers.',
          'Hop freshness affects aroma dramatically - use fresh hops (harvest within the last year) for aroma and dry hop additions. Older hops are fine for bittering but produce stale, cheesy aromas in late additions.',
          'For balanced beers (English bitters, ambers, browns), distribute hops across multiple additions (60 min, 20 min, 5 min) for complexity. For hop-focused beers, concentrate hops in late additions and dry hop.',
          'Double dry hopping (one addition during active fermentation, one after fermentation) is popular for hazy IPAs - the first addition benefits from biotransformation (yeast modifies hop compounds), the second adds fresh aroma.',
          'Don\'t be afraid to experiment - hop schedule design is part science, part art. Try unconventional combinations, timings, and rates. Some of the best beers come from breaking traditional rules.'
        ]
      }
    },
    {
      title: 'Lautering & Sparging',
      difficulty: 'Intermediate',
      time: '60-90 minutes',
      content: {
        overview: 'Lautering and sparging are the processes of separating sweet wort from spent grain and rinsing residual sugars to achieve your target pre-boil volume and gravity. Lautering (German for "to purify") involves draining wort from the mash tun through the grain bed, which acts as a natural filter. Sparging (from the Latin "to sprinkle") rinses the grain bed with hot water to extract remaining sugars. Together, these processes determine your brewhouse efficiency - how much of the theoretical sugar in your grain bill you actually collect. Poor lautering technique leads to stuck sparges, low efficiency, astringent flavors from tannin extraction, or excessive time. Proper technique produces clear wort, good efficiency (70-85% typical for homebrewers), and sets you up for a successful boil. This guide covers both fly sparging (continuous sprinkle method, highest efficiency) and batch sparging (drain and refill method, faster and simpler), troubleshooting stuck sparges, and avoiding common pitfalls like channeling and over-sparging.',
        steps: [
          'Begin vorlauf (recirculation) to set the grain bed: After mashing is complete (and mash out if doing one), let the mash settle undisturbed for 5-10 minutes - this allows the grain bed to compact and settle naturally. Open your mash tun valve or begin draining slowly, collecting the first runnings into a pitcher or measuring cup (about 1-2 quarts). This first wort will be cloudy with grain particles and husk material. Gently pour it back over the top of the grain bed, distributing across the surface rather than pouring in one spot. Repeat this recirculation 5-10 times until the wort runs clear or mostly clear (it won\'t be crystal clear, but should be translucent amber with no visible grain particles). This process sets the grain bed as a filter - the grain and husk form a natural filter bed that clarifies the wort.',
          'Collect first runnings slowly (fly sparging method): If fly sparging, begin draining wort into your kettle at a slow, steady rate - target about 1 quart per minute or slower. The slower you drain, the better your efficiency and clarity. As you drain, gently sprinkle or spray 170°F sparge water over the top of the grain bed to replace the volume draining from the bottom, maintaining a constant level of liquid (about 1-2 inches) above the grain surface. Use a sparge arm that rotates and distributes water evenly, or a watering can with a diffuser to sprinkle gently - never pour a stream directly onto the grain bed as this creates channels. Continue collecting and sparging simultaneously until you reach your target pre-boil volume (typically 6-6.5 gallons for a 5-gallon batch).',
          'Batch sparging alternative (simpler, faster): For batch sparging, drain all first runnings completely from the mash tun into your kettle (takes about 10-20 minutes). Measure the volume collected. Calculate how much more wort you need to reach target pre-boil volume. Add that amount (or slightly more) of 170°F sparge water to the mash tun all at once. Stir gently to suspend grain and dissolve remaining sugars. Let settle for 5-10 minutes. Vorlauf again briefly (2-3 recirculations). Drain completely into kettle. Optional: perform a second batch sparge with remaining water if needed. Batch sparging typically achieves 5-10% lower efficiency than fly sparging but saves significant time and is less prone to stuck sparges.',
          'Maintain proper sparge water temperature (168-172°F): Sparge water should be hot (168-172°F ideal, 170°F target) for several reasons: hot water is less viscous and flows through the grain bed more easily, it keeps the grain bed temp above 160°F to maintain wort fluidity, and it helps dissolve and rinse sugars efficiently. However, don\'t use boiling water or exceed 175°F - excessive heat can extract tannins (astringent, harsh flavors) from grain husks, especially if mash pH is also high. Monitor sparge water temp throughout the process. If it cools below 165°F, your collection may slow. If it climbs above 175°F, risk of tannin extraction increases.',
          'Monitor runoff gravity and stop when appropriate: As you sparge, the gravity of the runoff gradually decreases - first runnings might be 1.060-1.080, while final runnings can drop to 1.010 or below. Monitor gravity by taking samples periodically (every 1-2 quarts). Stop collecting when: you\'ve reached your target pre-boil volume, OR the runoff gravity drops below 1.008-1.010 (diminishing returns - you\'re collecting more water than sugar), OR the runoff pH climbs above 6.0 (risk of tannin extraction). Most brewers stop based on volume target. If you stop early and gravity is higher than expected, add water to hit target gravity. If you collect too much, boil longer to evaporate excess.',
          'Avoid channeling in the grain bed: Channeling occurs when water finds paths of least resistance through the grain bed, flowing quickly through channels rather than evenly through all grain. This reduces efficiency because most grain isn\'t contacted by sparge water. Prevent channeling by: distributing sparge water evenly across the entire grain bed surface, maintaining liquid level above the grain (never let grain bed run dry), avoiding disturbing the grain bed once vorlauf is complete, using gentle, widespread water distribution (sparge arm or shower), and ensuring proper grain crush (not too fine, which compacts; not too coarse, which channels). If you notice very fast runoff or dry spots on grain surface, channeling may be occurring.',
          'Troubleshoot and fix stuck sparges: A stuck sparge is when wort flow slows to a trickle or stops completely. Causes: grain crushed too fine (flour clogs grain bed), high percentage of wheat/oats/rye without rice hulls (these have no husks and create sticky, dense mash), grain bed compacted from excessive stirring or too-fast runoff, or mash tun screen/false bottom blocked. Fixes: For prevention, add rice hulls (5-10% of grain bill by weight) to high-wheat or high-oat beers - they act as filter aid. If stuck during sparge: stop the drain, gently stir the top inch of grain to break up compaction, let settle 5 min, restart vorlauf, continue draining very slowly. Last resort: scoop grain into a large strainer or bag, squeeze/press to extract wort (accepting reduced quality).',
          'Watch for signs of tannin extraction and stop if needed: Tannin extraction produces astringent, dry, puckering sensations and grainy, harsh flavors in finished beer. It\'s caused by: sparge water too hot (>175-180°F), mash pH too high (>6.0, especially runoff pH), or over-sparging (collecting runoff below 1.008 gravity for extended time). Monitor for warning signs: runoff pH climbing above 6.0 (use pH strips), white/chalky appearance in runoff, or harsh taste in runoff samples. If pH climbs above 6.0, stop sparging immediately even if you haven\'t hit target volume - add water to kettle to reach desired volume rather than over-sparging. Tannin astringency is difficult to fix post-brew and ruins beer.',
          'Clean grain bed and measure efficiency: After collecting your target volume, turn off runoff. Note the final gravity of the wort in your kettle - this is your pre-boil gravity. Calculate brewhouse efficiency: compare actual gravity and volume to theoretical maximums from brewing software. Typical homebrewer efficiency: 65-75% (good), 75-85% (excellent), 85%+ (exceptional or commercial equipment). If efficiency is consistently low (<65%), troubleshoot: grain crush too coarse, insufficient mash time, mash temp too high/low, poor lautering technique (fast runoff, channeling), or old/poor quality grain. Remove spent grain for composting - it makes excellent compost or animal feed. Rinse mash tun immediately to prevent sticky grain residue from hardening.',
          'Fly vs. batch sparging trade-offs: Fly sparging (continuous sprinkling) achieves 5-10% higher efficiency, produces very clear wort, and is traditional method. However, it requires more equipment (sparge arm or manifold), takes longer (60-90 minutes), and is more prone to channeling and stuck sparges. Batch sparging (drain and refill) is faster (30-45 minutes), requires no special equipment, is more forgiving (less likely to stuck), and easier for beginners. However, efficiency is slightly lower and wort may be slightly less clear. Most homebrewers use batch sparging for simplicity and time savings - the efficiency difference is minor and predictable.'
        ],
        tips: [
          'Slow and steady wins the race - drain at 1 quart per minute or slower for best efficiency and clarity. Rushing the lauter reduces efficiency and can cause stuck sparges or cloudy wort.',
          'Avoid channeling in the grain bed by distributing sparge water evenly across the entire surface and maintaining liquid level above the grain. Never let the grain bed run dry or pour water in one concentrated spot.',
          'Don\'t over-sparge - stop collecting when runoff gravity drops below 1.008-1.010 or when pH exceeds 6.0. Over-sparging extracts harsh tannins and dilutes your wort without adding significant sugar.',
          'Batch sparging is faster and simpler than fly sparging, making it ideal for beginners and time-conscious brewers. The 5-10% efficiency loss is predictable and can be compensated with slightly more grain.',
          'Add rice hulls to any beer with 15%+ wheat, oats, or rye - these adjuncts lack husks and create sticky, dense mashes prone to stuck sparges. Rice hulls act as filter aid and prevent sticking.',
          'Sparge water temperature matters - target 170°F (168-172°F range). Too cool slows collection, too hot extracts tannins. Use a thermometer to verify temp before and during sparging.',
          'Vorlauf is essential - don\'t skip it. Those first cloudy runnings contain grain particles and husk material that will create off-flavors and haze. Recirculate until wort runs mostly clear.',
          'If you consistently get stuck sparges, your grain is crushed too fine. Adjust your mill gap wider or ask your homebrew shop to crush coarser. Proper crush has cracked kernels with mostly intact husks.',
          'Monitor runoff pH during sparging, especially for pale beers or if you have alkaline water. If pH climbs above 6.0, stop sparging immediately to avoid tannin extraction.',
          'First runnings (the very first wort collected) are sweet, high-gravity, and intensely malty - some brewers save a small sample to taste. Comparing first runnings to final runnings shows the efficiency of your sparge.'
        ]
      }
    }
  ],
  'Fermentation': [
    {
      title: 'Temperature Control (Ale)',
      difficulty: 'Intermediate',
      time: '2-3 weeks',
      content: {
        overview: 'Managing fermentation temperature for clean ale character',
        steps: [
          'Pitch yeast at recommended temperature',
          'Allow temperature to rise 2-3°F after 24 hours',
          'Maintain steady temperature during active fermentation',
          'Allow free rise during final days for diacetyl cleanup',
          'Cold crash at 35°F for 2-3 days',
          'Package beer'
        ],
        tips: [
          'Fermentation temperature = beer temperature, not ambient',
          'Use fermentation chamber if possible',
          'Swamp cooler works well for beginners',
          'Temperature swings create off-flavors'
        ]
      }
    },
    {
      title: 'Lager Fermentation',
      difficulty: 'Advanced',
      time: '6-8 weeks',
      content: {
        overview: 'Low and slow for crisp, clean lagers',
        steps: [
          'Pitch at 45-50°F with adequate yeast',
          'Ferment at 48-52°F for 2-3 weeks',
          'Check gravity until stable',
          'Raise temperature to 65°F for diacetyl rest (2 days)',
          'Lager at 32-40°F for 4-6 weeks',
          'Package when clear and clean'
        ],
        tips: [
          'Use 1.5-2x yeast cells vs. ales',
          'Temperature control is critical',
          'Longer lagering creates smoother beer',
          'Be patient, its worth it'
        ]
      }
    },
    {
      title: 'Pitch Rates & Starters',
      difficulty: 'Intermediate',
      time: '1-2 days',
      content: {
        overview: 'Ensuring adequate healthy yeast for fermentation',
        steps: [
          'Calculate cells needed based on OG and volume',
          'Determine if starter is needed',
          'Make starter 1-2 days before brew day',
          'Use DME at 1.040 gravity',
          'Aerate starter well',
          'Pitch at high krausen or cold crash and decant',
          'Pitch entire starter into fermenter'
        ],
        tips: [
          'Ales need 0.75M cells/mL/°P',
          'Lagers need 1.5M cells/mL/°P',
          'Use online calculator for starter size',
          'Stir plate improves starter efficiency'
        ]
      }
    },
    {
      title: 'Dry Hopping Best Practices',
      difficulty: 'Intermediate',
      time: '3-7 days',
      content: {
        overview: 'Maximizing hop aroma without grassy flavors',
        steps: [
          'Wait until fermentation is complete',
          'Sanitize hops package exterior',
          'Add hops directly to fermenter',
          'Keep temperature at 65-70°F',
          'Dry hop for 3-5 days (up to 7)',
          'Cold crash to drop hops',
          'Package carefully to minimize oxygen'
        ],
        tips: [
          'Dry hopping adds no bitterness',
          'Use whole hops or pellets',
          'More is not always better (0.5-2 oz/gal)',
          'Minimize oxygen exposure when adding'
        ]
      }
    },
    {
      title: 'Managing Off-Flavors',
      difficulty: 'Intermediate',
      time: 'Ongoing',
      content: {
        overview: 'Identifying and preventing common beer defects',
        steps: [
          'Learn to identify common off-flavors',
          'Diacetyl: butter/butterscotch (incomplete fermentation)',
          'Acetaldehyde: green apple (underpitched/young beer)',
          'DMS: corn/cooked vegetables (insufficient boil)',
          'Phenolic: band-aid/medicinal (contamination)',
          'Oxidation: cardboard/sherry (oxygen exposure)',
          'Identify root cause and adjust process'
        ],
        tips: [
          'Buy commercial off-flavor training kit',
          'Take detailed brew notes',
          'Change one variable at a time',
          'Most issues traced to temperature or sanitation'
        ]
      }
    },
    {
      title: 'Yeast Health & Vitality',
      difficulty: 'Intermediate',
      time: 'Ongoing',
      content: {
        overview: 'Maintaining healthy yeast for best fermentation',
        steps: [
          'Use fresh yeast within expiration date',
          'Store liquid yeast in refrigerator',
          'Make starter for liquid yeast',
          'Aerate wort thoroughly before pitching',
          'Pitch adequate cell count',
          'Monitor fermentation temperature',
          'Consider yeast nutrients for high-gravity beers',
          'Harvest and reuse healthy yeast'
        ],
        tips: [
          'Healthy yeast = clean fermentation',
          'Adequate oxygen critical for yeast reproduction',
          'Yeast can be reused 5-10 generations',
          'Vitality decreases with age and stress'
        ]
      }
    }
  ],
  'Packaging': [
    {
      title: 'Bottling Workflow',
      difficulty: 'Beginner',
      time: '2-3 hours',
      content: {
        overview: 'Step-by-step bottling process',
        steps: [
          'Clean all bottles thoroughly',
          'Sanitize bottles, caps, and equipment',
          'Prepare priming sugar solution',
          'Add priming sugar to bottling bucket',
          'Transfer beer gently to bucket',
          'Fill bottles with bottling wand',
          'Cap immediately after filling',
          'Store at 70°F for 2 weeks',
          'Refrigerate and enjoy'
        ],
        tips: [
          'Minimize splashing to avoid oxidation',
          'Consistent fill levels ensure proper carbonation',
          'Use oxygen-absorbing caps for hoppy beers',
          'Wait full 2 weeks before sampling'
        ]
      }
    },
    {
      title: 'Kegging & Closed Transfer',
      difficulty: 'Intermediate',
      time: '1 hour',
      content: {
        overview: 'Kegging for faster carbonation and less oxidation',
        steps: [
          'Clean and sanitize keg',
          'Purge keg with CO2',
          'Transfer beer via closed transfer or siphon',
          'Seal keg and purge headspace',
          'Set regulator to carbonation pressure',
          'Carbonate for 7-14 days',
          'Reduce to serving pressure',
          'Pour and enjoy'
        ],
        tips: [
          'Closed transfer minimizes oxygen exposure',
          'Force carbonation faster: 30 PSI for 24 hours',
          'Line balancing prevents foamy pours',
          'Clean beer lines regularly'
        ]
      }
    },
    {
      title: 'Cold Crash & Clarity',
      difficulty: 'Beginner',
      time: '2-3 days',
      content: {
        overview: 'Improving beer clarity through cold crashing',
        steps: [
          'Complete fermentation fully',
          'Lower temperature to 35-40°F',
          'Hold for 2-3 days',
          'Yeast and proteins drop out',
          'Optional: add gelatin finings',
          'Package carefully to avoid stirring sediment'
        ],
        tips: [
          'Cold crashing doesnt affect flavor',
          'Improves clarity dramatically',
          'Works for both bottles and kegs',
          'Use CO2 to purge keg to avoid oxygen'
        ]
      }
    },
    {
      title: 'Carbonation Methods',
      difficulty: 'Intermediate',
      time: 'Varies',
      content: {
        overview: 'Natural and forced carbonation techniques',
        steps: [
          'Natural: Add priming sugar and bottle condition',
          'Forced: Use CO2 under pressure in keg',
          'Set and forget: Low pressure for 7-14 days',
          'Fast carb: 30 PSI for 24 hours, then serving pressure',
          'Shake method: 30 PSI while shaking keg for 5 minutes',
          'Check carbonation level and adjust'
        ],
        tips: [
          'Different styles need different CO2 volumes',
          'Temperature affects carbonation pressure',
          'Use carbonation calculator',
          'Be patient with bottle conditioning'
        ]
      }
    },
    {
      title: 'Long-Term Storage',
      difficulty: 'Beginner',
      time: 'Ongoing',
      content: {
        overview: 'Storing beer to maintain quality',
        steps: [
          'Store bottles upright to minimize oxidation',
          'Keep in cool, dark place (50-60°F)',
          'Avoid temperature fluctuations',
          'Minimize light exposure (UV causes skunking)',
          'Higher ABV beers age better',
          'Most beers best within 3-6 months',
          'Barleywines and imperials can age years'
        ],
        tips: [
          'Cold and dark preserves freshness',
          'Hoppy beers drink fresh',
          'Some beers improve with age',
          'Track packaging dates'
        ]
      }
    }
  ]
};

export default function Guides() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Brewing Guides</h2>

      <Tabs defaultValue="Complete Guide" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 h-auto bg-muted/50 p-2">
          <TabsTrigger value="Complete Guide">
            Complete Guide
          </TabsTrigger>
          {Object.keys(GUIDES).map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Complete Beer Brewing Guide Tab */}
        <TabsContent value="Complete Guide" className="mt-4">
          <BeerBrewingGuide />
        </TabsContent>

        {Object.entries(GUIDES).map(([category, guides]) => (
          <TabsContent key={category} value={category} className="mt-4">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {guides.map((guide, index) => (
                <AccordionItem key={index} value={`${category}-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <div className="font-semibold">{guide.title}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {guide.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {guide.time}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Overview</h4>
                        <p className="text-sm text-muted-foreground">
                          {guide.content.overview}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Steps</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          {guide.content.steps.map((step, i) => (
                            <li key={i} className="text-muted-foreground">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Pro Tips</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {guide.content.tips.map((tip, i) => (
                            <li key={i} className="text-muted-foreground">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
