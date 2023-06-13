import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Partida {
    @PrimaryColumn()
    id: string;

    @Column()
    data: string;

    @Column()
    timeCasa: string;

    @Column()
    timeFora: string;

    @Column()
    escudoCasa: string;

    @Column()
    escudoFora: string;

    @Column()
    golsCasa: string;

    @Column()
    golsFora: string;

    @Column()
    campeonato: string;

    @Column()
    rodadaId: number;

    @Column()
    rodadaIndex: number;
}
