const DIRECTUS_URL = 'https://admin.thecrackedgrain.com';
const TOKEN = process.env.DIRECTUS_API_TOKEN;

if (!TOKEN) {
  console.error('Set DIRECTUS_API_TOKEN');
  process.exit(1);
}

const recipes = {
  "elder-statesman-dipa": {
    methods: [{"type":"All-Grain","fermentables":[{"name":"American 2-Row","amount":"14","unit":"lb"},{"name":"Munich Malt","amount":"1","unit":"lb"},{"name":"Caramel 40L","amount":"8","unit":"oz"},{"name":"Dextrose","amount":"1","unit":"lb"}],"instructions":["Mash at 149°F for 75 minutes","Add dextrose last 15 min"]}],
    hops: [{"name":"Columbus","amount":"2","unit":"oz","time":"60 min","use":"Bittering"},{"name":"Centennial","amount":"1","unit":"oz","time":"15 min","use":"Flavor"},{"name":"Citra","amount":"2","unit":"oz","time":"5 min","use":"Aroma"},{"name":"Mosaic","amount":"2","unit":"oz","time":"Dry hop","use":"Dry Hop"}],
    yeast: [{"name":"Safale US-05","type":"Dry","attenuation":"78-82%","notes":"Clean, lets hops shine"}],
    fermentation: [{"step":"Primary","temp":"66-68°F","duration":"10-14 days"},{"step":"Dry hop","temp":"66°F","duration":"5 days"}],
    tips: {"dos":["Use fresh hops","Drink fresh"],"donts":["Don't over-bitter","Don't age"]}
  },
  "dublin-dry-stout": {
    methods: [{"type":"All-Grain","fermentables":[{"name":"Maris Otter","amount":"7","unit":"lb"},{"name":"Roasted Barley","amount":"1","unit":"lb"},{"name":"Flaked Barley","amount":"1","unit":"lb"}],"instructions":["Mash at 152°F for 60 minutes","Sparge with 170°F water"]}],
    hops: [{"name":"East Kent Goldings","amount":"1.5","unit":"oz","time":"60 min","use":"Bittering"},{"name":"Fuggle","amount":"0.5","unit":"oz","time":"15 min","use":"Flavor"}],
    yeast: [{"name":"Safale S-04","type":"Dry","attenuation":"72-78%","notes":"Classic English ale yeast"}],
    fermentation: [{"step":"Primary","temp":"65-68°F","duration":"7-10 days"},{"step":"Conditioning","temp":"65°F","duration":"2 weeks"}],
    tips: {"dos":["Serve on nitro if possible","Keep fermentation cool"],"donts":["Don't over-carbonate"]}
  },
  "blue-ozark-moon": {
    methods: [{"type":"All-Grain","fermentables":[{"name":"Pilsner Malt","amount":"5","unit":"lb"},{"name":"White Wheat Malt","amount":"3","unit":"lb"},{"name":"Flaked Oats","amount":"1","unit":"lb"}],"instructions":["Mash at 150°F for 60 minutes","Add rice hulls"]}],
    hops: [{"name":"Saaz","amount":"1","unit":"oz","time":"60 min","use":"Bittering"}],
    yeast: [{"name":"Safbrew T-58","type":"Dry","attenuation":"75-80%","notes":"Spicy Belgian character"}],
    fermentation: [{"step":"Primary","temp":"65-70°F","duration":"7 days"}],
    tips: {"dos":["Add coriander and orange peel at 5 min","Serve cold"],"donts":["Don't over-spice"]}
  },
  "bavarian-hefeweizen": {
    methods: [{"type":"All-Grain","fermentables":[{"name":"White Wheat Malt","amount":"5","unit":"lb"},{"name":"Pilsner Malt","amount":"4","unit":"lb"},{"name":"Munich Malt","amount":"8","unit":"oz"}],"instructions":["Single infusion at 152°F for 60 minutes"]}],
    hops: [{"name":"Hallertau","amount":"1","unit":"oz","time":"60 min","use":"Bittering"},{"name":"Tettnang","amount":"0.5","unit":"oz","time":"15 min","use":"Flavor"}],
    yeast: [{"name":"Safbrew WB-06","type":"Dry","attenuation":"86-90%","notes":"Banana and clove character"}],
    fermentation: [{"step":"Primary","temp":"62-68°F","duration":"5-7 days"}],
    tips: {"dos":["Ferment cool for clove, warm for banana"],"donts":["Don't filter"]}
  },
  "spotted-hog-cream-ale": {
    methods: [{"type":"All-Grain","fermentables":[{"name":"American 2-Row","amount":"7","unit":"lb"},{"name":"Flaked Corn","amount":"1.5","unit":"lb"},{"name":"Carapils","amount":"8","unit":"oz"}],"instructions":["Mash at 150°F for 60 minutes"]}],
    hops: [{"name":"Cluster","amount":"1","unit":"oz","time":"60 min","use":"Bittering"},{"name":"Liberty","amount":"0.5","unit":"oz","time":"5 min","use":"Aroma"}],
    yeast: [{"name":"Safale US-05","type":"Dry","attenuation":"78-82%","notes":"Clean American profile"}],
    fermentation: [{"step":"Primary","temp":"60-65°F","duration":"10-14 days"},{"step":"Cold crash","temp":"35°F","duration":"3-5 days"}],
    tips: {"dos":["Ferment cool","Cold crash for clarity"],"donts":["Don't use strong hops"]}
  },
  "razorback-slobber": {
    methods: [{"type":"All-Grain","fermentables":[{"name":"Maris Otter","amount":"9","unit":"lb"},{"name":"Crystal 60L","amount":"1","unit":"lb"},{"name":"Chocolate Malt","amount":"8","unit":"oz"}],"instructions":["Mash at 154°F for 60 minutes"]}],
    hops: [{"name":"Northern Brewer","amount":"1.5","unit":"oz","time":"60 min","use":"Bittering"},{"name":"Willamette","amount":"0.5","unit":"oz","time":"15 min","use":"Flavor"},{"name":"Fuggle","amount":"0.5","unit":"oz","time":"5 min","use":"Aroma"}],
    yeast: [{"name":"Safale S-04","type":"Dry","attenuation":"72-78%","notes":"English character"}],
    fermentation: [{"step":"Primary","temp":"65-68°F","duration":"7-10 days"}],
    tips: {"dos":["Let it condition"],"donts":["Don't rush fermentation"]}
  },
  "belgian-tripel": {
    methods: [{"type":"All-Grain","fermentables":[{"name":"Belgian Pilsner Malt","amount":"12","unit":"lb"},{"name":"White Wheat Malt","amount":"1","unit":"lb"},{"name":"Clear Candi Sugar","amount":"1.5","unit":"lb"}],"instructions":["Mash at 148°F for 90 minutes","Add candi sugar last 15 min"]}],
    hops: [{"name":"Styrian Goldings","amount":"2","unit":"oz","time":"60 min","use":"Bittering"},{"name":"Saaz","amount":"1","unit":"oz","time":"15 min","use":"Flavor"}],
    yeast: [{"name":"Safbrew BE-256","type":"Dry","attenuation":"82-86%","notes":"High gravity specialist"}],
    fermentation: [{"step":"Primary","temp":"64-72°F","duration":"14-21 days"},{"step":"Secondary","temp":"65°F","duration":"2-4 weeks"}],
    tips: {"dos":["Pitch plenty of yeast","Age 2+ months"],"donts":["Don't rush"]}
  },
  "oktoberfest-marzen": {
    methods: [{"type":"All-Grain","fermentables":[{"name":"Munich Malt","amount":"8","unit":"lb"},{"name":"Vienna Malt","amount":"3","unit":"lb"},{"name":"Pilsner Malt","amount":"2","unit":"lb"}],"instructions":["Mash at 152°F for 60 minutes","90 minute boil"]}],
    hops: [{"name":"Hallertau","amount":"1.5","unit":"oz","time":"60 min","use":"Bittering"},{"name":"Tettnang","amount":"1","unit":"oz","time":"15 min","use":"Flavor"}],
    yeast: [{"name":"Saflager W-34/70","type":"Dry","attenuation":"80-84%","notes":"Clean German lager"}],
    fermentation: [{"step":"Primary","temp":"50-52°F","duration":"2-3 weeks"},{"step":"Lagering","temp":"34°F","duration":"6-8 weeks"}],
    tips: {"dos":["Lager 6+ weeks"],"donts":["Don't ferment warm"]}
  }
};

async function updateRecipes() {
  console.log('Updating recipes...\n');

  for (const [slug, data] of Object.entries(recipes)) {
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
        console.log(`✅ Updated: ${slug}`);
      } else {
        console.log(`❌ Failed: ${slug} - ${await updateRes.text()}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${slug} - ${error.message}`);
    }
  }
  console.log('\nDone!');
}

updateRecipes();
