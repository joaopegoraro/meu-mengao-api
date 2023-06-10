import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCampeonatoDto } from './dto/create-campeonato.dto';
import { UpdateCampeonatoDto } from './dto/update-campeonato.dto';
import { Campeonato } from './entities/campeonato.entity';

@Injectable()
export class CampeonatosService {
  constructor(
    @InjectRepository(Campeonato)
    private campeonatosRepository: Repository<Campeonato>,
  ) { }

  create(createCampeonatoDto: CreateCampeonatoDto) {
    this.campeonatosRepository.save(createCampeonatoDto);
  }

  async findAll() {
    return this.campeonatosRepository.find();
  }

  async findOne(id: number) {
    return this.campeonatosRepository.findOneBy({ id });
  }

  async update(id: number, updateCampeonatoDto: UpdateCampeonatoDto) {
    await this.campeonatosRepository.update(id, updateCampeonatoDto);
  }

  async remove(id: number) {
    await this.campeonatosRepository.delete(id);
  }
}
