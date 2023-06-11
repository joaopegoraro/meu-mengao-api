import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRodadaDto } from './dto/create-rodada.dto';
import { UpdateRodadaDto } from './dto/update-rodada.dto';
import { Rodada } from './entities/rodada.entity';

@Injectable()
export class RodadaService {
  constructor(
    @InjectRepository(Rodada)
    private rodadaRepository: Repository<Rodada>,
  ) { }

  create(createRodadaDto: CreateRodadaDto) {
    return this.rodadaRepository.save(createRodadaDto);
  }

  async findAll() {
    return await this.rodadaRepository.find();
  }

  async findWithCampeonatoId(campeonatoId: number) {
    return await this.rodadaRepository.find({
      where: {
        campeonatoId: campeonatoId
      },
    });
  }

  async findWithClassificacaoId(classificacaoId: number) {
    return await this.rodadaRepository.find({
      where: {
        classificacaoId: classificacaoId
      },
    });
  }

  async findOne(id: number) {
    return await this.rodadaRepository.findOneBy({ id });
  }


  async update(id: number, updateRodadaDto: UpdateRodadaDto) {
    return await this.rodadaRepository.update(id, updateRodadaDto);
  }

  async remove(id: number) {
    return await this.rodadaRepository.delete(id);
  }
}
