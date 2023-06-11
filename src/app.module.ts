import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './auth/auth.middleware';
import { CampeonatosModule } from './campeonatos/campeonatos.module';
import { ClassificacaoModule } from './classificacao/classificacao.module';
import { NoticiasModule } from './noticias/noticias.module';
import { PartidaModule } from './partida/partida.module';
import { PosicaoModule } from './posicao/posicao.module';
import { RodadaModule } from './rodada/rodada.module';

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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*', method: RequestMethod.ALL
    });
  }
}
