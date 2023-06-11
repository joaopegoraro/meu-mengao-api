import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Classificacao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    campeonatoId: number;
}
