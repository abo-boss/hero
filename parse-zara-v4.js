
const axios = require('axios');
const fs = require('fs');

async function parseZaraV4() {
  try {
    const url = 'https://zara.faces.site/ai';
    const response = await axios.get(url);
    const html = response.data;

    const marker = 'completeCollectionData';
    const markerIdx = html.indexOf(marker);
    if (markerIdx === -1) return console.log('marker not found');

    const rowsMarker = 'rows:[';
    const idx = html.indexOf(rowsMarker, markerIdx);
    if (idx === -1) return console.log('rows not found');

    // Grab a big chunk
    const chunk = html.substring(idx, idx + 100000);
    
    // Regex for objects
    // Pattern: {id:"...",...url:"...",...}
    // We want to capture the whole object content
    // Since objects are separated by },{ or start with [{ and end with }]
    // Let's use a regex that matches {id:.*?url:".*?"} roughly
    
    // Unescape first!
    let cleanChunk = chunk.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\\//g, '/');
    
    // Now regex. keys are id, title, description, channel, tags, videoId, duration, url, tldwUrl, isFeatured
    // Let's match `url:"(https://www.youtube.com/watch?v=.*?)"` and capture surrounding info if possible.
    // Or just iterate over the string finding `{id:"` and parsing manually.
    
    const videos = [];
    const objectRegex = /\{id:"(.*?)",title:"(.*?)",description:"(.*?)",channel:"(.*?)",tags:"(.*?)",videoId:".*?",duration:".*?",url:"(.*?)"/g;
    
    let match;
    while ((match = objectRegex.exec(cleanChunk)) !== null) {
        let title = match[2];
        // Clean title HTML
        title = title.replace(/<[^>]*>/g, '');
        // Decode unicode
        title = JSON.parse(`"${title}"`); // A bit risky but handles \uXXXX
        
        videos.push({
            id: match[1],
            title: title,
            description: match[3],
            channel: match[4],
            tags: match[5],
            url: match[6]
        });
    }

    console.log(`Extracted ${videos.length} videos.`);
    
    // Filter Fundamentals
    const fundamentals = videos.filter(v => v.tags.includes('Fundamentals'));
    console.log(`Fundamentals: ${fundamentals.length}`);
    
    // Save
    fs.writeFileSync('zara-final.json', JSON.stringify(fundamentals.length > 0 ? fundamentals : videos, null, 2));

  } catch (error) {
    console.error(error);
  }
}

parseZaraV4();
