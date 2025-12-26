const DIRECTUS_URL = 'https://admin.thecrackedgrain.com';
const TOKEN = process.env.DIRECTUS_API_TOKEN || '5KmoigBiCbbPPKdyVSHW48EzrNk5lIzr';

const enhancedRecipes = {
  "elder-statesman-dipa": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "American 2-Row", amount: "14", unit: "lb"},
          {name: "Munich Malt", amount: "1", unit: "lb"},
          {name: "Caramel 40L", amount: "8", unit: "oz"},
          {name: "Dextrose", amount: "1", unit: "lb"}
        ],
        instructions: [
          "PREP (30 min before): Heat 5 gallons of strike water to 162°F. Mill your grains if not pre-crushed.",
          "MASH IN: Slowly add grains to strike water, stirring to avoid clumps. Target mash temp: 149°F. This low temperature creates a highly fermentable wort for a dry finish.",
          "MASH REST: Hold at 149°F for 75 minutes. Stir every 15-20 minutes. Check temperature and add heat if needed.",
          "MASH OUT: Raise temperature to 168°F over 10 minutes to stop enzyme activity.",
          "VORLAUF: Recirculate first runnings until clear (about 1-2 quarts).",
          "SPARGE: Slowly rinse grains with 170°F water. Collect approximately 7 gallons of wort.",
          "BOIL: Bring to a rolling boil. Boil for 60 minutes total.",
          "HOP ADDITIONS: Add Columbus at 60 min, Centennial at 15 min, Citra at 5 min, Mosaic at flameout.",
          "WHIRLPOOL: After flameout, stir to create whirlpool. Let Mosaic steep for 15-20 minutes.",
          "CHILL: Cool wort to 66°F as quickly as possible using immersion or plate chiller.",
          "TRANSFER: Move to sanitized fermenter, leaving trub behind. Add dextrose (dissolved in boiled water).",
          "AERATE: Shake fermenter vigorously for 2-3 minutes or use oxygen stone.",
          "PITCH YEAST: Add yeast when wort is 66-68°F. Seal with airlock."
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Extra Light LME", amount: "9", unit: "lb"},
          {name: "Munich LME", amount: "1", unit: "lb"},
          {name: "Caramel 40L (steep)", amount: "8", unit: "oz"},
          {name: "Dextrose", amount: "1", unit: "lb"}
        ],
        instructions: [
          "PREP: Heat 3 gallons of water to 155°F in your brew kettle.",
          "STEEP GRAINS: Place crushed Caramel 40L in grain bag. Steep at 150-155°F for 30 minutes. Do not squeeze bag.",
          "REMOVE GRAINS: Lift bag and let drip. Discard spent grains.",
          "BRING TO BOIL: Heat to boiling. REMOVE FROM HEAT before adding extracts.",
          "ADD EXTRACTS: Stir in all LME thoroughly to prevent scorching. Return to boil.",
          "60 MIN BOIL: Add Columbus hops. Start your timer.",
          "45 MIN: Watch for boilovers. Adjust heat as needed.",
          "15 MIN: Add Centennial hops.",
          "5 MIN: Add Citra hops and dextrose (dissolved in small amount of boiled water).",
          "0 MIN (FLAMEOUT): Turn off heat. Add Mosaic hops. Stir and let steep 15 minutes.",
          "CHILL: Cool wort to 66°F. An ice bath works if you do not have a wort chiller.",
          "TOP UP: Transfer to fermenter and add cool water to reach 5 gallons.",
          "AERATE: Shake fermenter vigorously for 2-3 minutes.",
          "PITCH YEAST: Add yeast when wort is 66-68°F. Seal with airlock."
        ]
      }
    ],
    hops: [
      {name: "Columbus", amount: "2", unit: "oz", time: "60 min", use: "Bittering"},
      {name: "Centennial", amount: "1", unit: "oz", time: "15 min", use: "Flavor"},
      {name: "Citra", amount: "2", unit: "oz", time: "5 min", use: "Aroma"},
      {name: "Mosaic", amount: "2", unit: "oz", time: "0 min (whirlpool)", use: "Aroma"},
      {name: "Citra", amount: "2", unit: "oz", time: "Dry hop 5 days", use: "Dry Hop"},
      {name: "Mosaic", amount: "2", unit: "oz", time: "Dry hop 5 days", use: "Dry Hop"}
    ],
    yeast: [
      {name: "Safale US-05", type: "Dry", attenuation: "78-82%", notes: "Clean, lets hops shine"},
      {name: "WLP001 California Ale", type: "Liquid", attenuation: "73-80%", notes: "West Coast classic"}
    ],
    fermentation: [
      {step: "Primary Fermentation", temp: "66-68°F", duration: "10-14 days", notes: "Activity should start within 24-48 hours. Keep temperature steady - fluctuations stress yeast."},
      {step: "Dry Hop", temp: "66°F", duration: "5 days", notes: "Add 2oz Citra and 2oz Mosaic directly to fermenter. Minimize oxygen exposure."},
      {step: "Cold Crash", temp: "35°F", duration: "2-3 days", notes: "Refrigerate fermenter to drop yeast and hops to bottom. Improves clarity."},
      {step: "Packaging", temp: "Room temp", duration: "2-3 weeks if bottle conditioning", notes: "Keg at 12 PSI or bottle with 4oz priming sugar. Drink fresh for best hop character!"}
    ],
    tips: {
      dos: ["Use fresh hops - preferably less than 6 months old", "Drink fresh - hop character fades quickly", "Oxygen-free transfers preserve hop aroma", "Keep fermentation temperature steady"],
      donts: ["Don't over-bitter - let late hops shine", "Don't age this beer - IPAs are meant fresh", "Don't skimp on dry hopping", "Don't ferment above 70°F - creates off-flavors"],
      water_chemistry: "Sulfate-forward for hop brightness: Ca 100-150ppm, SO₄ 200-300ppm, Cl 50-75ppm (3:1 ratio). Add gypsum to tap water if needed."
    },
    food_pairing: ["Spicy wings", "Blue cheese burger", "Aged cheddar", "Carrot cake", "Thai curry"],
    notes: "This Double IPA is a tribute to the West Coast style - dry, bitter, and bursting with hop flavor. The low mash temp and dextrose addition ensure high attenuation for a crisp finish that lets the hops shine. Drink within 6-8 weeks of packaging for peak hop character."
  },

  "dublin-dry-stout": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "Maris Otter", amount: "7", unit: "lb"},
          {name: "Roasted Barley", amount: "1", unit: "lb"},
          {name: "Flaked Barley", amount: "1", unit: "lb"},
          {name: "Black Patent Malt", amount: "4", unit: "oz"}
        ],
        instructions: [
          "PREP (30 min before): Heat 3.5 gallons of strike water to 165°F. Crush grains if not pre-milled.",
          "MASH IN: Add grains to strike water gradually while stirring. Target mash temp: 152°F for full body and residual sweetness.",
          "MASH REST: Hold at 152°F for 60 minutes. Stir gently every 15 minutes to ensure even temperature distribution.",
          "MASH OUT: Raise to 168°F over 10 minutes. This stops enzyme activity and helps with lautering.",
          "VORLAUF: Recirculate first runnings slowly until wort runs clear (1-2 quarts).",
          "SPARGE: Rinse grains with 170°F water. Collect about 6.5 gallons total pre-boil volume.",
          "BOIL: Bring to vigorous boil. Boil for 60 minutes to ensure DMS removal.",
          "HOP ADDITIONS: Add East Kent Goldings at 60 min, Fuggle at 15 min for subtle earthy character.",
          "FLAMEOUT: Turn off heat. Let settle for 5 minutes.",
          "WHIRLPOOL: Stir vigorously to create whirlpool, then let settle 10 minutes.",
          "CHILL: Cool rapidly to 65°F. Speed is important for clean fermentation.",
          "TRANSFER: Move to fermenter, leaving trub behind. Aim for 5 gallons in fermenter.",
          "AERATE: Shake or use aeration stone for 60 seconds - stouts need good oxygenation.",
          "PITCH YEAST: Add yeast at 65-68°F. Seal with airlock."
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Maris Otter LME", amount: "5", unit: "lb"},
          {name: "Roasted Barley (steep)", amount: "1", unit: "lb"},
          {name: "Flaked Barley (steep)", amount: "1", unit: "lb"},
          {name: "Black Patent Malt (steep)", amount: "4", unit: "oz"}
        ],
        instructions: [
          "PREP: Heat 3 gallons of water to 155°F in your kettle.",
          "STEEP GRAINS: Add all specialty grains in large grain bag. Steep at 150-155°F for 30 minutes. This extracts color and roasted flavors.",
          "REMOVE GRAINS: Lift bag slowly, let drip. Do not squeeze - can extract harsh tannins.",
          "BRING TO BOIL: Heat to boiling. Remove from heat momentarily.",
          "ADD EXTRACT: Stir in Maris Otter LME completely to prevent scorching on kettle bottom.",
          "RETURN TO BOIL: Bring back to rolling boil carefully - watch for boilover!",
          "60 MIN BOIL: Add East Kent Goldings hops. Start timer.",
          "45 MIN: Monitor boil, adjust heat to maintain steady rolling boil.",
          "15 MIN: Add Fuggle hops for mild earthy flavor.",
          "0 MIN (FLAMEOUT): Turn off heat and let settle 5 minutes.",
          "CHILL: Cool to 65°F using ice bath or wort chiller.",
          "TOP UP: Transfer to fermenter, add cool water to reach 5 gallons.",
          "AERATE: Shake vigorously for 90 seconds.",
          "PITCH YEAST: Add yeast at 65-68°F. Seal with airlock."
        ]
      }
    ],
    hops: [
      {name: "East Kent Goldings", amount: "1.5", unit: "oz", time: "60 min", use: "Bittering"},
      {name: "Fuggle", amount: "0.5", unit: "oz", time: "15 min", use: "Flavor"}
    ],
    yeast: [
      {name: "Safale S-04", type: "Dry", attenuation: "72-78%", notes: "Classic English ale yeast - clean with slight fruit"},
      {name: "WLP004 Irish Ale", type: "Liquid", attenuation: "69-74%", notes: "Traditional choice for Irish stouts"}
    ],
    fermentation: [
      {step: "Primary Fermentation", temp: "65-68°F", duration: "7-10 days", notes: "Lower temps produce cleaner flavor. Expect activity within 12-24 hours."},
      {step: "Conditioning", temp: "65°F", duration: "2 weeks", notes: "Let beer condition at room temp to develop smooth, mellow character."},
      {step: "Cold Crash", temp: "35°F", duration: "2-3 days", notes: "Optional - improves clarity but stouts are traditionally served less clear."},
      {step: "Packaging", temp: "Room temp", duration: "2 weeks min", notes: "Serve on nitro if possible (25-30 PSI) or low CO₂ carbonation (1.5-2.0 vol). Improves with age up to 3 months."}
    ],
    tips: {
      dos: ["Serve on nitro for creamy head if possible", "Keep fermentation cool for clean flavor", "Age 2-4 weeks for best flavor development", "Use fresh roasted barley for best coffee notes"],
      donts: ["Don't over-carbonate - stouts are low carbonation", "Don't squeeze grain bag - extracts harsh tannins", "Don't rush fermentation", "Don't serve ice cold - 50-55°F is ideal"],
      water_chemistry: "Balanced water profile: Ca 50-100ppm, sulfate and chloride balanced 1:1 ratio (50-100ppm each). Avoid high sulfate which accentuates bitterness."
    },
    food_pairing: ["Oysters", "Beef stew", "Aged cheddar", "Chocolate desserts", "Smoked salmon"],
    notes: "A classic dry Irish stout with roasted barley character, coffee notes, and creamy texture. The combination of roasted and flaked barley creates complexity and a silky mouthfeel. Lower carbonation and serving on nitro enhances the traditional pub experience."
  },

  "blue-ozark-moon": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "Pilsner Malt", amount: "5", unit: "lb"},
          {name: "White Wheat Malt", amount: "3", unit: "lb"},
          {name: "Flaked Oats", amount: "1", unit: "lb"},
          {name: "Acidulated Malt", amount: "4", unit: "oz"}
        ],
        instructions: [
          "PREP (30 min before): Heat 3.5 gallons strike water to 158°F. Add rice hulls to mash tun - prevents stuck sparge with wheat and oats.",
          "MASH IN: Add grains slowly to strike water while stirring. Target mash temp: 150°F for light body and high drinkability.",
          "MASH REST: Hold at 150°F for 60 minutes. Stir every 20 minutes. Wheat can settle and compact easily.",
          "MASH OUT: Raise to 168°F over 10 minutes. Particularly important with wheat to improve lautering.",
          "VORLAUF: Recirculate slowly - wheat mashes can be cloudy. May take 10-15 minutes to clear.",
          "SPARGE: Very slow sparge with 170°F water. Rice hulls help, but take your time. Collect 6.5 gallons.",
          "BOIL: Bring to boil. Boil for 60 minutes for DMS removal from pilsner malt.",
          "HOP ADDITIONS: Add Saaz at 60 min for mild bitterness only - hops are not the star here.",
          "SPICE ADDITIONS: At 5 min remaining, add 1oz coriander (lightly crushed) and zest of 2 oranges (avoid white pith).",
          "FLAMEOUT: Turn off heat. Let settle 5 minutes.",
          "CHILL: Cool to 65°F quickly to avoid DMS production.",
          "TRANSFER: Move to fermenter leaving trub behind. Should have 5-5.5 gallons.",
          "AERATE: Shake vigorously for 2 minutes or use aeration stone.",
          "PITCH YEAST: Add Belgian wit yeast at 65-68°F. Seal with airlock."
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Pilsner LME", amount: "4", unit: "lb"},
          {name: "Wheat LME", amount: "3", unit: "lb"},
          {name: "Flaked Oats (steep)", amount: "1", unit: "lb"}
        ],
        instructions: [
          "PREP: Heat 3 gallons water to 155°F.",
          "STEEP OATS: Add flaked oats in grain bag. Steep at 150-155°F for 30 minutes for body and silky texture.",
          "REMOVE GRAINS: Lift bag and let drip thoroughly.",
          "BRING TO BOIL: Heat to boiling, then remove from heat.",
          "ADD EXTRACTS: Stir in Pilsner and Wheat LME completely. Prevent scorching on bottom.",
          "RETURN TO BOIL: Bring back to rolling boil. Watch for boilover - wheat extract is foamy!",
          "60 MIN BOIL: Add Saaz hops. Start timer.",
          "45 MIN: Monitor boil, maintain steady heat.",
          "5 MIN: Add 1oz crushed coriander and zest of 2 oranges (no white pith).",
          "0 MIN (FLAMEOUT): Turn off heat, let settle 5 minutes.",
          "CHILL: Cool to 65°F using ice bath or chiller.",
          "TOP UP: Transfer to fermenter, add cool water to 5 gallons.",
          "AERATE: Shake vigorously for 2 minutes.",
          "PITCH YEAST: Add yeast at 65-68°F. Seal with airlock."
        ]
      }
    ],
    hops: [
      {name: "Saaz", amount: "1", unit: "oz", time: "60 min", use: "Bittering"}
    ],
    yeast: [
      {name: "Safbrew WB-06", type: "Dry", attenuation: "66-70%", notes: "Classic witbier yeast - spicy phenolics"},
      {name: "WLP400 Belgian Wit", type: "Liquid", attenuation: "74-78%", notes: "Traditional choice - citrus and spice notes"}
    ],
    fermentation: [
      {step: "Primary Fermentation", temp: "65-70°F", duration: "7 days", notes: "Warmer temps bring out spicy phenolic character. Don't go over 72°F or you'll get harsh flavors."},
      {step: "Conditioning", temp: "65°F", duration: "1 week", notes: "Let flavors meld and yeast settle naturally."},
      {step: "Packaging", temp: "Room temp", duration: "1-2 weeks", notes: "Do NOT cold crash - witbiers are meant to be hazy! Carbonate to 2.5-3.0 volumes for authentic Belgian character."},
      {step: "Serving", temp: "45-50°F", duration: "N/A", notes: "Serve cold with orange wheel garnish if desired. Swirl gently to rouse yeast for traditional cloudy appearance."}
    ],
    tips: {
      dos: ["Add rice hulls to prevent stuck sparge", "Use fresh coriander and orange zest", "Serve cold and cloudy - don't filter", "Carbonate slightly higher than typical ales"],
      donts: ["Don't cold crash - meant to be hazy", "Don't over-spice - subtle is better", "Don't use orange juice - only zest", "Don't squeeze grain bag hard"],
      water_chemistry: "Soft water profile works best: Ca 50-75ppm, low sulfate and chloride (under 75ppm each), slightly acidic (pH 4.2-4.4 in mash)."
    },
    food_pairing: ["Grilled fish", "Light salads", "Goat cheese", "Mussels", "Thai food"],
    notes: "A refreshing Belgian-style witbier with wheat, oats, coriander, and orange peel. The haziness comes from wheat proteins and suspended yeast - embrace the cloudiness! Perfect summer beer that's crisp and sessionable with subtle spice character."
  },

  "bavarian-hefeweizen": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "White Wheat Malt", amount: "5", unit: "lb"},
          {name: "Pilsner Malt", amount: "4", unit: "lb"},
          {name: "Munich Malt", amount: "8", unit: "oz"},
          {name: "Acidulated Malt", amount: "2", unit: "oz"}
        ],
        instructions: [
          "PREP (30 min before): Heat 3.5 gallons strike water to 162°F. Add rice hulls to mash tun to prevent stuck sparge with high wheat content.",
          "MASH IN: Slowly add grains while stirring constantly. Target mash temp: 152°F for medium body and good mouthfeel.",
          "PROTEIN REST: Optional but traditional - hold at 122°F for 15 min before raising to saccharification temp.",
          "MASH REST: Hold at 152°F for 60 minutes. Stir every 15-20 minutes as wheat can settle and compact.",
          "MASH OUT: Raise to 168°F over 10 minutes. Crucial for wheat beers to aid lautering.",
          "VORLAUF: Recirculate slowly and patiently. Wheat wort takes longer to clear - may need 10-15 minutes.",
          "SPARGE: Very slow, gentle sparge with 170°F water. Rushing causes stuck sparge. Collect 6.5 gallons.",
          "BOIL: Bring to gentle rolling boil. Boil for 60 minutes - no vigorous boil needed.",
          "HOP ADDITIONS: Add Hallertau at 60 min, Tettnang at 15 min. Hops are background only.",
          "FLAMEOUT: Turn off heat, let settle briefly.",
          "CHILL: Cool to 60°F. Cooler fermentation favors clove over banana.",
          "TRANSFER: Move to fermenter, leaving trub. Wheat beers benefit from some protein haze.",
          "MINIMAL AERATION: Shake gently for 30 seconds only - under-pitching and under-aerating promotes banana esters.",
          "PITCH YEAST: Add yeast at 60-62°F. Seal with airlock. Temperature is critical for flavor profile."
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Wheat LME", amount: "5", unit: "lb"},
          {name: "Pilsner LME", amount: "3", unit: "lb"},
          {name: "Munich LME", amount: "8", unit: "oz"}
        ],
        instructions: [
          "PREP: Heat 3 gallons water to 170°F for pure extract brewing.",
          "BRING TO BOIL: Heat to boiling, then remove from heat momentarily.",
          "ADD EXTRACTS: Stir in all LME thoroughly - wheat extract is very sticky! Prevent scorching.",
          "RETURN TO BOIL: Bring back to gentle rolling boil. Watch carefully - wheat extract foams more.",
          "60 MIN BOIL: Add Hallertau hops. Start timer.",
          "45 MIN: Monitor heat, maintain steady gentle boil.",
          "15 MIN: Add Tettnang hops for subtle noble hop character.",
          "0 MIN (FLAMEOUT): Turn off heat.",
          "CHILL: Cool to 60°F. Cooler temps favor clove character, warmer temps (68°F) favor banana.",
          "TOP UP: Transfer to fermenter, add cool water to 5 gallons.",
          "MINIMAL AERATION: Shake gently for 30 seconds - don't over-aerate!",
          "PITCH YEAST: Add hefeweizen yeast at 60-62°F for clove, or 68°F for banana. Your choice!",
          "FERMENTATION: Let temperature rise naturally after first 24 hours for ester development."
        ]
      }
    ],
    hops: [
      {name: "Hallertau", amount: "1", unit: "oz", time: "60 min", use: "Bittering"},
      {name: "Tettnang", amount: "0.5", unit: "oz", time: "15 min", use: "Flavor"}
    ],
    yeast: [
      {name: "Safbrew WB-06", type: "Dry", attenuation: "86-90%", notes: "Banana and clove character - ferment cool for clove, warm for banana"},
      {name: "WLP300 Hefeweizen Ale", type: "Liquid", attenuation: "72-76%", notes: "Classic Bavarian strain - beautiful banana and clove balance"}
    ],
    fermentation: [
      {step: "Primary Fermentation", temp: "62-68°F", duration: "5-7 days", notes: "Temperature controls flavor! 62°F = more clove, 68°F = more banana. Let rise naturally after 24 hours."},
      {step: "Warm Conditioning", temp: "68-70°F", duration: "3-4 days", notes: "Raise temp after fermentation completes to help yeast clean up. Aids in ester development."},
      {step: "Packaging", temp: "Room temp", duration: "1-2 weeks", notes: "Do NOT cold crash - hefe should be cloudy! Bottle condition or keg at 3.0-4.0 volumes for authentic German carbonation."},
      {step: "Serving", temp: "45-50°F", duration: "N/A", notes: "Serve in tall weizen glass. Swirl bottle to rouse yeast before final pour for traditional cloudy appearance."}
    ],
    tips: {
      dos: ["Control fermentation temp for desired banana/clove balance", "Add rice hulls to prevent stuck sparge", "Carbonate high (3.5+ volumes) for authentic German style", "Serve cloudy with yeast - traditional!"],
      donts: ["Don't filter or fine - meant to be hazy", "Don't over-aerate wort", "Don't use old yeast - fresh is critical", "Don't cold crash"],
      water_chemistry: "Soft water best: Ca 50ppm or less, low sulfate and chloride. Slightly acidic mash (pH 4.2-4.4) enhances wheat character."
    },
    food_pairing: ["Weisswurst", "Pretzels with mustard", "Roasted chicken", "Banana bread", "Apple strudel"],
    notes: "A classic Bavarian weissbier with signature banana and clove flavors from the unique yeast strain. The hazy appearance comes from wheat proteins and suspended yeast - this is intentional and traditional! Fermentation temperature is the key to controlling the banana/clove balance."
  },

  "spotted-hog-cream-ale": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "American 2-Row", amount: "7", unit: "lb"},
          {name: "Flaked Corn", amount: "1.5", unit: "lb"},
          {name: "Carapils", amount: "8", unit: "oz"},
          {name: "Honey Malt", amount: "4", unit: "oz"}
        ],
        instructions: [
          "PREP (30 min before): Heat 3.5 gallons strike water to 160°F. No rice hulls needed - good base malt to adjunct ratio.",
          "MASH IN: Add grains gradually while stirring. Target mash temp: 150°F for light, crisp body.",
          "MASH REST: Hold at 150°F for 60 minutes. Stir every 20 minutes. Corn can settle.",
          "MASH OUT: Raise to 168°F over 10 minutes for easy lautering.",
          "VORLAUF: Recirculate until wort runs clear, about 1-2 quarts.",
          "SPARGE: Rinse grains with 170°F water. Collect 6.5 gallons pre-boil wort.",
          "BOIL: Bring to rolling boil. Boil for 60 minutes for DMS removal.",
          "HOP ADDITIONS: Add Cluster at 60 min for clean bitterness, Liberty at 5 min for subtle hop aroma.",
          "FLAMEOUT: Turn off heat, let settle 5 minutes.",
          "CHILL: Cool rapidly to 60°F - crucial for clean lager-like fermentation.",
          "TRANSFER: Move to fermenter leaving trub behind.",
          "AERATE: Shake vigorously for 90 seconds - this beer needs good oxygenation.",
          "PITCH YEAST: Add ale yeast at 60°F. Ferment cool for clean, lager-like character.",
          "TEMPERATURE CONTROL: Hold at 60-62°F throughout fermentation - key to cream ale character."
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Extra Light LME", amount: "5", unit: "lb"},
          {name: "Corn Sugar", amount: "1.5", unit: "lb"},
          {name: "Carapils (steep)", amount: "8", unit: "oz"},
          {name: "Honey Malt (steep)", amount: "4", unit: "oz"}
        ],
        instructions: [
          "PREP: Heat 3 gallons water to 155°F.",
          "STEEP GRAINS: Add Carapils and Honey malt in grain bag. Steep at 150-155°F for 30 minutes for body and subtle sweetness.",
          "REMOVE GRAINS: Lift bag and let drip. Discard spent grains.",
          "BRING TO BOIL: Heat to boiling, then remove from heat.",
          "ADD EXTRACT: Stir in LME completely to prevent scorching.",
          "RETURN TO BOIL: Bring back to rolling boil.",
          "60 MIN BOIL: Add Cluster hops. Start timer.",
          "45 MIN: Add corn sugar dissolved in small amount of boiled water for smooth fermentation.",
          "5 MIN: Add Liberty hops for subtle noble hop character.",
          "0 MIN (FLAMEOUT): Turn off heat, let settle 5 minutes.",
          "CHILL: Cool to 60°F as quickly as possible.",
          "TOP UP: Transfer to fermenter, add cool water to 5 gallons.",
          "AERATE: Shake vigorously for 90 seconds.",
          "PITCH YEAST: Add yeast at 60°F. Maintain cool fermentation for clean flavor."
        ]
      }
    ],
    hops: [
      {name: "Cluster", amount: "1", unit: "oz", time: "60 min", use: "Bittering"},
      {name: "Liberty", amount: "0.5", unit: "oz", time: "5 min", use: "Aroma"}
    ],
    yeast: [
      {name: "Safale US-05", type: "Dry", attenuation: "78-82%", notes: "Clean American profile - ferment cool for lager-like character"},
      {name: "WLP001 California Ale", type: "Liquid", attenuation: "73-80%", notes: "Very clean, lets grain shine"}
    ],
    fermentation: [
      {step: "Primary Fermentation", temp: "60-62°F", duration: "10-14 days", notes: "Cool fermentation is key! Creates clean, crisp, lager-like character despite using ale yeast."},
      {step: "Diacetyl Rest", temp: "65°F", duration: "2-3 days", notes: "Raise temp after fermentation completes to clean up any buttery flavors."},
      {step: "Cold Crash", temp: "35°F", duration: "3-5 days", notes: "Refrigerate to drop yeast and improve clarity. Cream ale should be brilliantly clear."},
      {step: "Packaging", temp: "Room temp", duration: "2 weeks", notes: "Keg at 10-12 PSI or bottle with 3.5oz priming sugar. High carbonation (2.6-2.8 vol) is traditional."}
    ],
    tips: {
      dos: ["Ferment cool (60-62°F) for clean, lager-like flavor", "Cold crash for brilliant clarity", "Carbonate slightly higher than typical ales", "Drink young and fresh"],
      donts: ["Don't ferment warm - produces ale character", "Don't rush cold crash - clarity is important", "Don't under-carbonate", "Don't over-hop - keep it subtle"],
      water_chemistry: "Balanced profile: Ca 50-100ppm, sulfate and chloride balanced 1:1 ratio (50-100ppm each). Avoid high minerals - this is a light beer."
    },
    food_pairing: ["Fried chicken", "Fish and chips", "Nachos", "Potato salad", "Mild cheddar"],
    notes: "An American classic - the cream ale is fermented with ale yeast at lager temperatures for a clean, crisp, lager-like beer. The corn adds a subtle sweetness and crisp finish. This is a fantastic lawn mower beer - light, refreshing, and highly drinkable."
  },

  "razorback-slobber": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "Maris Otter", amount: "9", unit: "lb"},
          {name: "Crystal 60L", amount: "1", unit: "lb"},
          {name: "Chocolate Malt", amount: "8", unit: "oz"},
          {name: "UK Brown Malt", amount: "4", unit: "oz"}
        ],
        instructions: [
          "PREP (30 min before): Heat 4 gallons strike water to 164°F. Mill grains if not pre-crushed.",
          "MASH IN: Add grains slowly while stirring. Target mash temp: 154°F for medium-full body and maltiness.",
          "MASH REST: Hold at 154°F for 60 minutes. Stir every 15 minutes for even heat distribution.",
          "MASH OUT: Raise to 168°F over 10 minutes to improve efficiency.",
          "VORLAUF: Recirculate first runnings until clear, about 1-2 quarts.",
          "SPARGE: Rinse grains with 170°F water. Collect 6.5 gallons of deep brown wort.",
          "BOIL: Bring to rolling boil. Boil for 60 minutes.",
          "HOP ADDITIONS: Add Northern Brewer at 60 min, Willamette at 15 min, Fuggle at 5 min for classic English hop character.",
          "FLAMEOUT: Turn off heat, let settle 5 minutes.",
          "WHIRLPOOL: Stir to create whirlpool, let settle 10 minutes.",
          "CHILL: Cool to 65°F for clean English ale fermentation.",
          "TRANSFER: Move to fermenter, leaving trub behind.",
          "AERATE: Shake vigorously for 90 seconds.",
          "PITCH YEAST: Add English ale yeast at 65-68°F. Seal with airlock."
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Maris Otter LME", amount: "6.5", unit: "lb"},
          {name: "Crystal 60L (steep)", amount: "1", unit: "lb"},
          {name: "Chocolate Malt (steep)", amount: "8", unit: "oz"},
          {name: "UK Brown Malt (steep)", amount: "4", unit: "oz"}
        ],
        instructions: [
          "PREP: Heat 3 gallons water to 155°F.",
          "STEEP GRAINS: Add all specialty grains in grain bag. Steep at 150-155°F for 30 minutes for color and flavor.",
          "REMOVE GRAINS: Lift bag slowly, let drip completely.",
          "BRING TO BOIL: Heat to boiling, then remove from heat.",
          "ADD EXTRACT: Stir in Maris Otter LME thoroughly to prevent scorching.",
          "RETURN TO BOIL: Bring back to rolling boil carefully.",
          "60 MIN BOIL: Add Northern Brewer hops. Start timer.",
          "45 MIN: Monitor boil, maintain steady heat.",
          "15 MIN: Add Willamette hops for earthy hop flavor.",
          "5 MIN: Add Fuggle hops for traditional English aroma.",
          "0 MIN (FLAMEOUT): Turn off heat, let settle 5 minutes.",
          "CHILL: Cool to 65°F using ice bath or chiller.",
          "TOP UP: Transfer to fermenter, add cool water to 5 gallons.",
          "AERATE: Shake vigorously for 90 seconds.",
          "PITCH YEAST: Add yeast at 65-68°F. Seal with airlock."
        ]
      }
    ],
    hops: [
      {name: "Northern Brewer", amount: "1.5", unit: "oz", time: "60 min", use: "Bittering"},
      {name: "Willamette", amount: "0.5", unit: "oz", time: "15 min", use: "Flavor"},
      {name: "Fuggle", amount: "0.5", unit: "oz", time: "5 min", use: "Aroma"}
    ],
    yeast: [
      {name: "Safale S-04", type: "Dry", attenuation: "72-78%", notes: "Classic English character with subtle fruitiness"},
      {name: "WLP002 English Ale", type: "Liquid", attenuation: "63-70%", notes: "Malty, soft finish - great for brown ales"}
    ],
    fermentation: [
      {step: "Primary Fermentation", temp: "65-68°F", duration: "7-10 days", notes: "Moderate temps bring out malt character. English yeast produces subtle fruity esters."},
      {step: "Conditioning", temp: "65°F", duration: "2-3 weeks", notes: "Let beer condition at room temp to mellow and develop complexity. English ales improve with age."},
      {step: "Cold Crash", temp: "35°F", duration: "2-3 days", notes: "Optional - aids clarity but English ales can be served slightly hazy."},
      {step: "Packaging", temp: "Room temp", duration: "2-3 weeks min", notes: "Carbonate to 2.0-2.3 volumes for authentic English pub style. Best after 4-6 weeks total."}
    ],
    tips: {
      dos: ["Let it condition - improves greatly with age", "Serve at cellar temp (50-55°F) not ice cold", "Moderate carbonation for smooth mouthfeel", "Drink within 3-6 months for best flavor"],
      donts: ["Don't rush fermentation or conditioning", "Don't serve too cold - hides malt complexity", "Don't over-carbonate - should be smooth", "Don't squeeze specialty grain bag"],
      water_chemistry: "Balanced to slightly chloride-forward: Ca 100ppm, chloride 75-100ppm, sulfate 50-75ppm. Enhances malt sweetness and smooth finish."
    },
    food_pairing: ["Roasted pork", "Beef pasty", "Sharp cheddar", "Pecan pie", "BBQ ribs"],
    notes: "An English-style brown ale with rich malt character, chocolate notes, and subtle hop bitterness. The combination of Maris Otter and crystal malts creates a malty, slightly sweet beer with nutty complexity. This beer improves with age - be patient!"
  },

  "belgian-tripel": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "Belgian Pilsner Malt", amount: "12", unit: "lb"},
          {name: "White Wheat Malt", amount: "1", unit: "lb"},
          {name: "Clear Candi Sugar", amount: "1.5", unit: "lb"},
          {name: "Aromatic Malt", amount: "4", unit: "oz"}
        ],
        instructions: [
          "PREP (30 min before): Heat 4.5 gallons strike water to 163°F. This is a BIG beer!",
          "MASH IN: Add grains slowly while stirring. Target mash temp: 148°F for highly fermentable wort and dry finish.",
          "MASH REST: Hold at 148°F for 90 minutes. Belgian Pilsner malt needs longer conversion. Stir every 20 minutes.",
          "MASH OUT: Raise to 168°F over 10 minutes.",
          "VORLAUF: Recirculate patiently until crystal clear - may take 10-15 minutes.",
          "SPARGE: Rinse grains with 170°F water. Collect 7 gallons for 90-minute boil.",
          "BOIL: Bring to rolling boil. Boil for 90 minutes to drive off DMS from Pilsner malt.",
          "CANDI SUGAR: Add clear candi sugar at 15 minutes remaining. Dissolve in small amount of boiling wort first.",
          "HOP ADDITIONS: Add Styrian Goldings at 60 min, Saaz at 15 min. Hops are subtle in Tripels.",
          "FLAMEOUT: Turn off heat, let settle 10 minutes.",
          "CHILL: Cool to 64°F. Belgian yeasts can handle slightly warmer pitching temps.",
          "TRANSFER: Move to fermenter, leaving trub. Aim for 5 gallons.",
          "AERATE WELL: Shake vigorously for 3+ minutes or use pure oxygen - high gravity needs it!",
          "PITCH YEAST: Add Belgian yeast at 64-66°F. Pitch 1.5-2x normal rate for high gravity beer.",
          "TEMPERATURE CONTROL: Let rise naturally to 70-72°F over first 3 days for ester development."
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Pilsner LME", amount: "9", unit: "lb"},
          {name: "Wheat LME", amount: "1", unit: "lb"},
          {name: "Clear Candi Sugar", amount: "1.5", unit: "lb"}
        ],
        instructions: [
          "PREP: Heat 4 gallons water to 170°F for concentrated boil.",
          "BRING TO BOIL: Heat to boiling, then remove from heat.",
          "ADD EXTRACTS: Stir in all LME thoroughly. This is a lot of extract - prevent scorching!",
          "RETURN TO BOIL: Bring back to rolling boil. Watch carefully!",
          "90 MIN BOIL: Add Styrian Goldings hops. Start timer. Longer boil needed for Pilsner extract.",
          "45 MIN: Monitor boil carefully.",
          "15 MIN: Add Saaz hops and clear candi sugar (dissolved in boiling wort).",
          "0 MIN (FLAMEOUT): Turn off heat, let settle 10 minutes.",
          "CHILL: Cool to 64°F using wort chiller or ice bath.",
          "TOP UP: Transfer to fermenter, add cool water to 5 gallons. Take gravity reading!",
          "AERATE WELL: Shake vigorously for 3+ minutes. High gravity beer needs lots of oxygen.",
          "PITCH YEAST: Add 1.5-2x normal yeast amount at 64-66°F. High gravity needs more yeast!",
          "FERMENTATION: Let temperature rise to 70-72°F naturally for Belgian ester development."
        ]
      }
    ],
    hops: [
      {name: "Styrian Goldings", amount: "2", unit: "oz", time: "60 min", use: "Bittering"},
      {name: "Saaz", amount: "1", unit: "oz", time: "15 min", use: "Flavor"}
    ],
    yeast: [
      {name: "Safbrew BE-256", type: "Dry", attenuation: "82-86%", notes: "High gravity specialist - great for Tripels"},
      {name: "WLP530 Abbey Ale", type: "Liquid", attenuation: "75-80%", notes: "Classic Tripel strain - spicy, phenolic, fruity"}
    ],
    fermentation: [
      {step: "Primary Fermentation", temp: "64-72°F", duration: "14-21 days", notes: "Start cool (64°F) and let rise naturally to 70-72°F. Creates complex esters and phenols. Be patient - high gravity takes time!"},
      {step: "Secondary Conditioning", temp: "65°F", duration: "2-4 weeks", notes: "Transfer to secondary or just leave in primary. Let yeast clean up and condition. Tripels improve with age."},
      {step: "Bottle Conditioning", temp: "70°F", duration: "3-4 weeks", notes: "Tripels are traditionally bottle conditioned. Use 4.5oz priming sugar for high carbonation (3.0+ vol)."},
      {step: "Aging", temp: "Cellar (55-60°F)", duration: "2-6 months", notes: "Age in cool, dark place. Peak flavor at 3-4 months but can age beautifully for years!"}
    ],
    tips: {
      dos: ["Pitch plenty of yeast - 1.5-2x normal rate", "Age 2+ months minimum for best flavor", "Carbonate high (3.0-3.5 volumes) - traditional!", "Serve in chalice at 50-55°F"],
      donts: ["Don't rush - fermentation and aging take time", "Don't under-pitch yeast on high gravity", "Don't drink young - needs aging", "Don't under-carbonate"],
      water_chemistry: "Soft water best: Ca 50-75ppm, low sulfate (under 75ppm), slightly higher chloride (75-100ppm) for smooth mouthfeel."
    },
    food_pairing: ["Moules frites", "Triple cream brie", "Roasted duck", "Crème brûlée", "Spicy Thai"],
    notes: "A classic Belgian Tripel - deceptively strong (9%+), complex, and beautiful golden color. The clear candi sugar boosts alcohol while keeping the body light and dry. Belgian yeast creates spicy phenols and fruity esters. This beer demands patience - properly aged Tripels are transcendent!"
  },

  "oktoberfest-marzen": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "Munich Malt", amount: "8", unit: "lb"},
          {name: "Vienna Malt", amount: "3", unit: "lb"},
          {name: "Pilsner Malt", amount: "2", unit: "lb"},
          {name: "Melanoidin Malt", amount: "8", unit: "oz"}
        ],
        instructions: [
          "PREP (30 min before): Heat 4.5 gallons strike water to 161°F for multi-step mash.",
          "MASH IN: Add grains slowly while stirring. Target first rest: 148°F for 20 minutes (beta amylase rest).",
          "SECOND REST: Raise to 158°F and hold for 40 minutes (alpha amylase rest for body).",
          "MASH OUT: Raise to 168°F over 10 minutes.",
          "VORLAUF: Recirculate until wort runs clear.",
          "SPARGE: Rinse grains with 170°F water. Collect 7 gallons for 90-minute boil.",
          "BOIL: Bring to rolling boil. Boil for 90 minutes - traditional for lagers.",
          "HOP ADDITIONS: Add Hallertau at 60 min, Tettnang at 15 min. Noble hops only for authentic character.",
          "FLAMEOUT: Turn off heat, let settle 10 minutes.",
          "CHILL: Cool rapidly to 48°F if possible - crucial for lagers!",
          "TRANSFER: Move to fermenter, leaving all trub behind. Clarity is important for lagers.",
          "MINIMAL AERATION: Shake gently for 30 seconds only - lagers need less oxygen than ales.",
          "PITCH YEAST: Add lager yeast at 48-50°F. Pitch 1.5-2x normal rate for lagers!",
          "TEMPERATURE CONTROL: Hold at 50-52°F throughout primary fermentation. This is critical!"
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Munich LME", amount: "7", unit: "lb"},
          {name: "Vienna LME", amount: "2", unit: "lb"},
          {name: "Melanoidin Malt (steep)", amount: "8", unit: "oz"}
        ],
        instructions: [
          "PREP: Heat 3 gallons water to 155°F.",
          "STEEP GRAINS: Add Melanoidin malt in grain bag. Steep at 150-155°F for 30 minutes for rich malt character.",
          "REMOVE GRAINS: Lift bag and let drip.",
          "BRING TO BOIL: Heat to boiling, then remove from heat.",
          "ADD EXTRACTS: Stir in Munich and Vienna LME completely - lots of extract!",
          "RETURN TO BOIL: Bring back to rolling boil carefully.",
          "90 MIN BOIL: Add Hallertau hops. Start timer. Traditional lager boil length.",
          "45 MIN: Monitor boil temperature.",
          "15 MIN: Add Tettnang hops for noble hop character.",
          "0 MIN (FLAMEOUT): Turn off heat, let settle 10 minutes.",
          "CHILL: Cool to 48°F as quickly as possible - absolutely critical for lagers!",
          "TOP UP: Transfer to fermenter, add cool water to 5 gallons.",
          "MINIMAL AERATION: Shake gently for 30 seconds.",
          "PITCH YEAST: Add lager yeast (double normal amount!) at 48-50°F. Temperature is everything!",
          "LAGERING: After primary fermentation completes (2-3 weeks), lager at 34-38°F for 6-8 weeks minimum."
        ]
      }
    ],
    hops: [
      {name: "Hallertau", amount: "1.5", unit: "oz", time: "60 min", use: "Bittering"},
      {name: "Tettnang", amount: "1", unit: "oz", time: "15 min", use: "Flavor"}
    ],
    yeast: [
      {name: "Saflager W-34/70", type: "Dry", attenuation: "80-84%", notes: "Clean German lager strain - industry standard"},
      {name: "WLP833 German Bock Lager", type: "Liquid", attenuation: "73-77%", notes: "Malty lager character, great for Marzens"}
    ],
    fermentation: [
      {step: "Primary Fermentation", temp: "50-52°F", duration: "2-3 weeks", notes: "Cold fermentation is mandatory! Don't go above 55°F or you'll get ale-like flavors. Fermentation will be slow and steady."},
      {step: "Diacetyl Rest", temp: "65°F", duration: "2-3 days", notes: "After fermentation completes, raise temp to clean up any buttery flavors before lagering."},
      {step: "Lagering", temp: "34-38°F", duration: "6-8 weeks minimum", notes: "This is where the magic happens! Long cold storage creates smooth, clean lager character. Be patient!"},
      {step: "Packaging", temp: "Room temp", duration: "2 weeks", notes: "Carbonate to 2.4-2.6 volumes. This beer is worth the wait - peak flavor at 3-4 months total!"}
    ],
    tips: {
      dos: ["Lager 6+ weeks minimum for authentic character", "Ferment cold - temperature control is critical", "Pitch double the normal yeast amount", "Be patient - this beer takes 3+ months start to finish"],
      donts: ["Don't ferment warm - ruins lager character", "Don't rush lagering phase", "Don't under-pitch yeast", "Don't serve too cold - 48-52°F is ideal"],
      water_chemistry: "Munich-style water: Ca 75-100ppm, moderate alkalinity for malt character, sulfate and chloride balanced (50-75ppm each)."
    },
    food_pairing: ["Bratwurst", "Roast chicken", "Bavarian pretzels", "Smoked gouda", "Apple strudel"],
    notes: "A traditional Bavarian Oktoberfest/Marzen lager with rich malt character, toasty notes, and clean finish. The high proportion of Munich and Vienna malts creates beautiful amber color and bread-like malt complexity. This is a time investment - requires cold fermentation and months of lagering - but the result is spectacular!"
  }
};

