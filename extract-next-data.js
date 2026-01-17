
const axios = require('axios');

async function extractNextData() {
  try {
    const url = 'https://zara.faces.site/ai';
    const response = await axios.get(url);
    const html = response.data;

    // Find the NEXT_DATA script
    const startMarker = '<script id="__NEXT_DATA__" type="application/json">';
    const endMarker = '</script>';
    
    const startIndex = html.indexOf(startMarker);
    if (startIndex === -1) {
        console.log('__NEXT_DATA__ not found. Checking for other data patterns...');
        // Maybe it's not Next.js or uses a different ID.
        // Let's print all script tags or look for "youtube.com" context
        const ytIndex = html.indexOf('youtube.com');
        console.log('Context around first youtube.com:');
        console.log(html.substring(ytIndex - 200, ytIndex + 200));
        return;
    }

    const endIndex = html.indexOf(endMarker, startIndex);
    const jsonStr = html.substring(startIndex + startMarker.length, endIndex);
    
    const data = JSON.parse(jsonStr);
    console.log('Extracted Next.js Data!');
    
    // Now let's traverse this JSON to find links and headers
    // Usually data.props.pageProps...
    
    function findYouTubeLinks(obj, links = []) {
        if (!obj) return links;
        if (typeof obj === 'string') {
            if (obj.includes('youtube.com') || obj.includes('youtu.be')) {
                links.push(obj);
            }
            return links;
        }
        if (typeof obj === 'object') {
            for (const key in obj) {
                findYouTubeLinks(obj[key], links);
            }
        }
        return links;
    }

    // We need structure. Let's dump a simplified version of the structure if possible.
    // Or just look for the "First Big Title" in the JSON.
    
    console.log('Data keys:', Object.keys(data));
    if (data.props) console.log('Props keys:', Object.keys(data.props));
    
    // Save to file to inspect if needed, or just print findings
    const links = findYouTubeLinks(data);
    console.log(`Found ${links.length} YouTube links in JSON.`);
    console.log(links.slice(0, 5));

  } catch (error) {
    console.error(error);
  }
}

extractNextData();
