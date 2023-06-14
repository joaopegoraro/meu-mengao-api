import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment';
import { CampeonatosScraperService } from './campeonatos-scraper.service';
import { NoticiasScraperService } from './noticias-scraper.service';
import { PartidasScraperService } from './partidas-scraper.service';
import { YoutubeScraperService } from './youtube-scraper.service';

@Injectable()
export class ScraperService {
    constructor(
        private readonly noticiasScraper: NoticiasScraperService,
        private readonly youtubeScraper: YoutubeScraperService,
        private readonly partidasScraper: PartidasScraperService,
        private readonly campeonatosScraper: CampeonatosScraperService,
    ) { }

    @Cron(CronExpression.EVERY_HOUR)
    async scrapeData(): Promise<void> {
        await this.noticiasScraper.scrapeNoticias();
        await this.youtubeScraper.scrapeYoutube();
        await this.partidasScraper.scrapePartidas();
        await this.campeonatosScraper.scrapeCampeonatos();

        console.log(`SCRAPING CONCLUÍDO (${moment().format()})`)
    }
}

