import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rodada } from './entities/rodada.entity';
import { RodadaController } from './rodada.controller';
import { RodadaService } from './rodada.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rodada])],
  exports: [TypeOrmModule],
  controllers: [RodadaController],
  providers: [RodadaService]
})
export class RodadaModule { }
