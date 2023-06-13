import { Module } from '@nestjs/common';
import { CampeonatosModule } from '../campeonatos/campeonatos.module';
import { NoticiasModule } from '../noticias/noticias.module';
import { PartidaModule } from '../partida/partida.module';
import { CampeonatosScraperService } from './campeonatos-scraper.service';
import { NoticiasScraperService } from './noticias-scraper.service';
import { PartidasScraperService } from './partidas-scraper.service';
import { ScraperService } from './scraper.service';
import { YoutubeScraperService } from './youtube-scraper.service';

@Module({
  imports: [
    NoticiasModule,
    PartidaModule,
    CampeonatosModule,
  ],
  providers: [
    ScraperService,
    NoticiasScraperService,
    YoutubeScraperService,
    PartidasScraperService,
    CampeonatosScraperService
  ]
})
export class ScraperModule { }
