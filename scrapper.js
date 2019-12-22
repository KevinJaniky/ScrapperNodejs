const axios = require('axios');
const to = require('./helpers/to');
const cheerio = require('cheerio');

module.exports = class Scrapper {
    constructor() {
        this.err = '';
    }

    setSearchEngine(engine) {
        this.engine = engine;
        switch (engine) {
            case 'google':
                return 'https://www.google.fr/search?';
            case 'bing':
                return 'https://www.bing.com/search?';
            case 'duckduckgo':
                return 'https://duckduckgo.com/html/?';
            case 'lycos':
                return 'https://search.lycos.fr/web/?';
        }
    }

    setBasePath(engine, bp) {
        this.basePath = this.setSearchEngine(engine) + 'q=' + bp;
    }


    async sendRequest() {
        let that = this;
        return await new Promise(async function (resolve, reject) {
            await axios.get(that.basePath)
                .then((d) => {
                    return resolve(d.data);
                })
                .catch((e) => {
                    console.log(e);
                    return reject(e);
                })
        })
    }

    async getResponse() {
        [this.err, this.data] = await to(this.sendRequest());
        return this.getResultGoogle();
    }

    getResultGoogle() {
        if (this.err !== null) {
            return {'error': true, 'message': 'Une erreur est survenue'};
        }
        let $ = cheerio.load(this.data);
        let tmp = [];

        if (this.engine === 'bing') {
            $('#b_results > .b_algo ').each(function (i, el) {
                tmp.push({
                    text: $(this).find("a").text(),
                    url: $(this).find('a').attr('href'),
                    desc: $(this).find('.b_caption p').text()
                });
            });

        } else if (this.engine === 'google') {
            $('.ZINbbc.xpd.O9g5cc.uUPGi:not(.BmP5tf,.wEsjbd)').each(function (i, el) {
                tmp.push({
                    text: $(this).text(),
                    url: $(this).find('a').attr('href')
                });
            });
        } else if (this.engine === 'duckduckgo') {

            $('.results .result__body').each(function () {
                tmp.push({
                    text: $(this).find('h2 > a').text(),
                    url: $(this).find('h2 > a').attr('href'),
                    desc: $(this).find('.result__snippet').text()
                });
            })
        } else if (this.engine === 'lycos') {
            $('li.result-item').each(function () {
                tmp.push({
                    text: $(this).find('.result-title').text(),
                    url: $(this).find('.result-url').text(),
                    desc: $(this).find('.result-description').text(),
                })
            });

        }
        return tmp;
    }

};
