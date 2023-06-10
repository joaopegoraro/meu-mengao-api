import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Campeonato {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;
}
