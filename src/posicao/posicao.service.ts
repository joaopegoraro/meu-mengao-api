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

  async create(createPosicaoDto: CreatePosicaoDto) {
    return await this.posicaoRepository.save(createPosicaoDto);
  }

  async findWithCampeonatoId(campeonatoId: string) {
    return await this.posicaoRepository.find({
      where: {
        campeonatoId: campeonatoId
      },
    });
  }

  async removeWithCampeonatoId(campeonatoId: string) {
    return await this.posicaoRepository.delete({
      campeonatoId: campeonatoId
    });
  }
}
