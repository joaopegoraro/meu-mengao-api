import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassificacaoController } from './classificacao.controller';
import { ClassificacaoService } from './classificacao.service';
import { Classificacao } from './entities/classificacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Classificacao])],
  exports: [TypeOrmModule],
  controllers: [ClassificacaoController],
  providers: [ClassificacaoService]
})
export class ClassificacaoModule { }
