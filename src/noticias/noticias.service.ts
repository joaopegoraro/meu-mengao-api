import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { Noticia } from './entities/noticia.entity';

@Injectable()
export class NoticiasService {
  constructor(
    @InjectRepository(Noticia)
    private noticiaRepository: Repository<Noticia>,
  ) { }

  create(createNoticiaDto: CreateNoticiaDto) {
    return this.noticiaRepository.save(createNoticiaDto);
  }

  async findAll() {
    return await this.noticiaRepository.find();
  }

  async findOne(id: number) {
    return await this.noticiaRepository.findOneBy({ id });
  }

  async update(id: number, updateNoticiaDto: UpdateNoticiaDto) {
    return await this.noticiaRepository.update(id, updateNoticiaDto);
  }

  async remove(id: number) {
    return await this.noticiaRepository.delete(id);
  }
}
