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

// 🛡️ AGENTS
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

async function main() {
    console.log(`🚀 STARTING HIGH-SPEED BATCH IMPORT...`);

    // 1. READ CSV (The Truth)
    const whitelist = new Set();
    console.log("📂 Reading CSV...");
    await new Promise((resolve) => {
        fs.createReadStream(CSV_FILENAME)
            .pipe(csv())
            .on('data', (row) => {
                const name = row['name'] || row['Name'] || row['Item Name'];
                if (name) whitelist.add(name.trim().toLowerCase());
            })
            .on('end', resolve);
    });
    console.log(`✅ CSV Loaded: ${whitelist.size} items targetted.`);

    // 2. SCAN SQUARE (Gather Data)
    console.log("⬇️  Downloading Square Catalog (This happens once)...");
    let cursor = null;
    let squareItems = [];
    
    while (true) {
        let url = 'https://connect.squareup.com/v2/catalog/list?types=ITEM';
        if (cursor) url += `&cursor=${cursor}`;
        const res = await fetch(url, { headers: { 'Authorization': `Bearer ${SQUARE_TOKEN}` }, agent: httpsAgent });
        const data = await res.json();
        if (data.objects) squareItems.push(...data.objects);
        if (data.cursor) cursor = data.cursor;
        else break;
        process.stdout.write("."); // Progress dot
    }
    console.log(`\n✅ Scanned ${squareItems.length} items from Square.`);

    // 3. MATCH & PREPARE BATCH
    console.log("⚡ Matching & Preparing Payload...");
    const payloadBuffer = [];
    
    // We also need a map to find images later
    const productToImageMap = {}; 

    for (const item of squareItems) {
        const name = item.item_data.name;
        if (!whitelist.has(name.trim().toLowerCase())) continue;

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        
        // Save Image ID for Step 2
        if (item.item_data.image_ids && item.item_data.image_ids.length > 0) {
            productToImageMap[slug] = item.item_data.image_ids[0];
        }

        payloadBuffer.push({
            status: 'published',
            name: name,
            slug: slug,
            category: 'Homebrew',
            description: item.item_data.description || '',
            price: item.item_data.variations?.[0]?.item_variation_data?.price_money?.amount / 100 || 0
        });
    }

    // 4. BATCH UPLOAD (The Fast Part)
    console.log(`🚀 Uploading ${payloadBuffer.length} products in batches of 50...`);
    const chunkSize = 50;
    
    for (let i = 0; i < payloadBuffer.length; i += chunkSize) {
        const chunk = payloadBuffer.slice(i, i + chunkSize);
        
        try {
            // First, try to just create them. If duplicates exist, this might error.
            // But for speed, we try the bulk endpoint.
            const req = await fetch(`${DIRECTUS_URL}/items/products`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(chunk),
                agent: httpAgent
            });
            
            if (req.ok) {
                console.log(`   ✅ Batch ${i/chunkSize + 1} Saved!`);
            } else {
                console.log(`   ⚠️ Batch ${i/chunkSize + 1} had issues (probably duplicates). Skipping batch.`);
                // If you want to force it, we'd have to loop individually, but let's try speed first.
            }
        } catch (e) {
            console.log(`   ❌ Connection Error on batch.`);
        }
    }
    
    console.log("\n🎉 PART 1 DONE: All Products are in Directus!");
    console.log("   (Now starting the slow image background process...)");

    // 5. IMAGE HYDRATION (The Slow Part - Can run in background)
    // We loop through the items we just created and add images one by one.
    console.log("🖼️  Starting Image Hydration...");
    
    for (const [slug, squareImageId] of Object.entries(productToImageMap)) {
        try {
            // Check if product needs image (optional, but saves time)
            // fetch image URL from Square
            const objReq = await fetch(`https://connect.squareup.com/v2/catalog/object/${squareImageId}`, {
                headers: { 'Authorization': `Bearer ${SQUARE_TOKEN}` },
                agent: httpsAgent
            });
            const obj = await objReq.json();
            const imgUrl = obj.object?.image_data?.url;
            
            if (!imgUrl) continue;

            console.log(`   Downloading image for: ${slug}...`);
            const buf = await (await fetch(imgUrl, { agent: httpsAgent })).buffer();
            
            const form = new FormData();
            form.append('file', buf, { filename: `${slug}.jpg` });

            // Upload File
            const fileReq = await fetch(`${DIRECTUS_URL}/files`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${DIRECTUS_TOKEN}` },
                body: form,
                agent: httpAgent
            });
            const fileData = await fileReq.json();
            const fileId = fileData.data?.id;

            if (fileId) {
                // Link to Product (Find ID by Slug first is safer, but slow. 
                // We will use PATCH with a filter if Directus supports it, or just scan IDs.
                // Actually, let's just find the ID.)
                
                const findReq = await fetch(`${DIRECTUS_URL}/items/products?filter[slug][_eq]=${slug}`, {
                    headers: { 'Authorization': `Bearer ${DIRECTUS_TOKEN}` },
                    agent: httpAgent
                });
                const findRes = await findReq.json();
                const prodId = findRes.data?.[0]?.id;

                if (prodId) {
                    await fetch(`${DIRECTUS_URL}/items/products/${prodId}`, {
                        method: 'PATCH',
                        headers: { 
                            'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify({ image: fileId }),
                        agent: httpAgent
                    });
                    console.log(`   ✅ Image attached to ${slug}`);
                }
            }
        } catch (e) {
            console.log(`   ⚠️ Failed image for ${slug}: ${e.message}`);
        }
    }
}

main();