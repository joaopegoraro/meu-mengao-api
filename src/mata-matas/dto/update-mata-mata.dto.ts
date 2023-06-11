import { PartialType } from '@nestjs/mapped-types';
import { CreateMataMataDto } from './create-mata-mata.dto';

export class UpdateMataMataDto extends PartialType(CreateMataMataDto) {}
