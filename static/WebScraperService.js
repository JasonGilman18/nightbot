import fetch from 'node-fetch';

export default class WebScraperService {

    static SECONDS_TO_MILLISECONDS = 1000;

    constructor() {}

    process() {
        return this.getWebsitePage()
            .then(webpage => this.extractSenteceFromScrape(webpage));
    }

    getWebsitePage() {
        return fetch("https://funnysentences.com/sentence-generator/")
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