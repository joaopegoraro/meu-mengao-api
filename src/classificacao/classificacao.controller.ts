import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ClassificacaoService } from './classificacao.service';
import { CreateClassificacaoDto } from './dto/create-classificacao.dto';
import { UpdateClassificacaoDto } from './dto/update-classificacao.dto';

@Controller('classificacao')
export class ClassificacaoController {
  constructor(private readonly classificacaoService: ClassificacaoService) { }

  @Post()
  create(@Body() createClassificacaoDto: CreateClassificacaoDto) {
    return this.classificacaoService.create(createClassificacaoDto);
  }

  @Get()
  findAll() {
    return this.classificacaoService.findAll();
  }

  @Get('campeonato/:campeonatoId')
  findAllWithCampeonatoId(@Param('campeonatoId') campeonatoId: number) {
    return this.classificacaoService.findWithCampeonatoId(campeonatoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classificacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassificacaoDto: UpdateClassificacaoDto) {
    return this.classificacaoService.update(+id, updateClassificacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classificacaoService.remove(+id);
  }
}
