
const axios = require('axios');
const { parse } = require('node-html-parser');

async function analyzeStructure() {
  try {
    const url = 'https://zara.faces.site/ai';
    const response = await axios.get(url);
    const root = parse(response.data);

    // Get all text, but try to keep block structure
    // Since we can't easily visualize, let's look for common header tags again, maybe they are h1, h2, h3
    const headers = root.querySelectorAll('h1, h2, h3, h4, div[class*="header"], div[class*="title"]');
    
    console.log('--- Potential Headers ---');
    headers.forEach(h => {
        const text = h.text.trim();
        if (text.length > 0 && text.length < 100) {
            console.log(`[${h.tagName}] ${text}`);
        }
    });

    // Also look for YouTube links and their surrounding text
    const links = root.querySelectorAll('a');
    console.log('\n--- YouTube Links ---');
    let count = 0;
    for (const link of links) {
        const href = link.getAttribute('href');
        if (href && (href.includes('youtube.com') || href.includes('youtu.be'))) {
            // Try to find a previous sibling or parent's previous sibling that looks like a title
            console.log(`${++count}. ${link.text.trim()} -> ${href}`);
        }
    }

  } catch (error) {
    console.error(error);
  }
}

analyzeStructure();
