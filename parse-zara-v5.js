
const axios = require('axios');
const fs = require('fs');

async function parseZaraV5() {
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

    const chunk = html.substring(idx, idx + 100000);
    let cleanChunk = chunk.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\\//g, '/');
    
    const videos = [];
    const objectRegex = /\{id:"(.*?)",title:"(.*?)",description:"(.*?)",channel:"(.*?)",tags:"(.*?)",videoId:".*?",duration:".*?",url:"(.*?)"/g;
    
    let match;
    while ((match = objectRegex.exec(cleanChunk)) !== null) {
        let title = match[2];
        // Remove html tags
        title = title.replace(/<[^>]*>/g, '');
        // Fix unicode if present (simple ones)
        title = title.replace(/\\u003c/g, '<').replace(/\\u003e/g, '>');
        
        videos.push({
            title: title,
            description: match[3],
            channel: match[4],
            tags: match[5],
            url: match[6]
        });
    }

    console.log(`Extracted ${videos.length} videos.`);
    
    const fundamentals = videos.filter(v => v.tags.includes('Fundamentals'));
    console.log(`Fundamentals: ${fundamentals.length}`);
    
    fs.writeFileSync('zara-final.json', JSON.stringify(fundamentals.length > 0 ? fundamentals : videos, null, 2));

  } catch (error) {
    console.error(error);
  }
}

parseZaraV5();
