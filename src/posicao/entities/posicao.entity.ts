import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Posicao {
    @PrimaryColumn()
    id: number;

    @Column()
    posicao: string;

    @Column()
    nomeTime: string;

    @Column({ type: 'text' })
    escudoTime: string;

    @Column()
    pontos: string;

    @Column()
    jogos: string;

    @Column()
    vitorias: string;

    @Column()
    empates: string;

    @Column()
    derrotas: string;

    @Column()
    golsFeitos: string;

    @Column()
    golsSofridos: string;

    @Column()
    saldoGols: string;

    @Column()
    campeonatoId: string;

    @Column()
    classificacaoName: string;

    @Column()
    classificacaoIndex: number;
}
