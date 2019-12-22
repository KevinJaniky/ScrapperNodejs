const scrapper = require('./scrapper');
const to = require('./helpers/to');

// Require scrapper
const GoogleScrapp = new scrapper();
let result, err;

/*
Engine value possibility :
 - bing
 - google
 - duckduckgo
 - lycos
 */

async function exemple() {
    let tosearch = 'site:kevinjaniky.com';
    GoogleScrapp.setBasePath('google', tosearch);
    [err, result] = await to(GoogleScrapp.getResponse());
    console.log(result);
}

exemple();
