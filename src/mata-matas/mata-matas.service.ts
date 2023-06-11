import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMataMataDto } from './dto/create-mata-mata.dto';
import { UpdateMataMataDto } from './dto/update-mata-mata.dto';
import { MataMata } from './entities/mata-mata.entity';

@Injectable()
export class MataMatasService {

  constructor(
    @InjectRepository(MataMata)
    private mataMatasRepository: Repository<MataMata>,
  ) { }

  create(createMataMataDto: CreateMataMataDto) {
    return this.mataMatasRepository.save(createMataMataDto);
  }

  async findAll() {
    return await this.mataMatasRepository.find();
  }

  async findWithCampeonatoId(campeonatoId: number) {
    return await this.mataMatasRepository.find({
      where: {
        campeonatoId: campeonatoId
      },
    });
  }

  async findOne(id: number) {
    return await this.mataMatasRepository.findOneBy({ id });
  }


  async update(id: number, updateMataMataDto: UpdateMataMataDto) {
    return await this.mataMatasRepository.update(id, updateMataMataDto);
  }

  async remove(id: number) {
    return await this.mataMatasRepository.delete(id);
  }
}
