import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Rodada {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    campeonatoId: number;

    @Column()
    classificacaoId: number;
}
