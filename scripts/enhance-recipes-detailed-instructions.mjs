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
  }
};

async function updateRecipes() {
  console.log('\n=== Enhancing Recipes with Detailed Instructions ===\n');

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
        console.log(`   - Water chemistry guidelines included`);
        console.log(`   - Brewer's notes added`);
      } else {
        console.log(`❌ Failed: ${slug} - ${await updateRes.text()}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${slug} - ${error.message}`);
    }
  }

  console.log('\n✅ Recipe enhancement complete!\n');
}

updateRecipes();
