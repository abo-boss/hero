
const axios = require('axios');

async function parseZaraV2() {
  try {
    const url = 'https://zara.faces.site/ai';
    const response = await axios.get(url);
    const html = response.data;

    const startMarker = 'rows:[';
    const idx = html.indexOf(startMarker);
    if (idx === -1) return console.log('rows not found');

    let bracketCount = 0;
    let endIdx = -1;
    let foundStart = false;

    // Start scanning from "rows:["
    // actually, rows:[ starts the array.
    for (let i = idx + 5; i < html.length; i++) {
        if (html[i] === '[') bracketCount++;
        if (html[i] === ']') {
            if (bracketCount === 0) {
                endIdx = i + 1;
                break;
            }
            bracketCount--;
        }
    }

    if (endIdx === -1) return console.log('End of array not found');

    const arrayStr = html.substring(idx + 5, endIdx);
    
    // Evaluate it. We might need to mock variables if they exist, but it looks like pure data.
    // However, `eval` might fail if there are unquoted keys that are reserved words, etc.
    // In JS object literals, unquoted keys are fine.
    // We need to make sure the string is clean.
    
    // The snippet showed escaped quotes: `id:\"vid1\"`. 
    // If the HTML source has `id:\"vid1\"`, that means it's inside a string already?
    // "completeCollectionData:{..."
    // If the whole thing is inside a string (e.g. `self.__next_f.push([..., "...."])`), then we need to unescape it first.
    
    // Let's check if the raw html has `\"` or just `"`.
    // In `extract-deep.js` output: `content:\"Watch on LongCut\"`.
    // This implies the whole data structure is indeed inside a JSON string or JS string.
    // So we need to unescape it first! `JSON.parse` the outer string if possible, or just replace `\"` with `"`.
    
    let cleanStr = arrayStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    // Also remove any `\` before `/` if present: `\/` -> `/`
    cleanStr = cleanStr.replace(/\\\//g, '/');

    // Now try eval
    let videos = [];
    try {
        videos = eval(cleanStr);
    } catch (e) {
        console.log('Eval failed, trying to fix syntax...');
        // Maybe some other escapes?
        // Let's print the first 100 chars
        console.log(cleanStr.substring(0, 100));
        return;
    }

    console.log(`Extracted ${videos.length} videos.`);
    
    // Filter by "First Big Title". 
    // Let's look at the tags.
    const tags = {};
    videos.forEach(v => {
        const t = v.tags || 'Uncategorized';
        tags[t] = (tags[t] || 0) + 1;
    });
    console.log('Tags distribution:', tags);

    // If "Fundamentals" is the first tag group, we select those.
    // Or just print the first 5 titles to let the user decide or I decide.
    videos.slice(0, 5).forEach(v => console.log(`- [${v.tags}] ${v.title}`));

    // Save to file for seeding
    const fs = require('fs');
    fs.writeFileSync('zara-videos.json', JSON.stringify(videos, null, 2));

  } catch (error) {
    console.error(error);
  }
}

parseZaraV2();
