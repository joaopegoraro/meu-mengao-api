import { BadRequestException, Controller, Get, Logger, NotFoundException, Param } from '@nestjs/common';
import { PartidaService } from './partida.service';

@Controller('partidas')
export class PartidaController {
  constructor(private readonly partidaService: PartidaService) { }

  private readonly logger = new Logger(PartidaController.name);

  @Get('proxima')
  async findProximaPartida() {
    try {
      const proximaPartida = await this.partidaService.findProximaPartida();
      if (!proximaPartida) {
        throw new NotFoundException("Não foi encontrada nenhuma partida");
      }
      return proximaPartida;

    } catch (e: unknown) {
      this.logger.error(e)
      throw e;
    }
  }

  @Get('resultados')
  async findResultados() {
    try {
      const resultados = await this.partidaService.findResultados();
      if (!resultados || resultados.length == 0) {
        throw new NotFoundException("Não foi encontrado nenhum resultado");
      }
      return resultados;

    } catch (e: unknown) {
      this.logger.error(e)
      throw e;
    }
  }

  @Get('calendario')
  async findCalendario() {
    try {
      const calendario = await this.partidaService.findCalendario();
      if (!calendario || calendario.length == 0) {
        throw new NotFoundException("Não foi encontrado nenhuma partida");
      }
      return calendario;

    } catch (e: unknown) {
      this.logger.error(e)
      throw e;
    }
  }

  @Get('campeonato/:campeonatoId/:rodadaIndex')
  async findAllWithRodadaIndex(
    @Param('campeonatoId') campeonatoId: string,
    @Param('rodadaIndex') rodadaIndex: number,
  ) {
    try {
      if (!campeonatoId) {
        throw new BadRequestException("O campeonatoId precisa ser um id válido");
      } else if (!rodadaIndex) {
        throw new BadRequestException("A rodadaIndex precisa ser um index válido");
      }

      const partidas = await this.partidaService.findWithRodadaIndex(campeonatoId, rodadaIndex);
      if (!partidas || partidas.length == 0) {
        throw new NotFoundException("Não foi encontrado nenhuma partida");
      }
      return partidas;

    } catch (e: unknown) {
      this.logger.error(e)
      throw e;
    }
  }

  @Get('campeonato/:campeonatoId')
  async findAllWithCampeonatoId(
    @Param('campeonatoId') campeonatoId: string,
  ) {
    try {
      if (!campeonatoId) {
        throw new BadRequestException("O campeonatoId precisa ser um id válido");
      }

      const partidas = await this.partidaService.findWithCampeonatoId(campeonatoId);
      if (!partidas || partidas.length == 0) {
        throw new NotFoundException("Não foi encontrado nenhuma partida");
      }
      return partidas;

    } catch (e: unknown) {
      this.logger.error(e)
      throw e;
    }
  }
}
