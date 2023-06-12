import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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
