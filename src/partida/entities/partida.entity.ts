import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Partida {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    data: string;

    @Column()
    timeCasa: string;

    @Column()
    timeFora: string;

    @Column()
    golsCasa: string;

    @Column()
    golsFora: string;

    @Column()
    rodadaId: number;

    @Column()
    rodadaIndex: number;
}
