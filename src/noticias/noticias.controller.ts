import { Controller, Get } from '@nestjs/common';
import { NoticiasService } from './noticias.service';

@Controller('noticias')
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) { }

  @Get()
  async findAll() {
    return this.noticiasService.findAll();
  }
}
