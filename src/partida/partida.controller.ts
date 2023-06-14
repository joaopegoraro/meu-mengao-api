import { Controller, Get, Param } from '@nestjs/common';
import { PartidaService } from './partida.service';

@Controller('partidas')
export class PartidaController {
  constructor(private readonly partidaService: PartidaService) { }

  @Get('proxima')
  async findProximaPartida() {
    const proximaPartida = await this.partidaService.findProximaPartida();
    if (proximaPartida)
    return proximaPartida;
  }

  @Get('resultados')
  async findResultados() {
    return this.partidaService.findResultados();
  }

  @Get('calendario')
  async findCalendario() {
    return this.partidaService.findCalendario();
  }

  @Get('campeonato/:campeonatoId/:rodadaIndex')
  async findAllWithRodadaIndex(
    @Param('campeonatoId') campeonatoId: string,
    @Param('rodadaIndex') rodadaIndex: number,
  ) {
    return this.partidaService.findWithRodadaIndex(campeonatoId, rodadaIndex);
  }

  @Get('campeonato/:campeonatoId')
  async findAllWithCampeonatoId(
    @Param('campeonatoId') campeonatoId: string,
  ) {
    return this.partidaService.findWithCampeonatoId(campeonatoId);
  }
}
