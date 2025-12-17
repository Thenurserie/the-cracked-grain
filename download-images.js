const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const fetch = require('node-fetch');
const crypto = require('crypto');

// --- CONFIGURATION ---
const SQUARE_TOKEN = 'EAAAl656WlUHKxTWwlkx8Aj2Hj9DtyRwydoVNv5IuG51aoqR0J3s3cPm3pV3tCSC'; 
const CSV_FILENAME = 'homebrew_products.csv';
const OUTPUT_DIR = './directus_sideload';

async function main() {
    console.log(`🚀 STARTING LOCAL DOWNLOAD (Target: 780 Items)...`);
    
    // Create output folders
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
    if (!fs.existsSync(path.join(OUTPUT_DIR, 'uploads'))) fs.mkdirSync(path.join(OUTPUT_DIR, 'uploads'));

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

    // 2. SCAN SQUARE
    console.log("⬇️  Fetching Image Map from Square...");
    let cursor = null;
    const itemsToProcess = [];
    
    while (true) {
        let url = 'https://connect.squareup.com/v2/catalog/list?types=ITEM';
        if (cursor) url += `&cursor=${cursor}`;
        const res = await fetch(url, { headers: { 'Authorization': `Bearer ${SQUARE_TOKEN}` } });
        const data = await res.json();
        
        if (data.objects) {
            data.objects.forEach(item => {
                const name = item.item_data.name;
                // Only download if it's in your CSV list
                if (whitelist.has(name.trim().toLowerCase())) {
                    if (item.item_data.image_ids && item.item_data.image_ids.length > 0) {
                        itemsToProcess.push({
                            name: name,
                            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                            imageId: item.item_data.image_ids[0]
                        });
                    }
                }
            });
        }
        if (data.cursor) cursor = data.cursor;
        else break;
        process.stdout.write(".");
    }
    console.log(`\n✅ Found ${itemsToProcess.length} images to download.`);

    // 3. DOWNLOAD & GENERATE SQL
    console.log("📦 Downloading images to your hard drive...");
    const sqlFile = fs.createWriteStream(path.join(OUTPUT_DIR, 'import_images.sql'));
    sqlFile.write("BEGIN;\n\n");

    let count = 0;
    for (const item of itemsToProcess) {
        try {
            const objReq = await fetch(`https://connect.squareup.com/v2/catalog/object/${item.imageId}`, {
                headers: { 'Authorization': `Bearer ${SQUARE_TOKEN}` }
            });
            const obj = await objReq.json();
            const imgUrl = obj.object?.image_data?.url;
            
            if (!imgUrl) continue;

            const fileId = crypto.randomUUID();
            const imgRes = await fetch(imgUrl);
            const buffer = await imgRes.buffer();
            
            // Save locally
            fs.writeFileSync(path.join(OUTPUT_DIR, 'uploads', fileId), buffer);

            // Write SQL
            const filename = `${item.slug}.jpg`;
            const filesize = buffer.length;
            
            // Create File Record
            sqlFile.write(`INSERT INTO directus_files (id, storage, filename_disk, filename_download, title, type, filesize, uploaded_on) VALUES ('${fileId}', 'local', '${fileId}', '${filename}', '${item.name.replace(/'/g, "''")}', 'image/jpeg', ${filesize}, '${new Date().toISOString()}');\n`);
            
            // Link to Product (Safe Update - won't break if product missing)
            sqlFile.write(`UPDATE products SET image = '${fileId}' WHERE slug = '${item.slug}';\n`);
            
            process.stdout.write(">");
            count++;
        } catch (e) {
            console.log(`❌ Error: ${e.message}`);
        }
    }

    sqlFile.write("\nCOMMIT;\n");
    sqlFile.end();

    console.log(`\n\n🎉 DONE! Saved ${count} images locally.`);
    console.log(`👉 Open folder '${OUTPUT_DIR}'`);
}

main();