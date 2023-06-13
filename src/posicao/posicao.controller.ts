import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePosicaoDto } from './dto/create-posicao.dto';
import { UpdatePosicaoDto } from './dto/update-posicao.dto';
import { PosicaoService } from './posicao.service';

@Controller('posicao')
export class PosicaoController {
  constructor(private readonly posicaoService: PosicaoService) { }

  @Post()
  create(@Body() createPosicaoDto: CreatePosicaoDto) {
    return this.posicaoService.create(createPosicaoDto);
  }

  @Get()
  findAll() {
    return this.posicaoService.findAll();
  }

  @Get('classificacao/:campeonatoId')
  findAllWithClassificacaoId(@Param('campeonatoId') campeonatoId: string) {
    return this.posicaoService.findWithCampeonatoId(campeonatoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posicaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePosicaoDto: UpdatePosicaoDto) {
    return this.posicaoService.update(+id, updatePosicaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posicaoService.remove(+id);
  }
}
