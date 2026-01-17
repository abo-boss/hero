
const axios = require('axios');

async function extractLinks() {
  try {
    const url = 'https://zara.faces.site/ai';
    console.log(`Fetching ${url}...`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = response.data;
    
    // Regex to find YouTube links
    // Captures video ID
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/g;
    
    let match;
    const matches = [];
    const uniqueIds = new Set();

    while ((match = youtubeRegex.exec(html)) !== null) {
      const videoId = match[1];
      if (!uniqueIds.has(videoId)) {
        uniqueIds.add(videoId);
        matches.push({
          id: videoId,
          link: `https://www.youtube.com/watch?v=${videoId}`,
          index: match.index // Store position to help with "first section" logic
        });
      }
    }

    console.log(`Found ${matches.length} unique YouTube links.`);
    
    // Print first 10 matches to see if they look correct
    matches.slice(0, 10).forEach((m, i) => console.log(`${i+1}. ${m.link} (Index: ${m.index})`));

    // Try to find titles or structure
    // Since we can't easily parse the DOM of a JS-rendered site without a browser,
    // we rely on the order. Usually the "First Big Title" content comes first.
    
  } catch (error) {
    console.error('Error fetching page:', error.message);
  }
}

extractLinks();
