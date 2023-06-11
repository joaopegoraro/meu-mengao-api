import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateRodadaDto } from './dto/create-rodada.dto';
import { UpdateRodadaDto } from './dto/update-rodada.dto';
import { RodadaService } from './rodada.service';

@Controller('rodada')
export class RodadaController {
  constructor(private readonly rodadaService: RodadaService) { }

  @Post()
  create(@Body() createRodadaDto: CreateRodadaDto) {
    return this.rodadaService.create(createRodadaDto);
  }

  @Get()
  findAll() {
    return this.rodadaService.findAll();
  }

  @Get('campeonato/:campeonatoId')
  findAllWithCampeonatoId(@Param('campeonatoId') campeonatoId: number) {
    return this.rodadaService.findWithCampeonatoId(campeonatoId);
  }

  @Get('classificacao/:classificacaoId')
  findAllWithClassificacaoId(@Param('classificacaoId') classificacaoId: number) {
    return this.rodadaService.findWithClassificacaoId(classificacaoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rodadaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRodadaDto: UpdateRodadaDto) {
    return this.rodadaService.update(+id, updateRodadaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rodadaService.remove(+id);
  }
}
