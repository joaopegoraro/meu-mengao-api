import { Controller, Get, Param } from '@nestjs/common';
import { PosicaoService } from './posicao.service';

@Controller('posicao')
export class PosicaoController {
  constructor(private readonly posicaoService: PosicaoService) { }

  @Get('campeonato/:campeonatoId')
  async findAllWithCampeonatoId(@Param('campeonatoId') campeonatoId: string) {
    return this.posicaoService.findWithCampeonatoId(campeonatoId);
  }
}
