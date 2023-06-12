import { Injectable } from '@nestjs/common';
import { NoticiasScraperService } from './noticias-scraper.service';

@Injectable()
export class ScraperService {
    constructor(
        private readonly noticiasScraper: NoticiasScraperService,
    ) { }

    //@Cron(CronExpression.EVERY_5_SECONDS)
    async scrapeData() {
        this.noticiasScraper.scrapeNoticias();
    }
}

