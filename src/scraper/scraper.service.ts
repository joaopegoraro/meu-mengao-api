import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';
import { Classificacao } from 'src/classificacao/entities/classificacao.entity';
import { Noticia } from 'src/noticias/entities/noticia.entity';
import { Partida } from 'src/partida/entities/partida.entity';
import { Posicao } from 'src/posicao/entities/posicao.entity';
import { Rodada } from 'src/rodada/entities/rodada.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScraperService {
    constructor(
        @InjectRepository(Partida)
        private partidaRepository: Repository<Partida>,
        @InjectRepository(Rodada)
        private rodadaRepository: Repository<Rodada>,
        @InjectRepository(Noticia)
        private noticiaRepository: Repository<Noticia>,
        @InjectRepository(Classificacao)
        private classificacaoRepository: Repository<Classificacao>,
        @InjectRepository(Campeonato)
        private campeonatosRepository: Repository<Campeonato>,
        @InjectRepository(Posicao)
        private posicaoRepository: Repository<Posicao>,
    ) { }

}
