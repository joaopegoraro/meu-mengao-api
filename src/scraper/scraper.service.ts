import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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

    @Cron(CronExpression.EVERY_30_SECONDS)
    async scrapeData() {
        //await this.noticiasScraper.scrapeNoticias();
        //await this.youtubeScraper.scrapeYoutube();
        await this.partidasScraper.scrapePartidas();
        //await this.campeonatosScraper.scrapeCampeonatos();

        console.log("SCRAPING CONCLUÍDO")
    }
}

