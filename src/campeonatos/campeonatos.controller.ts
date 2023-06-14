import { Controller, Get, Logger, NotFoundException } from '@nestjs/common';
import { CampeonatosService } from './campeonatos.service';

@Controller('campeonatos')
export class CampeonatosController {
  constructor(private readonly campeonatosService: CampeonatosService) { }

  private readonly logger = new Logger(CampeonatosController.name);

  @Get()
  async findAll() {
    try {
      const campeonatos = await this.campeonatosService.findAll();

      if (!campeonatos || campeonatos.length == 0) {
        const err = new NotFoundException("Não foi encontrado nenhum campeonato");
        throw err;
      }

      return campeonatos;
    } catch (e: unknown) {
      this.logger.error(e)
      throw e;
    }
  }
}
