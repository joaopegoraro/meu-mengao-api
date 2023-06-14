import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { NoticiasService } from './noticias.service';

@Controller('noticias')
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) { }

  @Post()
  async create(@Body() createNoticiaDto: CreateNoticiaDto) {
    return this.noticiasService.create(createNoticiaDto);
  }

  @Get()
  async findAll() {
    return this.noticiasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.noticiasService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNoticiaDto: UpdateNoticiaDto) {
    return this.noticiasService.update(+id, updateNoticiaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.noticiasService.remove(+id);
  }
}
