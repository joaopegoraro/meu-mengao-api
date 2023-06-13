import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';
import { Partida } from './entities/partida.entity';

@Injectable()
export class PartidaService {
  constructor(
    @InjectRepository(Partida)
    private partidaRepository: Repository<Partida>,
  ) { }

  create(createPartidaDto: CreatePartidaDto) {
    return this.partidaRepository.save(createPartidaDto);
  }

  async findAll() {
    return await this.partidaRepository.find();
  }

  async findWithRodadaId(rodadaId: number) {
    return await this.partidaRepository.find({
      where: {
        rodadaId: rodadaId
      },
    });
  }

  async findOne(id: string) {
    return await this.partidaRepository.findOneBy({ id });
  }


  async update(id: number, updatePartidaDto: UpdatePartidaDto) {
    return await this.partidaRepository.update(id, updatePartidaDto);
  }

  async remove(id: number) {
    return await this.partidaRepository.delete(id);
  }

  async removeWithCampeonatoId(campeonatoId: string) {
    return await this.partidaRepository.delete({
      campeonatoId: campeonatoId
    });
  }
}
