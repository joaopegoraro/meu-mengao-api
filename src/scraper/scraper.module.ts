import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NoticiasModule } from '../noticias/noticias.module';
import { PartidaModule } from '../partida/partida.module';
import { NoticiasScraperService } from './noticias-scraper.service';
import { PartidasScraperService } from './partidas-scraper.service';
import { ScraperService } from './scraper.service';
import { YoutubeScraperService } from './youtube-scraper.service';

@Module({
  imports: [
    HttpModule,
    NoticiasModule,
    PartidaModule,
  ],
  providers: [
    ScraperService,
    NoticiasScraperService,
    YoutubeScraperService,
    PartidasScraperService,
  ]
})
export class ScraperModule { }
