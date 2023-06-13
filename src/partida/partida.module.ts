import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partida } from './entities/partida.entity';
import { PartidaController } from './partida.controller';
import { PartidaService } from './partida.service';

@Module({
  imports: [TypeOrmModule.forFeature([Partida])],
  exports: [
    TypeOrmModule,
    PartidaService,
  ],
  controllers: [PartidaController],
  providers: [PartidaService]
})
export class PartidaModule { }
