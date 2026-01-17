
const axios = require('axios');

async function extractDeepData() {
  try {
    const url = 'https://zara.faces.site/ai';
    const response = await axios.get(url);
    const html = response.data;

    // Look for the specific data structure we saw
    const marker = 'completeCollectionData';
    const idx = html.indexOf(marker);
    
    if (idx === -1) {
        console.log('Marker not found.');
        return;
    }

    console.log(`Found marker at ${idx}`);
    // Grab a chunk around it to see the structure
    const chunk = html.substring(idx - 100, idx + 50000); // Grab a big chunk
    
    // It seems to be inside a JS execution, maybe self.__next_f.push([1,"..."])
    // The data might be escaped JSON inside a string.
    
    // Let's try to find video links directly in this chunk
    // Regex for youtube links
    const ytRegex = /https:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+/g;
    const matches = chunk.match(ytRegex);
    
    if (matches) {
        console.log(`Found ${matches.length} matches in the chunk.`);
        // Remove duplicates
        const uniqueLinks = [...new Set(matches)];
        console.log('Unique links:', uniqueLinks);
        
        // We need titles. Titles are likely near the links.
        // Structure seems to be: { title: "...", url: "..." }
        // Let's dump the first 1000 chars of the chunk to understand the JSON format
        console.log('\n--- Chunk Start ---');
        console.log(chunk.substring(0, 1000));
    } else {
        console.log('No YouTube links in chunk.');
    }

  } catch (error) {
    console.error(error);
  }
}

extractDeepData();
