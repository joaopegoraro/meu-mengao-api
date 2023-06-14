import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePosicaoDto } from './dto/create-posicao.dto';
import { UpdatePosicaoDto } from './dto/update-posicao.dto';
import { Posicao } from './entities/posicao.entity';

@Injectable()
export class PosicaoService {
  constructor(
    @InjectRepository(Posicao)
    private posicaoRepository: Repository<Posicao>,
  ) { }

  create(createPosicaoDto: CreatePosicaoDto) {
    return this.posicaoRepository.save(createPosicaoDto);
  }

  async findAll() {
    return await this.posicaoRepository.find();
  }

  async findWithCampeonatoId(campeonatoId: string) {
    return await this.posicaoRepository.find({
      where: {
        campeonatoId: campeonatoId
      },
    });
  }

  async findOne(id: string) {
    return await this.posicaoRepository.findOneBy({ id });
  }


  async update(id: number, updatePosicaoDto: UpdatePosicaoDto) {
    return await this.posicaoRepository.update(id, updatePosicaoDto);
  }

  async remove(id: number) {
    return await this.posicaoRepository.delete(id);
  }

  async removeWithCampeonatoId(campeonatoId: string) {
    return await this.posicaoRepository.delete({
      campeonatoId: campeonatoId
    });
  }
}
