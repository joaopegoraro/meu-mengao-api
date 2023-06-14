import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';
import { PartidaService } from './partida.service';

@Controller('partida')
export class PartidaController {
  constructor(private readonly partidaService: PartidaService) { }

  @Post()
  async create(@Body() createPartidaDto: CreatePartidaDto) {
    return this.partidaService.create(createPartidaDto);
  }

  @Get()
  async findAll() {
    return this.partidaService.findAll();
  }

  @Get('rodada/:campeonatoId/:rodadaIndex')
  async findAllWithRodadaId(
    @Param('campeonatoId') campeonatoId: string,
    @Param('rodadaIndex') rodadaIndex: number,
  ) {
    return this.partidaService.findWithRodadaIndex(campeonatoId, rodadaIndex);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.partidaService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePartidaDto: UpdatePartidaDto) {
    return this.partidaService.update(+id, updatePartidaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.partidaService.remove(+id);
  }
}
