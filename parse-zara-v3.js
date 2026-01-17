
const axios = require('axios');

async function parseZaraV3() {
  try {
    const url = 'https://zara.faces.site/ai';
    const response = await axios.get(url);
    const html = response.data;

    const marker = 'completeCollectionData';
    const markerIdx = html.indexOf(marker);
    if (markerIdx === -1) return console.log('marker not found');

    const rowsMarker = 'rows:[';
    const idx = html.indexOf(rowsMarker, markerIdx); // Find rows AFTER completeCollectionData
    if (idx === -1) return console.log('rows not found');

    // Find end of array
    let bracketCount = 0;
    let endIdx = -1;
    // Start after 'rows:'
    const startArr = idx + 5;
    
    for (let i = startArr; i < html.length; i++) {
        if (html[i] === '[') bracketCount++;
        if (html[i] === ']') {
            if (bracketCount === 0) {
                endIdx = i + 1;
                break;
            }
            bracketCount--;
        }
    }

    const arrayStr = html.substring(startArr, endIdx);
    
    // Unescape
    let cleanStr = arrayStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\\//g, '/');
    
    // Fix !0 and !1 to true/false for safety if eval doesn't like it (it should though)
    // Also remove HTML tags from titles/desc if present (cleaning later)
    
    let videos = [];
    try {
        videos = eval(cleanStr);
    } catch (e) {
        console.log('Eval error:', e.message);
        console.log('Snippet:', cleanStr.substring(0, 200));
        return;
    }

    console.log(`Extracted ${videos.length} videos.`);
    
    // Filter for "First Big Title"
    // Based on previous log: cat2 is "Fundamentals".
    // Let's assume the first group of videos with a specific tag is the target.
    // Or just filter by tag="Fundamentals" if it exists.
    
    const fundamentals = videos.filter(v => v.tags && v.tags.includes('Fundamentals'));
    console.log(`Found ${fundamentals.length} videos in 'Fundamentals'.`);
    
    if (fundamentals.length > 0) {
        console.log('First 3 Fundamentals:', fundamentals.slice(0, 3).map(v => v.title));
        // Save these
        const fs = require('fs');
        fs.writeFileSync('zara-fundamentals.json', JSON.stringify(fundamentals, null, 2));
    } else {
        // Fallback: maybe just take the first N videos?
        // Or check tags
        const tags = {};
        videos.forEach(v => {
            const t = v.tags || 'Uncategorized';
            tags[t] = (tags[t] || 0) + 1;
        });
        console.log('All tags:', tags);
        
        // Save all just in case
        const fs = require('fs');
        fs.writeFileSync('zara-all.json', JSON.stringify(videos, null, 2));
    }

  } catch (error) {
    console.error(error);
  }
}

parseZaraV3();
