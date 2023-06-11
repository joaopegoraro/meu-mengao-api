import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassificacaoDto } from './dto/create-classificacao.dto';
import { UpdateClassificacaoDto } from './dto/update-classificacao.dto';
import { Classificacao } from './entities/classificacao.entity';

@Injectable()
export class ClassificacaoService {
  constructor(
    @InjectRepository(Classificacao)
    private classificacaoRepository: Repository<Classificacao>,
  ) { }

  create(createClassificacaoDto: CreateClassificacaoDto) {
    return this.classificacaoRepository.save(createClassificacaoDto);
  }

  async findAll() {
    return await this.classificacaoRepository.find();
  }

  async findWithCampeonatoId(campeonatoId: number) {
    return await this.classificacaoRepository.find({
      where: {
        campeonatoId: campeonatoId
      },
    });
  }

  async findOne(id: number) {
    return await this.classificacaoRepository.findOneBy({ id });
  }


  async update(id: number, updateClassificacaoDto: UpdateClassificacaoDto) {
    return await this.classificacaoRepository.update(id, updateClassificacaoDto);
  }

  async remove(id: number) {
    return await this.classificacaoRepository.delete(id);
  }
}
