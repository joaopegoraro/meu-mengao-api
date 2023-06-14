import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCampeonatoDto } from './dto/create-campeonato.dto';
import { Campeonato } from './entities/campeonato.entity';

@Injectable()
export class CampeonatosService {
  constructor(
    @InjectRepository(Campeonato)
    private campeonatosRepository: Repository<Campeonato>,
  ) { }

  async create(createCampeonatoDto: CreateCampeonatoDto) {
    return await this.campeonatosRepository.save(createCampeonatoDto);
  }

  async findAll() {
    return await this.campeonatosRepository.find();
  }

  async findOne(id: string) {
    return await this.campeonatosRepository.findOneBy({ id });
  }
}
