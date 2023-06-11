import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampeonatosModule } from './campeonatos/campeonatos.module';
import { ClassificacaoModule } from './classificacao/classificacao.module';
import { PosicaoModule } from './posicao/posicao.module';
import { RodadaModule } from './rodada/rodada.module';
import { PartidaModule } from './partida/partida.module';
import { NoticiasModule } from './noticias/noticias.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'meumengao',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CampeonatosModule,
    ClassificacaoModule,
    PosicaoModule,
    RodadaModule,
    PartidaModule,
    NoticiasModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
