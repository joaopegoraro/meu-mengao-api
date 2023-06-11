import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateMataMataDto } from './dto/create-mata-mata.dto';
import { UpdateMataMataDto } from './dto/update-mata-mata.dto';
import { MataMatasService } from './mata-matas.service';

@Controller('mata-matas')
export class MataMatasController {
  constructor(private readonly mataMatasService: MataMatasService) { }

  @Post()
  create(@Body() createMataMataDto: CreateMataMataDto) {
    return this.mataMatasService.create(createMataMataDto);
  }

  @Get()
  findAll() {
    return this.mataMatasService.findAll();
  }

  @Get('campeonato/:campeonatoId')
  findAllWithCampeonatoId(@Param('campeonatoId') campeonatoId: number) {
    return this.mataMatasService.findWithCampeonatoId(campeonatoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mataMatasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMataMataDto: UpdateMataMataDto) {
    return this.mataMatasService.update(+id, updateMataMataDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mataMatasService.remove(+id);
  }
}
