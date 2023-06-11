import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampeonatosModule } from './campeonatos/campeonatos.module';
import { MataMatasModule } from './mata-matas/mata-matas.module';

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
    MataMatasModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
