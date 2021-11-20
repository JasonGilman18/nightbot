import fetch from 'node-fetch';

export default class WebScraperService {
    
    static SCRAPE_URL = "https://funnysentences.com/sentence-generator/";

    constructor() {}

    process() {
        return this.getWebsitePage()
            .then(webpage => this.extractSenteceFromScrape(webpage));
    }

    getWebsitePage() {
        return fetch(WebScraperService.SCRAPE_URL)
            .then(response => response.text());
    }

    extractSenteceFromScrape(webpageText) {
        const sentenceStartSearchString = 'id="sentencegen">';
        const sentenceEndSearchString = '</div>';
        
        let sentenceStartIndex = webpageText.indexOf(sentenceStartSearchString);
        sentenceStartIndex += sentenceStartSearchString.length;
        let sentenceEndIndex = webpageText.indexOf(sentenceEndSearchString, sentenceStartIndex);

        return webpageText.substring(sentenceStartIndex, sentenceEndIndex);
    }
}