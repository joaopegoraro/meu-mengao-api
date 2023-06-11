import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MataMata } from './entities/mata-mata.entity';
import { MataMatasController } from './mata-matas.controller';
import { MataMatasService } from './mata-matas.service';

@Module({
  imports: [TypeOrmModule.forFeature([MataMata])],
  exports: [TypeOrmModule],
  controllers: [MataMatasController],
  providers: [MataMatasService]
})
export class MataMatasModule { }
