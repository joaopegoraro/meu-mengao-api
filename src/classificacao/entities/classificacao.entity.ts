import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Classificacao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    campeonatoId: string;
}
