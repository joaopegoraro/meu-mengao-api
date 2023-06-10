import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampeonatosModule } from './campeonatos/campeonatos.module';
import { Campeonato } from './campeonatos/entities/campeonato.entity';

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
      entities: [Campeonato],
      synchronize: true,
    }),
    CampeonatosModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
