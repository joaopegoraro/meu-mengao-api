import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Module({
  imports: [HttpModule],
  providers: [ScraperService]
})
export class ScraperModule { }
