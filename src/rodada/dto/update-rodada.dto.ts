import { PartialType } from '@nestjs/mapped-types';
import { CreateRodadaDto } from './create-rodada.dto';

export class UpdateRodadaDto extends PartialType(CreateRodadaDto) {}
