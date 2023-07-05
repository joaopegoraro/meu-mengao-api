import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: "sqlite",
          database: "db.sqlite3",
          autoLoadEntities: true,
          entities: [
            Campeonato,
            Noticia,
            Partida,
            Posicao,
          ],
          synchronize: true,
        };
      },
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
