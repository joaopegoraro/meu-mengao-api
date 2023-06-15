import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment';
import { CampeonatosScraperService } from './campeonatos-scraper.service';
import { NoticiasScraperService } from './noticias-scraper.service';
import { YoutubeScraperService } from './youtube-scraper.service';

@Injectable()
export class ScraperService {
    constructor(
        private readonly noticiasScraper: NoticiasScraperService,
        private readonly youtubeScraper: YoutubeScraperService,
        private readonly campeonatosScraper: CampeonatosScraperService,
    ) { }

    private readonly logger = new Logger(ScraperService.name);

    @Cron(CronExpression.EVERY_HOUR)
    async scrapeData(): Promise<void> {
        try {
            this.logger.log(`SCRAPING INICIADO (${moment().format()})`)

            await this.noticiasScraper.scrapeNoticias();
            await this.youtubeScraper.scrapeYoutube();
            await this.campeonatosScraper.scrapeCampeonatos();

            this.logger.log(`SCRAPING CONCLUÍDO (${moment().format()})`)
        } catch (e: unknown) {
            if (e instanceof Error) {
                this.logger.error(e.message, e.stack)
            } else {
                this.logger.error(e)
            }
        }
    }
}

