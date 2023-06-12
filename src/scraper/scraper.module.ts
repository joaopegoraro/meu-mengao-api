import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NoticiasModule } from '../noticias/noticias.module';
import { NoticiasScraperService } from './noticias-scraper.service';
import { ScraperService } from './scraper.service';

@Module({
  imports: [
    HttpModule,
    NoticiasModule,
  ],
  providers: [
    ScraperService,
    NoticiasScraperService,
  ]
})
export class ScraperModule { }
