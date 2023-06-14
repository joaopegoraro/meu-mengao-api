import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CampeonatosService } from './campeonatos.service';
import { CreateCampeonatoDto } from './dto/create-campeonato.dto';
import { UpdateCampeonatoDto } from './dto/update-campeonato.dto';

@Controller('campeonatos')
export class CampeonatosController {
  constructor(private readonly campeonatosService: CampeonatosService) { }

  @Post()
  async create(@Body() createCampeonatoDto: CreateCampeonatoDto) {
    return await this.campeonatosService.create(createCampeonatoDto);
  }

  @Get()
  async findAll() {
    return await this.campeonatosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.campeonatosService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCampeonatoDto: UpdateCampeonatoDto) {
    return await this.campeonatosService.update(id, updateCampeonatoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.campeonatosService.remove(+id);
  }
}
