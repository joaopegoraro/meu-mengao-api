import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './auth/auth.middleware';
import { CampeonatosModule } from './campeonatos/campeonatos.module';
import { Campeonato } from './campeonatos/entities/campeonato.entity';
import { Noticia } from './noticias/entities/noticia.entity';
import { NoticiasModule } from './noticias/noticias.module';
import { Partida } from './partida/entities/partida.entity';
import { PartidaModule } from './partida/partida.module';
import { Posicao } from './posicao/entities/posicao.entity';
import { PosicaoModule } from './posicao/posicao.module';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'meumengao',
      autoLoadEntities: true,
      entities: [
        Campeonato,
        Noticia,
        Partida,
        Posicao,
      ],
      synchronize: true,
    }),
    CampeonatosModule,
    PosicaoModule,
    PartidaModule,
    NoticiasModule,
    ScraperModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*', method: RequestMethod.ALL
    });
  }
}
