import { Controller, Get } from '@nestjs/common';
import { CampeonatosService } from './campeonatos.service';

@Controller('campeonatos')
export class CampeonatosController {
  constructor(private readonly campeonatosService: CampeonatosService) { }

  @Get()
  async findAll() {
    return await this.campeonatosService.findAll();
  }
}
