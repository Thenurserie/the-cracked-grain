const DIRECTUS_URL = 'https://admin.thecrackedgrain.com';
const TOKEN = process.env.DIRECTUS_API_TOKEN || '5KmoigBiCbbPPKdyVSHW48EzrNk5lIzr';

const completeRecipes = {
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
          "Mash at 149°F for 75 minutes (low temp for high attenuation)",
          "Sparge with 168°F water",
          "Add dextrose in last 15 minutes of boil"
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
          "Steep grains at 155°F for 20 minutes",
          "Remove grains, add extracts off heat",
          "Add dextrose in last 15 minutes of boil"
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
      {step: "Primary", temp: "66-68°F", duration: "10-14 days"},
      {step: "Dry hop", temp: "66°F", duration: "5 days"},
      {step: "Cold crash", temp: "35°F", duration: "2-3 days"}
    ],
    tips: {
      dos: ["Use fresh hops - preferably <6 months old", "Drink fresh - hop character fades quickly", "Oxygen-free transfers preserve hop aroma"],
      donts: ["Don't over-bitter - let late hops shine", "Don't age this beer - IPAs are meant fresh", "Don't skimp on dry hopping"]
    },
    food_pairing: ["Spicy wings", "Blue cheese burger", "Aged cheddar", "Carrot cake", "Thai curry"]
  },

  "dublin-dry-stout": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "Maris Otter", amount: "7", unit: "lb"},
          {name: "Roasted Barley", amount: "1", unit: "lb"},
          {name: "Flaked Barley", amount: "1", unit: "lb"}
        ],
        instructions: [
          "Mash at 152°F for 60 minutes",
          "Sparge with 170°F water",
          "Boil 60 minutes"
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Light LME", amount: "6", unit: "lb"},
          {name: "Roasted Barley (steep)", amount: "1", unit: "lb"},
          {name: "Flaked Barley (steep)", amount: "1", unit: "lb"}
        ],
        instructions: [
          "Steep grains at 155°F for 20 minutes",
          "Remove grains, add LME off heat",
          "Boil 60 minutes"
        ]
      }
    ],
    hops: [
      {name: "East Kent Goldings", amount: "1.5", unit: "oz", time: "60 min", use: "Bittering"},
      {name: "Fuggle", amount: "0.5", unit: "oz", time: "15 min", use: "Flavor"}
    ],
    yeast: [
      {name: "Safale S-04", type: "Dry", attenuation: "72-78%", notes: "Classic English ale yeast"},
      {name: "WLP004 Irish Ale", type: "Liquid", attenuation: "69-74%", notes: "Authentic Irish character"}
    ],
    fermentation: [
      {step: "Primary", temp: "65-68°F", duration: "7-10 days"},
      {step: "Conditioning", temp: "65°F", duration: "2 weeks"}
    ],
    tips: {
      dos: ["Serve on nitro if possible for creamy head", "Keep fermentation cool for clean flavor", "Use soft water or add calcium"],
      donts: ["Don't over-carbonate - keep it low", "Don't rush conditioning", "Don't serve too cold - diminishes flavor"]
    },
    food_pairing: ["Oysters", "Beef stew", "Sharp cheddar", "Chocolate cake", "Roasted vegetables"]
  },

  "blue-ozark-moon": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "Pilsner Malt", amount: "5", unit: "lb"},
          {name: "White Wheat Malt", amount: "3", unit: "lb"},
          {name: "Flaked Oats", amount: "1", unit: "lb"}
        ],
        instructions: [
          "Mash at 150°F for 60 minutes",
          "Add rice hulls to prevent stuck sparge",
          "Add coriander and orange peel at 5 minutes"
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Wheat LME", amount: "6", unit: "lb"},
          {name: "Flaked Oats (steep)", amount: "1", unit: "lb"}
        ],
        instructions: [
          "Steep oats at 155°F for 20 minutes",
          "Add LME off heat",
          "Add coriander and orange peel at 5 minutes"
        ]
      }
    ],
    hops: [
      {name: "Saaz", amount: "1", unit: "oz", time: "60 min", use: "Bittering"}
    ],
    yeast: [
      {name: "Safbrew T-58", type: "Dry", attenuation: "75-80%", notes: "Spicy Belgian character"},
      {name: "WLP400 Belgian Wit", type: "Liquid", attenuation: "72-76%", notes: "Classic witbier strain"}
    ],
    fermentation: [
      {step: "Primary", temp: "65-70°F", duration: "7 days"},
      {step: "Bottle/Keg", temp: "room temp", duration: "2 weeks carbonation"}
    ],
    tips: {
      dos: ["Add coriander and orange peel at 5 min", "Serve cold with orange wheel garnish", "Use Belgian yeast for authentic flavor"],
      donts: ["Don't over-spice - subtle is better", "Don't filter - haze is traditional", "Don't age - best fresh"]
    },
    food_pairing: ["Mussels", "Grilled fish", "Goat cheese salad", "Lemon tart", "Thai food"]
  },

  "bavarian-hefeweizen": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "White Wheat Malt", amount: "5", unit: "lb"},
          {name: "Pilsner Malt", amount: "4", unit: "lb"},
          {name: "Munich Malt", amount: "8", unit: "oz"}
        ],
        instructions: [
          "Single infusion at 152°F for 60 minutes",
          "Add rice hulls to prevent stuck sparge",
          "Boil 60 minutes"
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Wheat LME", amount: "6", unit: "lb"},
          {name: "Munich LME", amount: "8", unit: "oz"}
        ],
        instructions: [
          "Add extracts off heat to avoid scorching",
          "Boil 60 minutes",
          "Chill quickly to pitching temp"
        ]
      }
    ],
    hops: [
      {name: "Hallertau", amount: "1", unit: "oz", time: "60 min", use: "Bittering"},
      {name: "Tettnang", amount: "0.5", unit: "oz", time: "15 min", use: "Flavor"}
    ],
    yeast: [
      {name: "Safbrew WB-06", type: "Dry", attenuation: "86-90%", notes: "Banana and clove character"},
      {name: "WLP300 Hefeweizen Ale", type: "Liquid", attenuation: "72-76%", notes: "Classic German wheat strain"}
    ],
    fermentation: [
      {step: "Primary", temp: "62-68°F", duration: "5-7 days", notes: "Lower temp = more clove, higher temp = more banana"}
    ],
    tips: {
      dos: ["Ferment cool (62°F) for clove, warm (68°F) for banana", "Don't filter - haze is traditional", "Serve in tall wheat beer glass"],
      donts: ["Don't use Irish Moss - cloudiness is desired", "Don't bottle too early - let yeast settle", "Don't skip the lemon wheel garnish"]
    },
    food_pairing: ["Weisswurst", "Pretzels with mustard", "Lemon chicken", "Fruit tart", "Salads"]
  },

  "spotted-hog-cream-ale": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "American 2-Row", amount: "7", unit: "lb"},
          {name: "Flaked Corn", amount: "1.5", unit: "lb"},
          {name: "Carapils", amount: "8", unit: "oz"}
        ],
        instructions: [
          "Mash at 150°F for 60 minutes",
          "Sparge with 168°F water",
          "Boil 60 minutes"
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Extra Light LME", amount: "6", unit: "lb"},
          {name: "Flaked Corn (steep)", amount: "1.5", unit: "lb"}
        ],
        instructions: [
          "Steep corn and Carapils at 155°F for 20 minutes",
          "Add LME off heat",
          "Boil 60 minutes"
        ]
      }
    ],
    hops: [
      {name: "Cluster", amount: "1", unit: "oz", time: "60 min", use: "Bittering"},
      {name: "Liberty", amount: "0.5", unit: "oz", time: "5 min", use: "Aroma"}
    ],
    yeast: [
      {name: "Safale US-05", type: "Dry", attenuation: "78-82%", notes: "Clean American profile"},
      {name: "WLP001 California Ale", type: "Liquid", attenuation: "73-80%", notes: "Crisp, clean fermentation"}
    ],
    fermentation: [
      {step: "Primary", temp: "60-65°F", duration: "10-14 days"},
      {step: "Cold crash", temp: "35°F", duration: "3-5 days", notes: "For crystal-clear beer"}
    ],
    tips: {
      dos: ["Ferment cool for clean flavor", "Cold crash for clarity", "Lager if possible for authentic style"],
      donts: ["Don't use strong hops - keep subtle", "Don't rush fermentation", "Don't over-carbonate"]
    },
    food_pairing: ["Buffalo wings", "Burgers", "Pizza", "Fried chicken", "BBQ ribs"]
  },

  "razorback-slobber": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "Maris Otter", amount: "9", unit: "lb"},
          {name: "Crystal 60L", amount: "1", unit: "lb"},
          {name: "Chocolate Malt", amount: "8", unit: "oz"}
        ],
        instructions: [
          "Mash at 154°F for 60 minutes",
          "Sparge with 170°F water",
          "Boil 60 minutes"
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Light LME", amount: "7", unit: "lb"},
          {name: "Crystal 60L (steep)", amount: "1", unit: "lb"},
          {name: "Chocolate Malt (steep)", amount: "8", unit: "oz"}
        ],
        instructions: [
          "Steep grains at 155°F for 20 minutes",
          "Add LME off heat",
          "Boil 60 minutes"
        ]
      }
    ],
    hops: [
      {name: "Northern Brewer", amount: "1.5", unit: "oz", time: "60 min", use: "Bittering"},
      {name: "Willamette", amount: "0.5", unit: "oz", time: "15 min", use: "Flavor"},
      {name: "Fuggle", amount: "0.5", unit: "oz", time: "5 min", use: "Aroma"}
    ],
    yeast: [
      {name: "Safale S-04", type: "Dry", attenuation: "72-78%", notes: "English character"},
      {name: "WLP002 English Ale", type: "Liquid", attenuation: "63-70%", notes: "Malty, slightly fruity"}
    ],
    fermentation: [
      {step: "Primary", temp: "65-68°F", duration: "7-10 days"},
      {step: "Conditioning", temp: "room temp", duration: "2 weeks"}
    ],
    tips: {
      dos: ["Let it condition - improves with age", "Serve at cellar temp (50-55°F)", "Use English ale yeast"],
      donts: ["Don't rush fermentation", "Don't serve too cold", "Don't skip conditioning"]
    },
    food_pairing: ["Beef stew", "Roasted pork", "Sharp cheddar", "Pecan pie", "Smoked brisket"]
  },

  "belgian-tripel": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "Belgian Pilsner Malt", amount: "12", unit: "lb"},
          {name: "White Wheat Malt", amount: "1", unit: "lb"},
          {name: "Clear Candi Sugar", amount: "1.5", unit: "lb"}
        ],
        instructions: [
          "Mash at 148°F for 90 minutes (high fermentability)",
          "Sparge with 168°F water",
          "Add candi sugar in last 15 minutes of boil"
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Pilsen LME", amount: "9", unit: "lb"},
          {name: "Wheat LME", amount: "1", unit: "lb"},
          {name: "Clear Candi Sugar", amount: "1.5", unit: "lb"}
        ],
        instructions: [
          "Add LME off heat",
          "Add candi sugar in last 15 minutes of boil",
          "Boil 60 minutes total"
        ]
      }
    ],
    hops: [
      {name: "Styrian Goldings", amount: "2", unit: "oz", time: "60 min", use: "Bittering"},
      {name: "Saaz", amount: "1", unit: "oz", time: "15 min", use: "Flavor"}
    ],
    yeast: [
      {name: "Safbrew BE-256", type: "Dry", attenuation: "82-86%", notes: "High gravity specialist"},
      {name: "WLP530 Abbey Ale", type: "Liquid", attenuation: "75-80%", notes: "Classic Tripel strain"}
    ],
    fermentation: [
      {step: "Primary", temp: "64-72°F", duration: "14-21 days", notes: "Start cool, let rise slowly"},
      {step: "Secondary", temp: "65°F", duration: "2-4 weeks"},
      {step: "Bottle conditioning", temp: "room temp", duration: "4-6 weeks"}
    ],
    tips: {
      dos: ["Pitch plenty of yeast - high gravity beer", "Age 2+ months for best flavor", "Serve in goblet at 45-50°F"],
      donts: ["Don't rush this beer - patience rewarded", "Don't under-pitch yeast", "Don't skip bottle conditioning"]
    },
    food_pairing: ["Moules frites", "Roasted chicken", "Aged Gouda", "Crème brûlée", "Spicy sausage"]
  },

  "oktoberfest-marzen": {
    methods: [
      {
        type: "All-Grain",
        fermentables: [
          {name: "Munich Malt", amount: "8", unit: "lb"},
          {name: "Vienna Malt", amount: "3", unit: "lb"},
          {name: "Pilsner Malt", amount: "2", unit: "lb"}
        ],
        instructions: [
          "Mash at 152°F for 60 minutes",
          "Sparge with 168°F water",
          "90 minute boil for German tradition"
        ]
      },
      {
        type: "Extract",
        fermentables: [
          {name: "Munich LME", amount: "7", unit: "lb"},
          {name: "Vienna LME", amount: "3", unit: "lb"}
        ],
        instructions: [
          "Add extracts off heat",
          "90 minute boil",
          "Chill to lagering temp quickly"
        ]
      }
    ],
    hops: [
      {name: "Hallertau", amount: "1.5", unit: "oz", time: "60 min", use: "Bittering"},
      {name: "Tettnang", amount: "1", unit: "oz", time: "15 min", use: "Flavor"}
    ],
    yeast: [
      {name: "Saflager W-34/70", type: "Dry", attenuation: "80-84%", notes: "Clean German lager"},
      {name: "WLP820 Oktoberfest", type: "Liquid", attenuation: "65-73%", notes: "Traditional Märzen strain"}
    ],
    fermentation: [
      {step: "Primary", temp: "50-52°F", duration: "2-3 weeks"},
      {step: "Diacetyl rest", temp: "65°F", duration: "2 days"},
      {step: "Lagering", temp: "34°F", duration: "6-8 weeks"}
    ],
    tips: {
      dos: ["Lager for 6+ weeks minimum", "Use temp control - critical for lagers", "Brew in March for October"],
      donts: ["Don't ferment warm - ruins lager character", "Don't rush lagering phase", "Don't skip diacetyl rest"]
    },
    food_pairing: ["Bratwurst", "Roasted chicken", "Soft pretzels", "Apple strudel", "Schweinebraten"]
  }
};

