import { Injectable } from '@nestjs/common';
import { NoticiasScraperService } from './noticias-scraper.service';
import { YoutubeScraperService } from './youtube-scraper.service';

@Injectable()
export class ScraperService {
    constructor(
        private readonly noticiasScraper: NoticiasScraperService,
        private readonly youtubeScraper: YoutubeScraperService,
    ) { }

    //@Cron(CronExpression.EVERY_5_SECONDS)
    async scrapeData() {
        this.noticiasScraper.scrapeNoticias();
        this.youtubeScraper.scrapeYoutube();
    }
}

