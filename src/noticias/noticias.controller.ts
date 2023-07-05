import { Controller, Get, Logger, NotFoundException } from '@nestjs/common';
import { NoticiasService } from './noticias.service';

@Controller('noticias')
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) { }

  private readonly logger = new Logger(NoticiasController.name);

  @Get()
  async findAll() {
    try {
      const noticias = await this.noticiasService.findAll();

      if (!noticias || noticias.length == 0) {
        throw new NotFoundException("Não foi encontrado nenhuma notícia");
      }

      return noticias;
    } catch (e: unknown) {
      this.logger.error(e)
      throw e;
    }
  }
}
