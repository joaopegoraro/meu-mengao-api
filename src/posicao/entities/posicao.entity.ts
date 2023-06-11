import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Posicao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    posicao: number;

    @Column()
    nomeTime: string;

    @Column()
    pontos: number;

    @Column()
    jogos: number;

    @Column()
    vitorias: number;

    @Column()
    empates: number;

    @Column()
    derrotas: number;

    @Column()
    golsFeitos: number;

    @Column()
    golsSofridos: number;

    @Column()
    saldoGols: number;

    @Column()
    classificacaoId: number;
}
