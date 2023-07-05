import { BadRequestException, Controller, Get, Logger, NotFoundException, Param } from '@nestjs/common';
import { PosicaoService } from './posicao.service';

@Controller('posicao')
export class PosicaoController {
  constructor(private readonly posicaoService: PosicaoService) { }

  private readonly logger = new Logger(PosicaoController.name);

  @Get('campeonato/:campeonatoId')
  async findAllWithCampeonatoId(@Param('campeonatoId') campeonatoId: string) {
    try {
      if (!campeonatoId) {
        throw new BadRequestException("O campeonatoId precisa ser um id válido");
      }

      const posicoes = await this.posicaoService.findWithCampeonatoId(campeonatoId);

      if (!posicoes || posicoes.length == 0) {
        throw new NotFoundException("Não foi encontrado nenhuma notícia");
      }

      return posicoes;
    } catch (e: unknown) {
      this.logger.error(e)
      throw e;
    }
  }
}
