import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';
import { PartidaService } from './partida.service';

@Controller('partida')
export class PartidaController {
  constructor(private readonly partidaService: PartidaService) { }

  @Post()
  create(@Body() createPartidaDto: CreatePartidaDto) {
    return this.partidaService.create(createPartidaDto);
  }

  @Get()
  findAll() {
    return this.partidaService.findAll();
  }

  @Get('rodada/:rodadaId')
  findAllWithRodadaId(@Param('rodadaId') rodadaId: number) {
    return this.partidaService.findWithRodadaId(rodadaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partidaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartidaDto: UpdatePartidaDto) {
    return this.partidaService.update(+id, updatePartidaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partidaService.remove(+id);
  }
}
