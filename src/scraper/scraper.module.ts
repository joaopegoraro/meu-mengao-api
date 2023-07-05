import { Module } from '@nestjs/common';
import { CampeonatosModule } from '../campeonatos/campeonatos.module';
import { NoticiasModule } from '../noticias/noticias.module';
import { PartidaModule } from '../partida/partida.module';
import { PosicaoModule } from '../posicao/posicao.module';
import { CampeonatosScraperService } from './campeonatos-scraper.service';
import { NoticiasScraperService } from './noticias-scraper.service';
import { ScraperService } from './scraper.service';
import { YoutubeScraperService } from './youtube-scraper.service';

@Module({
  imports: [
    NoticiasModule,
    PartidaModule,
    CampeonatosModule,
    PosicaoModule,
  ],
  providers: [
    ScraperService,
    NoticiasScraperService,
    YoutubeScraperService,
    CampeonatosScraperService
  ]
})
export class ScraperModule { }
