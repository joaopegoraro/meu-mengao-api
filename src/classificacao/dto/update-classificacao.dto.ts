import { PartialType } from '@nestjs/mapped-types';
import { CreateClassificacaoDto } from './create-classificacao.dto';

export class UpdateClassificacaoDto extends PartialType(CreateClassificacaoDto) {}
