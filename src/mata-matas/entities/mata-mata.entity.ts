import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class MataMata {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    campeonatoId: number;
}