async function updateRecipes() {
  console.log('\n=== Enhancing ALL Recipes with Detailed Instructions ===\n');

  for (const [slug, data] of Object.entries(enhancedRecipes)) {
    try {
      const findRes = await fetch(
        `${DIRECTUS_URL}/items/recipes?filter[slug][_eq]=${slug}&fields=id`,
        { headers: { 'Authorization': `Bearer ${TOKEN}` } }
      );
      const found = await findRes.json();

      if (!found.data || found.data.length === 0) {
        console.log(`⚠️  Not found: ${slug}`);
        continue;
      }

      const id = found.data[0].id;

      const updateRes = await fetch(`${DIRECTUS_URL}/items/recipes/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (updateRes.ok) {
        console.log(`✅ Enhanced: ${slug}`);
        console.log(`   - All-Grain: ${data.methods[0].instructions.length} detailed steps`);
        console.log(`   - Extract: ${data.methods[1].instructions.length} detailed steps`);
        console.log(`   - Fermentation: ${data.fermentation.length} stages with notes`);
        console.log(`   - Water chemistry and brewer's notes included\n`);
      } else {
        console.log(`❌ Failed: ${slug} - ${await updateRes.text()}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${slug} - ${error.message}`);
    }
  }

  console.log('✅ All recipes enhanced with detailed instructions!\n');
}

updateRecipes();
