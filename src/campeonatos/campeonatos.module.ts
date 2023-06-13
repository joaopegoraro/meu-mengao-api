import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampeonatosController } from './campeonatos.controller';
import { CampeonatosService } from './campeonatos.service';
import { Campeonato } from './entities/campeonato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campeonato])],
  exports: [
    TypeOrmModule,
    CampeonatosService,
  ],
  controllers: [CampeonatosController],
  providers: [CampeonatosService]
})
export class CampeonatosModule { }
