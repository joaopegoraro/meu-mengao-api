import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { Noticia } from './entities/noticia.entity';

@Injectable()
export class NoticiasService {
  constructor(
    @InjectRepository(Noticia)
    private noticiaRepository: Repository<Noticia>,
  ) { }

  async create(createNoticiaDto: CreateNoticiaDto) {
    return await this.noticiaRepository.save(createNoticiaDto);
  }

  async findAll() {
    return await this.noticiaRepository.find();
  }

  async removeWithSite(site: string) {
    return await this.noticiaRepository.delete({ site: site });
  }
}
