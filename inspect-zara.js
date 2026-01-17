
const axios = require('axios');

async function inspectHtml() {
  try {
    const url = 'https://zara.faces.site/ai';
    console.log(`Fetching ${url}...`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = response.data;
    console.log('HTML length:', html.length);
    console.log('First 2000 chars:', html.substring(0, 2000));
    
    // Check if it contains "youtube.com"
    const ytMatch = html.match(/youtube\.com/g);
    console.log('YouTube occurrences:', ytMatch ? ytMatch.length : 0);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

inspectHtml();
