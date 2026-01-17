
const axios = require('axios');

async function parseZara() {
  try {
    const url = 'https://zara.faces.site/ai';
    const response = await axios.get(url);
    const html = response.data;

    // Find rows array
    const startMarker = 'rows:[';
    const startIdx = html.indexOf(startMarker);
    if (startIdx === -1) {
        console.log('rows not found');
        return;
    }

    // Find the end of the array. It ends with ']' but there might be nested brackets.
    // However, looking at the snippet, it's a flat list of objects.
    // A simple heuristic: search for the next '],' (closing array followed by comma or end brace)
    // But since it's inside a string, it might be tricky.
    // Let's grab a safe chunk and try to verify JSON validity iteratively or just regex the objects.
    
    // The format is `rows:[{id:"...",...},{...}]`
    // Note: The keys in the snippet `id:"vid1"` are NOT quoted. This is NOT valid JSON. It's a JS object literal.
    // So `JSON.parse` won't work directly.
    // We need to use `eval` or regex. `eval` is dangerous but in this sandbox it's fine for parsing.
    // Or just regex for properties.
    
    const chunk = html.substring(startIdx + 5, startIdx + 50000); // skip 'rows:'
    
    // Let's assume it ends at the first `],` or `]}` that matches the nesting.
    // Since we saw `completeCollectionData`, it likely ends before the next property.
    
    // Let's use regex to find each object `{id:..., url:"..."}`
    // Pattern: \{id:".*?",.*?url:"(https:.*?youtube.*?)"
    
    const regex = /\{id:"(.*?)",title:"(.*?)",description:"(.*?)",channel:"(.*?)",tags:"(.*?)".*?url:"(.*?)"/g;
    
    let match;
    const videos = [];
    
    // We need to be careful with the regex because the order of keys might vary or some might be missing.
    // Better to match the whole object `{...}` and then extract fields.
    // Objects are separated by `},{`.
    
    // Let's split by `},{` (roughly)
    // First, find the closing `]`
    let bracketCount = 1;
    let endIdx = 0;
    for (let i = 0; i < chunk.length; i++) {
        if (chunk[i] === '[') bracketCount++;
        if (chunk[i] === ']') bracketCount--;
        if (bracketCount === 0) {
            endIdx = i;
            break;
        }
    }
    
    const arrayStr = chunk.substring(1, endIdx); // exclude starting `[`
    // This string contains objects separated by comma. 
    // `id:"vid1",title:"...",...`
    
    // Let's manually parse or regex extract.
    // We want title, url, description, tags.
    
    // Helper to extract value by key
    const extract = (str, key) => {
        const regex = new RegExp(`${key}:"(.*?)"`);
        const m = str.match(regex);
        return m ? m[1] : '';
    };
    
    // Split by `},{` is risky if string contains it.
    // But usually `{id:` is the start of a new object.
    const rawObjects = arrayStr.split('{id:');
    
    rawObjects.forEach(raw => {
        if (!raw.trim()) return;
        const fullRaw = 'id:' + raw; // Restore id key
        
        let title = extract(fullRaw, 'title');
        // Clean title (remove html tags)
        title = title.replace(/\\u003c.*?\\u003e/g, '').replace(/<.*?>/g, '');
        
        const url = extract(fullRaw, 'url');
        const description = extract(fullRaw, 'description');
        const tags = extract(fullRaw, 'tags');
        const channel = extract(fullRaw, 'channel');
        
        if (url && url.includes('youtube')) {
            videos.push({
                title,
                url,
                description,
                tags,
                channel
            });
        }
    });

    console.log(`Extracted ${videos.length} videos.`);
    console.log(videos);

  } catch (error) {
    console.error(error);
  }
}

parseZara();
