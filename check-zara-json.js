
const fs = require('fs');
const videos = JSON.parse(fs.readFileSync('zara-final.json'));
console.log(videos);
