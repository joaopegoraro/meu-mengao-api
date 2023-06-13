import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posicao } from './entities/posicao.entity';
import { PosicaoController } from './posicao.controller';
import { PosicaoService } from './posicao.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posicao])],
  exports: [
    TypeOrmModule,
    PosicaoService,
  ],
  controllers: [PosicaoController],
  providers: [PosicaoService]
})
export class PosicaoModule { }