async function updateAllRecipes() {
  console.log('\n=== Updating All 8 Recipes with Complete Data ===\n');

  let updated = 0;
  let failed = 0;

  for (const [slug, data] of Object.entries(completeRecipes)) {
    try {
      // Get recipe ID
      const findRes = await fetch(
        `${DIRECTUS_URL}/items/recipes?filter[slug][_eq]=${slug}&fields=id`,
        { headers: { 'Authorization': `Bearer ${TOKEN}` } }
      );
      const found = await findRes.json();

      if (!found.data || found.data.length === 0) {
        console.log(`⚠️  Not found: ${slug}`);
        failed++;
        continue;
      }

      const id = found.data[0].id;

      // Update recipe
      const updateRes = await fetch(`${DIRECTUS_URL}/items/recipes/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (updateRes.ok) {
        console.log(`✅ Updated: ${slug}`);
        console.log(`   - ${data.methods.length} brewing methods`);
        console.log(`   - ${data.hops.length} hop additions`);
        console.log(`   - ${data.yeast.length} yeast options`);
        console.log(`   - ${data.fermentation.length} fermentation steps`);
        console.log(`   - ${data.food_pairing.length} food pairings`);
        updated++;
      } else {
        const error = await updateRes.text();
        console.log(`❌ Failed: ${slug} - ${error}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ Error: ${slug} - ${error.message}`);
      failed++;
    }
  }

  console.log('\n=== Summary ===');
  console.log(`✅ Updated: ${updated}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${Object.keys(completeRecipes).length}\n`);
}

updateAllRecipes();
