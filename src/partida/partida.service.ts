import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { Partida } from './entities/partida.entity';

@Injectable()
export class PartidaService {
  constructor(
    @InjectRepository(Partida)
    private partidaRepository: Repository<Partida>,
  ) { }

  async create(createPartidaDto: CreatePartidaDto) {
    return await this.partidaRepository.save(createPartidaDto);
  }

  async findProximaPartida() {
    return await this.partidaRepository.find({
      where: {
        partidaFlamengo: true,
        data: MoreThanOrEqual(Date.now().toString()),
      },
      order: {
        data: "ASC",
      },
      take: 1
    });
  }

  async findResultados() {
    return await this.partidaRepository.find({
      where: {
        partidaFlamengo: true,
        data: LessThan(Date.now().toString()),
      }
    });
  }

  async findCalendario() {
    return await this.partidaRepository.find({
      where: {
        partidaFlamengo: true,
        data: MoreThanOrEqual(Date.now().toString()),
      }
    });
  }

  async findWithCampeonatoId(campeonatoId: string) {
    return await this.partidaRepository.find({
      where: {
        campeonatoId: campeonatoId
      },
    });
  }

  async findWithRodadaIndex(campeonatoId: string, rodadaIndex: number) {
    return await this.partidaRepository.find({
      where: {
        campeonatoId: campeonatoId,
        rodadaIndex: rodadaIndex,
      },
    });
  }


  async removeWithCampeonatoId(campeonatoId: string) {
    return await this.partidaRepository.delete({
      campeonatoId: campeonatoId
    });
  }
}
