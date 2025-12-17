const fs = require('fs');
const csv = require('csv-parser');
const fetch = require('node-fetch');
const FormData = require('form-data');
const http = require('http');
const https = require('https');

// --- CONFIGURATION ---
const SQUARE_TOKEN = 'EAAAl656WlUHKxTWwlkx8Aj2Hj9DtyRwydoVNv5IuG51aoqR0J3s3cPm3pV3tCSC'; 
const DIRECTUS_TOKEN = '5KmoigBiCbbPPKdyVSHW48EzrNk5lIzr'; 
const DIRECTUS_URL = 'http://165.245.139.94:8055';
const CSV_FILENAME = 'homebrew_products.csv';

// 🛡️ NETWORK AGENTS
// We use keepAlive: false for Directus to prevent "stuck" connections on 503 errors
let httpAgent = new http.Agent({ keepAlive: false }); 
let httpsAgent = new https.Agent({ keepAlive: true });

function refreshAgents() {
    try { httpAgent.destroy(); } catch(e) {}
    try { httpsAgent.destroy(); } catch(e) {}
    httpAgent = new http.Agent({ keepAlive: false });
    httpsAgent = new https.Agent({ keepAlive: true });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log(`🚀 STARTING "PATIENT" IMAGE REPAIR...`);

    // 1. READ CSV
    const whitelist = new Set();
    console.log("📂 Reading CSV...");
    if (!fs.existsSync(CSV_FILENAME)) { console.log("❌ CSV not found!"); return; }
    
    await new Promise((resolve) => {
        fs.createReadStream(CSV_FILENAME)
            .pipe(csv())
            .on('data', (row) => {
                const name = row['name'] || row['Name'] || row['Item Name'];
                if (name) whitelist.add(name.trim().toLowerCase());
            })
            .on('end', resolve);
    });

    // 2. SCAN SQUARE
    console.log("⬇️  Fetching Square Image Map...");
    let cursor = null;
    const slugToImageId = {};
    
    while (true) {
        let url = 'https://connect.squareup.com/v2/catalog/list?types=ITEM';
        if (cursor) url += `&cursor=${cursor}`;
        try {
            const res = await fetch(url, { headers: { 'Authorization': `Bearer ${SQUARE_TOKEN}` }, agent: httpsAgent });
            const data = await res.json();
            
            if (data.objects) {
                data.objects.forEach(item => {
                    const name = item.item_data.name;
                    if (whitelist.has(name.trim().toLowerCase())) {
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                        if (item.item_data.image_ids && item.item_data.image_ids.length > 0) {
                            slugToImageId[slug] = item.item_data.image_ids[0];
                        }
                    }
                });
            }
            if (data.cursor) cursor = data.cursor;
            else break;
        } catch (e) { await sleep(2000); }
    }
    console.log(`✅ Found ${Object.keys(slugToImageId).length} available images.`);

    // 3. SCAN DIRECTUS
    console.log("🔍 Checking Directus for missing photos...");
    let products = [];
    try {
        const dReq = await fetch(`${DIRECTUS_URL}/items/products?limit=-1&fields=id,slug,image`, {
            headers: { 'Authorization': `Bearer ${DIRECTUS_TOKEN}` },
            agent: httpAgent
        });
        const dData = await dReq.json();
        products = dData.data || [];
    } catch (e) {
        console.log("❌ Failed to load products from Directus. Check connection.");
        return;
    }
    
    // Filter: Products with NO image, that DO have a match in Square
    const missingImages = products.filter(p => !p.image && slugToImageId[p.slug]);
    
    console.log(`⚡ ${products.length} total products.`);
    console.log(`🛠️  ${missingImages.length} need images. Starting repair...`);

    // 4. REPAIR LOOP
    let successCount = 0;
    
    for (const prod of missingImages) {
        const squareImgId = slugToImageId[prod.slug];
        console.log(`🔹 Fixing: ${prod.slug}`);

        let success = false;
        let attempt = 0;
        let delay = 5000; // Start with 5s delay on error

        while (!success && attempt < 4) {
            attempt++;
            try {
                // A. Download from Square (S3)
                // console.log("      Downloading...");
                const objReq = await fetch(`https://connect.squareup.com/v2/catalog/object/${squareImgId}`, {
                    headers: { 'Authorization': `Bearer ${SQUARE_TOKEN}` },
                    agent: httpsAgent
                });
                const obj = await objReq.json();
                const imgUrl = obj.object?.image_data?.url;

                if (!imgUrl) break; 

                const imgRes = await fetch(imgUrl, { agent: httpsAgent });
                if (!imgRes.ok) throw new Error(`Square Download Failed: ${imgRes.status}`);
                const buf = await imgRes.buffer();

                // B. Upload to Directus
                // console.log("      Uploading...");
                const form = new FormData();
                form.append('file', buf, { filename: `${prod.slug}.jpg` });

                const upReq = await fetch(`${DIRECTUS_URL}/files`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${DIRECTUS_TOKEN}` },
                    body: form,
                    agent: httpAgent
                });
                
                if (upReq.status === 503) {
                    throw new Error("Server 503 Overloaded");
                }
                if (!upReq.ok) throw new Error(`Upload Status ${upReq.status}`);

                const upJson = await upReq.json();
                const fileId = upJson.data?.id;

                // C. Link to Product
                if (fileId) {
                    await fetch(`${DIRECTUS_URL}/items/products/${prod.id}`, {
                        method: 'PATCH',
                        headers: { 
                            'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify({ image: fileId }),
                        agent: httpAgent
                    });
                    console.log(`   ✅ Fixed!`);
                    success = true;
                    successCount++;
                    // Wait 4 seconds after success to stay under the radar
                    await sleep(4000); 
                }

            } catch (err) {
                console.log(`   ⚠️ Attempt ${attempt} failed: ${err.message}`);
                
                // INTELLIGENT BACKOFF
                if (err.message.includes("503") || err.message.includes("hang up")) {
                    console.log(`      ⏳ Server is stressed. Sleeping ${delay/1000}s...`);
                    refreshAgents();
                    await sleep(delay);
                    delay *= 2; // Double the wait time for next retry (5s -> 10s -> 20s)
                } else {
                    await sleep(3000); // Standard wait for minor errors
                }
            }
        }
    }

    console.log(`\n🎉 FINISHED! Repaired ${successCount} images.`);
}

main();